import { Button } from "@/components/ui/button"
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { deleteTraining } from "@/services/trainings"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface DeleteTrainingDialogProps {
	trainingId: string;
	trainingName?: string;
}

export function DeleteTrainingDialog({
	trainingId,
	trainingName,
}: DeleteTrainingDialogProps) {
	const queryClient = useQueryClient();

	// Mutation para deletar treinamento
	const deleteMutation = useMutation({
		mutationFn: deleteTraining,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["treinamentos"] });
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao deletar treinamento:", error);
			// TODO: Adicionar toast de erro
		},
	});

	function handleDelete() {
		deleteMutation.mutate(trainingId);
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Confirmar exclusão</DialogTitle>
				<DialogDescription>
					Tem certeza de que deseja excluir o treinamento{" "}
					<strong>{trainingName}</strong>? Esta ação não pode ser desfeita e 
					afetará todos os colaboradores associados a este treinamento.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline" disabled={deleteMutation.isPending}>
						Cancelar
					</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button 
						onClick={handleDelete} 
						variant="destructive"
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? "Excluindo..." : "Confirmar exclusão"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}