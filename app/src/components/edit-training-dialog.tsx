import { Button } from "@/components/ui/button"
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateTraining } from "@/services/trainings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"

interface EditTrainingDialogProps {
	trainingId: string;
	trainingName?: string;
	trainingValidade?: number;
}

export function EditTrainingDialog({
	trainingId,
	trainingName,
	trainingValidade,
}: EditTrainingDialogProps) {
	const [name, setName] = React.useState("");
	const [validade, setValidade] = React.useState("");

	const queryClient = useQueryClient();

	// Mutation para atualizar treinamento
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: { nome?: string; validade?: number } }) =>
			updateTraining(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["treinamentos"] });
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao atualizar treinamento:", error);
			// TODO: Adicionar toast de erro
		},
	});

	// Inicializar valores quando os dados forem passados
	React.useEffect(() => {
		if (trainingName) {
			setName(trainingName);
		}
		if (trainingValidade) {
			setValidade(trainingValidade.toString());
		}
	}, [trainingName, trainingValidade]);

	function handleSave() {
		if (!name || !validade) {
			console.error("Nome e validade são obrigatórios");
			return;
		}

		const validadeDias = parseInt(validade, 10);
		if (isNaN(validadeDias) || validadeDias <= 0) {
			console.error("Validade deve ser um número positivo");
			return;
		}

		updateMutation.mutate({
			id: trainingId,
			data: {
				nome: name,
				validade: validadeDias,
			},
		});
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Editar treinamento</DialogTitle>
				<DialogDescription>
					Edite as informações do treinamento {trainingName}
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid gap-2">
					<Label htmlFor="name">Nome do Treinamento</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Ex: NR-10 - Segurança em Instalações Elétricas"
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="validade">Validade (dias)</Label>
					<Input
						id="validade"
						type="number"
						min="1"
						value={validade}
						onChange={(e) => setValidade(e.target.value)}
						placeholder="Ex: 365"
					/>
				</div>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline" disabled={updateMutation.isPending}>
						Cancelar
					</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button 
						onClick={handleSave} 
						type="submit"
						disabled={updateMutation.isPending || !name || !validade}
					>
						{updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}