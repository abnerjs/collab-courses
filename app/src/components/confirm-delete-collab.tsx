import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteCollaborator } from "@/services/collaborators"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ConfirmDeleteCollabProps {
	collaboratorId: string;
	collaboratorName?: string;
}

export function ConfirmDeleteCollab({
	collaboratorId,
	collaboratorName,
}: ConfirmDeleteCollabProps) {
	const queryClient = useQueryClient();

	// Mutation para deletar colaborador
	const deleteMutation = useMutation({
		mutationFn: deleteCollaborator,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao deletar colaborador:", error);
			// TODO: Adicionar toast de erro
		},
	});

	function handleDelete() {
		deleteMutation.mutate(collaboratorId);
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Confirmar exclusão</DialogTitle>
				<DialogDescription>
					Tem certeza de que deseja excluir o colaborador{" "}
					<strong>{collaboratorName}</strong>? Esta ação não pode ser desfeita.
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