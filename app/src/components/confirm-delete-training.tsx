import { Button } from "@/components/ui/button"
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { deleteTraining } from "@/services/delete-trainings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
	allTrainings?: boolean;
	onClose?: () => void;
}

export function ConfirmDeleteTraining({
	collaboratorId: id,
	collaboratorName,
	trainingId,
	trainingDescription,
	allTrainings,
	onClose,
}: AddTrainingDialogProps) {
	const queryClient = useQueryClient();
	const isMountedRef = useRef(true);

	const mutation = useMutation({
		mutationFn: deleteTraining,
		onSuccess: () => {
			if (isMountedRef.current) {
				onClose?.();
			}
			queryClient.invalidateQueries({
				queryKey: ["colaboradores-detail", id],
			});
			queryClient.invalidateQueries({
				queryKey: ["treinamentos-detail", trainingId],
			});
		},
	});

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const isConfirmDisabled = mutation.status === "pending" || !id || !trainingId;

	function handleDelete() {
		if (isConfirmDisabled) {
			return;
		}
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
				<Button
					onClick={handleDelete}
					disabled={isConfirmDisabled}
					type="submit"
					variant="destructive"
				>
					{mutation.status === "pending"
						? "Excluindo..."
						: "Confirmar exclusão"}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
