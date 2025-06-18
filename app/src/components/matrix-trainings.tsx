import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	TrainingsResponse,
	Treinamento,
	Cargo,
} from "@/services/get-trainings";

interface MatrixProps {
	data?: TrainingsResponse;
	isLoading?: boolean;
	isError?: boolean;
}

export function MatrixTrainings({ data, isLoading, isError }: MatrixProps) {
	if (isLoading) {
		return <div>Carregando...</div>;
	}

	if (isError || !data) {
		return <div>Erro ao carregar os dados.</div>;
	}

	return (
		<div className="w-full px-8">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Cargo</TableHead>
						{data.treinamentos?.map((training: Treinamento) => (
							<TableHead key={training.id}>{training.nome}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.cargos?.map((role: Cargo) => (
						<TableRow key={role.id}>
							<TableCell>{role.descricao}</TableCell>
							{data.treinamentos.map((training: Treinamento) => (
								<TableCell key={training.id}>
									<Checkbox
										checked={role.treinamentos.some(
											(t) => t.id === training.id,
										)}
										disabled
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
