import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
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
import { createCollaborator } from "@/services/collaborators"
import { getPositionsBySector, getSectors } from "@/services/sectors"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"

export function AddCollabDialog() {
	const [name, setName] = React.useState("");
	const [selectedSectorId, setSelectedSectorId] = React.useState("");
	const [selectedPositionId, setSelectedPositionId] = React.useState("");

	const queryClient = useQueryClient();

	// Mutation para criar colaborador
	const createMutation = useMutation({
		mutationFn: createCollaborator,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
			// Limpar formulário
			setName("");
			setSelectedSectorId("");
			setSelectedPositionId("");
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao criar colaborador:", error);
			// TODO: Adicionar toast de erro
		},
	});

	// Buscar setores
	const { data: sectors = [] } = useQuery({
		queryKey: ["sectors"],
		queryFn: getSectors,
	});

	// Buscar cargos do setor selecionado
	const { data: positions = [] } = useQuery({
		queryKey: ["positions", selectedSectorId],
		queryFn: () => getPositionsBySector(selectedSectorId),
		enabled: !!selectedSectorId,
	});

	const handleSectorChange = (sectorId: string) => {
		setSelectedSectorId(sectorId);
		setSelectedPositionId(""); // Reset cargo quando mudar setor
	};

	function handleSave() {
		if (!name || !selectedPositionId) {
			console.error("Nome e cargo são obrigatórios");
			return;
		}

		createMutation.mutate({
			nome: name,
			cargoId: selectedPositionId,
		});
	}

	const sectorOptions = sectors.map(sector => ({
		value: sector.id,
		label: sector.descricao,
	}));

	const positionOptions = positions.map(position => ({
		value: position.id,
		label: position.descricao,
	}));

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Adicionar colaborador</DialogTitle>
				<DialogDescription>
					Preencha as informações para criar um novo colaborador
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid gap-2">
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Nome do colaborador"
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="setor">Setor</Label>
					<Combobox
						options={sectorOptions}
						value={selectedSectorId}
						onValueChange={handleSectorChange}
						placeholder="Selecione um setor"
						searchPlaceholder="Buscar setor..."
						emptyText="Nenhum setor encontrado."
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="cargo">Cargo</Label>
					<Combobox
						options={positionOptions}
						value={selectedPositionId}
						onValueChange={setSelectedPositionId}
						placeholder="Selecione um cargo"
						searchPlaceholder="Buscar cargo..."
						emptyText="Nenhum cargo encontrado."
						disabled={!selectedSectorId}
					/>
				</div>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button 
						onClick={handleSave} 
						type="submit"
						disabled={createMutation.isPending || !name || !selectedPositionId}
					>
						{createMutation.isPending ? "Criando..." : "Criar colaborador"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}