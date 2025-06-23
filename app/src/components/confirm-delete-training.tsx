import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTraining } from "@/services/delete-trainings";
import { addToQueue } from "@/lib/mutation-queue";
import { createId } from "@paralleldrive/cuid2";

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
	allTrainings?: boolean;
}

interface Treinamento {
	id: string;
	colaboradorId: string;
	// ...outros campos se necessário
}

interface ColaboradorDetailCache {
	treinamentos: Treinamento[];
	// ...outros campos se necessário
}

export function ConfirmDeleteTraining({
	collaboratorId,
	collaboratorName,
	trainingId,
	trainingDescription,
	allTrainings,
}: AddTrainingDialogProps) {
	const dialog = useRef(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteTraining,
		onMutate: async (variables) => {
			await queryClient.cancelQueries({
				queryKey: ["colaboradores-detail", collaboratorId],
			});
			const previousData = queryClient.getQueryData<ColaboradorDetailCache>([
				"colaboradores-detail",
				collaboratorId,
			]);
			if (previousData && Array.isArray(previousData.treinamentos)) {
				const newData: ColaboradorDetailCache = {
					...previousData,
					treinamentos: previousData.treinamentos.filter(
						(t) =>
							t.id !== variables.treinamentoId ||
							t.colaboradorId !== variables.colaboradorId,
					),
				};
				queryClient.setQueryData(
					["colaboradores-detail", collaboratorId],
					newData,
				);
			}
			return { previousData };
		},
		onError: async (error, variables, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(
					["colaboradores-detail", collaboratorId],
					context.previousData,
				);
			}
			await addToQueue({
				id: createId(),
				table: "treinamentoColaborador",
				operation: "delete",
				data: variables,
				createdAt: Date.now(),
			});
			console.error("Erro na mutação, salva na fila offline:", error);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["colaboradores-detail", collaboratorId],
			});
		},
	});

	return (
		<DialogContent ref={dialog} className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>
					Apagar treinamento{allTrainings ? "s" : " mais recente"}
				</DialogTitle>
				<DialogDescription>
					Apagar treinamento{allTrainings ? "s" : " mais recente"} de{" "}
					{trainingDescription} para {collaboratorName || "colaborador"}
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button
						onClick={() => {
							mutation.mutate({
								treinamentoId: trainingId,
								colaboradorId: collaboratorId,
								lastValue: !allTrainings,
							});
						}}
						type="submit"
						variant="destructive"
					>
						Confirmar exclusão
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
