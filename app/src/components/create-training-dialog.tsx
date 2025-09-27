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
import { createTraining } from "@/services/trainings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"

export function CreateTrainingDialog() {
	const [name, setName] = React.useState("");
	const [validade, setValidade] = React.useState("");

	const queryClient = useQueryClient();

	// Mutation para criar treinamento
	const createMutation = useMutation({
		mutationFn: createTraining,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["treinamentos"] });
			// Limpar formulário
			setName("");
			setValidade("");
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao criar treinamento:", error);
			// TODO: Adicionar toast de erro
		},
	});

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

		createMutation.mutate({
			nome: name,
			validade: validadeDias,
		});
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Adicionar treinamento</DialogTitle>
				<DialogDescription>
					Preencha as informações para criar um novo treinamento
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
					<Button variant="outline" disabled={createMutation.isPending}>
						Cancelar
					</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button 
						onClick={handleSave} 
						type="submit"
						disabled={createMutation.isPending || !name || !validade}
					>
						{createMutation.isPending ? "Criando..." : "Criar treinamento"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}