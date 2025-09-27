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
import { updateCollaborator } from "@/services/collaborators"
import { getPositionsBySector, getSectors } from "@/services/sectors"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"

interface EditCollabDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	collaboratorCargo?: string;
	collaboratorSetor?: string;
}

export function EditCollabDialog({
	collaboratorId,
	collaboratorName,
	collaboratorCargo,
	collaboratorSetor,
}: EditCollabDialogProps) {
	const [name, setName] = React.useState("");
	const [selectedSectorId, setSelectedSectorId] = React.useState("");
	const [selectedPositionId, setSelectedPositionId] = React.useState("");

	const queryClient = useQueryClient();

	// Mutation para atualizar colaborador
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: { nome?: string; cargoId?: string } }) =>
			updateCollaborator(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
			// TODO: Adicionar toast de sucesso
		},
		onError: (error) => {
			console.error("Erro ao atualizar colaborador:", error);
			// TODO: Adicionar toast de erro
		},
	});

	// Inicializar nome quando o colaborador for passado
	React.useEffect(() => {
		if (collaboratorName) {
			setName(collaboratorName);
		}
	}, [collaboratorName]);

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

	// Inicializar valores quando os dados carregarem
	React.useEffect(() => {
		if (sectors.length > 0 && collaboratorSetor) {
			const sector = sectors.find(s => s.descricao === collaboratorSetor);
			if (sector) {
				setSelectedSectorId(sector.id);
			}
		}
	}, [sectors, collaboratorSetor]);

	React.useEffect(() => {
		if (positions.length > 0 && collaboratorCargo) {
			const position = positions.find(p => p.descricao === collaboratorCargo);
			if (position) {
				setSelectedPositionId(position.id);
			}
		}
	}, [positions, collaboratorCargo]);

	const handleSectorChange = (sectorId: string) => {
		setSelectedSectorId(sectorId);
		setSelectedPositionId(""); // Reset cargo quando mudar setor
	};

	function handleSave() {
		if (!name || !selectedPositionId) {
			console.error("Nome e cargo são obrigatórios");
			return;
		}

		updateMutation.mutate({
			id: collaboratorId,
			data: {
				nome: name,
				cargoId: selectedPositionId,
			},
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
				<DialogTitle>Editar colaborador</DialogTitle>
				<DialogDescription>
					Edite as informações do colaborador {collaboratorName}
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
						disabled={updateMutation.isPending || !name || !selectedPositionId}
					>
						{updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}