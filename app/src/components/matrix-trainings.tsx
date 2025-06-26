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
	data: TrainingsResponse;
}

export function MatrixTrainings({ data }: MatrixProps) {
	const queryClient = useQueryClient();
	// const [columnCheckedState, setColumnCheckedState] = useState<
	// 	Record<string, boolean>
	// >({});

	// const areAllChecked = (trainingId: string) => {
	// 	return (
	// 		data?.cargos?.every((role) =>
	// 			role.treinamentos.some((t) => t.id === trainingId),
	// 		) ?? false
	// 	);
	// };

	// const handleHeaderCheckboxChange = async (
	// 	trainingId: string,
	// 	checked: boolean,
	// ) => {
	// 	setColumnCheckedState((prevState) => ({
	// 		...prevState,
	// 		[trainingId]: checked,
	// 	}));

	// 	for (const role of data?.cargos || []) {
	// 		await changeTrainings(trainingId, role.id, checked);
	// 	}

	// 	queryClient.setQueryData(
	// 		["matriz-treinamentos"],
	// 		(oldData?: TrainingsResponse) => {
	// 			if (!oldData) return;

	// 			const updatedCargos = oldData.cargos.map((role) => ({
	// 				...role,
	// 				treinamentos: checked
	// 					? Array.from(new Set([...role.treinamentos, { id: trainingId }]))
	// 					: role.treinamentos.filter((t) => t.id !== trainingId),
	// 			}));

	// 			return {
	// 				...oldData,
	// 				cargos: [...updatedCargos], // Garante nova referência para disparar re-renderização
	// 			};
	// 		},
	// 	);

	// 	const updatedData = queryClient.getQueryData<TrainingsResponse>([
	// 		"matriz-treinamentos",
	// 	]);

	// 	data = updatedData || data;
	// };

	const handleChangeStatus = async (
		treinamentoId: string,
		cargoId: string,
		status: boolean,
	) => {
		const response = await changeTrainings(treinamentoId, cargoId, status);
		if (!response.success) {
			queryClient.setQueryData(
				["matriz-treinamentos"],
				(oldData?: TrainingsResponse) => {
					if (oldData) return oldData;
				},
			);
		}
	};

	return (
		<div className="w-full flex flex-1">
			<div className="overflow-x-auto overflow-y-hidden max-h-[calc(100dvh-169px)] flex border rounded-lg">
				<Table className="pt-20 overflow-auto">
					<TableHeader className="sticky top-0 bg-white z-30">
						<TableRow>
							<TableHead className="sticky left-0 bg-white z-20">
								Cargo
							</TableHead>
							{data.treinamentos?.map((training: Treinamento) => (
								<TableHead key={training.id} className="whitespace-nowrap">
									{/* <Checkbox
										className="mr-2"
										defaultChecked={areAllChecked(training.id)}
										onCheckedChange={(checked) =>
											handleHeaderCheckboxChange(
												training.id,
												checked as boolean,
											)
										}
									/> */}
									<span>{training.nome}</span>
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
								{data?.treinamentos.map((training: Treinamento) => {
									const status = role.treinamentos.some(
										(t) => t.id === training.id,
									);

									return (
										<TableCell key={training.id}>
											<Checkbox
												defaultChecked={status}
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
