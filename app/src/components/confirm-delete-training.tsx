import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteTraining } from "@/services/delete-trainings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
	allTrainings?: boolean;
}

export function ConfirmDeleteTraining({
	collaboratorId: id,
	collaboratorName,
	trainingId,
	trainingDescription,
	allTrainings,
}: AddTrainingDialogProps) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteTraining,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["colaboradores-detail", id],
			});
		},
	});

	function handleDelete() {
		mutation.mutate({
			treinamentoId: trainingId,
			colaboradorId: id,
			lastValue: !allTrainings,
		});
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
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
						onClick={handleDelete}
						disabled={mutation.status === "pending"}
						type="submit"
						variant="destructive"
					>
						{mutation.status === "pending"
							? "Excluindo..."
							: "Confirmar exclusão"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
