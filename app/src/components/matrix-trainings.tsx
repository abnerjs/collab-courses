import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { changeTrainings } from "@/services/change-trainings";
import type {
	TrainingsResponse,
	Treinamento,
	Cargo,
} from "@/services/get-trainings";
import { useQueryClient } from "@tanstack/react-query";

interface MatrixProps {
	data?: TrainingsResponse;
	isLoading?: boolean;
	isError?: boolean;
}

export function MatrixTrainings({ data, isLoading, isError }: MatrixProps) {
	const queryClient = useQueryClient();
	if (isLoading) {
		return <div>Carregando...</div>;
	}

	if (isError || !data) {
		return <div>Erro ao carregar os dados.</div>;
	}

	const handleChangeStatus = async (
		treinamentoId: string,
		cargoId: string,
		status: boolean,
	) => {
		const response = await changeTrainings(treinamentoId, cargoId, status);
		if (!response.success) {
			queryClient.setQueryData(
				["treinamentos"],
				(oldData?: TrainingsResponse) => {
					if (oldData) return oldData;
				},
			);
		}
	};

	return (
		<div className="w-full px-8 flex flex-1">
			<div className="overflow-x-auto overflow-y-hidden max-h-[calc(100dvh-89px)] flex">
				<Table className="pt-20 overflow-auto">
					<TableHeader className="sticky top-0 bg-white z-30">
						<TableRow>
							<TableHead className="sticky left-0 bg-white z-20">
								Cargo
							</TableHead>
							{data.treinamentos?.map((training: Treinamento) => (
								<TableHead key={training.id} className="whitespace-nowrap">
									{training.nome}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.cargos?.map((role: Cargo) => (
							<TableRow key={role.id}>
								<TableCell className="sticky left-0 bg-white z-10">
									{role.descricao}
								</TableCell>
								{data.treinamentos.map((training: Treinamento) => {
									const status = role.treinamentos.some(
										(t) => t.id === training.id,
									);

									return (
										<TableCell key={training.id}>
											<Checkbox
												checked={status}
												onCheckedChange={(_) =>
													handleChangeStatus(training.id, role.id, !status)
												}
											/>
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
