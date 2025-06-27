import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import { MainTable } from "./main-table";
import type {
	ColumnDef,
	ColumnFiltersState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Dialog } from "../ui/dialog";
import { ConfirmDeleteTraining } from "../confirm-delete-training";
import { AddTrainingDialogContent } from "../add-training-dialog";
import type {
	CollabComplete,
	TrainingDetailResponse,
} from "@/services/detail-trainings";

interface TrainingDetailTableProps {
	data: TrainingDetailResponse;
}

export interface CollabRowData {
	id: string;
	name: string;
}

export function DetailTrainingTable({ data }: TrainingDetailTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [dialogState, setDialogState] = React.useState<
		"add" | "delete" | "deleteAll" | null
	>(null);
	const [rowData, setRowData] = React.useState<CollabRowData | null>(null);

	const columns: ColumnDef<CollabComplete>[] = [
		{
			accessorKey: "colaborador",
			header: "Colaborador",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<span>{row.original.nome}</span>
					<Badge variant="secondary">{row.original.cargo}</Badge>
				</div>
			),
			enableHiding: false,
		},
		{
			accessorKey: "realizacao",
			header: "Realização",
			cell: ({ row }) =>
				row.original.realizacao
					? dayjs(row.original.realizacao).format("DD/MM/YYYY")
					: "",
			enableHiding: false,
		},
		{
			accessorKey: "nextRealizacao",
			header: "Vencimento",
			cell: ({ row }) =>
				row.original.realizacao
					? dayjs(row.original.realizacao)
							.add(data.validade, "day")
							.format("DD/MM/YYYY")
					: "",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) =>
				row.original.realizacao ? (
					dayjs(row.original.realizacao)
						.add(data.validade, "day")
						.isAfter(dayjs()) ? (
						dayjs(row.original.realizacao).add(30, "day").isAfter(dayjs()) ? (
							<Badge
								variant="secondary"
								className="text-zinc-950 bg-emerald-200"
							>
								No prazo
							</Badge>
						) : (
							<Badge variant="secondary" className="text-zinc-950 bg-amber-200">
								Vencendo
							</Badge>
						)
					) : (
						<Badge variant="secondary" className="text-zinc-950 bg-red-200">
							Vencido
						</Badge>
					)
				) : (
					<Badge variant="secondary" className="text-zinc-950 bg-zinc-200">
						Não realizado
					</Badge>
				),
		},
		{
			id: "actions",
		},
	];

	const createTable = (data: CollabComplete[]) => {
		return useReactTable({
			data,
			columns,
			state: {
				columnVisibility,
				columnFilters,
			},
			getRowId: (row) => row.id.toString(),
			onColumnFiltersChange: setColumnFilters,
			onColumnVisibilityChange: setColumnVisibility,
			getCoreRowModel: getCoreRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFacetedUniqueValues: getFacetedUniqueValues(),
		});
	};

	const tableNoPrazo = createTable(data.noPrazo);
	const tableVencido = createTable(data.vencido);
	const tableVencendo = createTable(data.vencendo);
	const tableNaoRealizado = createTable(data.naoRealizado);
	// const tableTodos = createTable(allData);

	return (
		<>
			<Tabs
				defaultValue="nao-realizado"
				className="w-full flex-col justify-start gap-6 flex-1 min-h-0 mb-8"
			>
				<div className="flex items-center justify-between px-4 lg:px-6">
					<Label htmlFor="view-selector" className="sr-only">
						View
					</Label>
					<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
						{/* <TabsTrigger value="pertinentes">
							Todos treinamentos pertinentes
							<Badge variant="secondary">{allData.length}</Badge>
						</TabsTrigger> */}
						<TabsTrigger value="nao-realizado">
							Não Realizado
							<Badge variant="secondary">{data.naoRealizado.length}</Badge>
						</TabsTrigger>
						<TabsTrigger value="vencido">
							Vencido <Badge variant="secondary">{data.vencido.length}</Badge>
						</TabsTrigger>
						<TabsTrigger value="vencendo">
							Vencendo <Badge variant="secondary">{data.vencendo.length}</Badge>
						</TabsTrigger>
						<TabsTrigger value="no-prazo">
							No Prazo <Badge variant="secondary">{data.noPrazo.length}</Badge>
						</TabsTrigger>
					</TabsList>
				</div>
				{/* <TabsContent
					value="pertinentes"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					{tableTodos && allData && (
						<MainTable
							table={tableTodos}
							columns={columns}
							setRowData={setRowData}
							setDialogState={setDialogState}
						/>
					)}
				</TabsContent> */}
				<TabsContent
					value="no-prazo"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableNoPrazo}
						columns={columns}
						setRowData={setRowData}
						setDialogState={setDialogState}
					/>
				</TabsContent>
				<TabsContent
					value="vencendo"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableVencendo}
						columns={columns}
						setRowData={setRowData}
						setDialogState={setDialogState}
					/>
				</TabsContent>
				<TabsContent
					value="vencido"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableVencido}
						columns={columns}
						setRowData={setRowData}
						setDialogState={setDialogState}
					/>
				</TabsContent>
				<TabsContent
					value="nao-realizado"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableNaoRealizado}
						columns={columns}
						setRowData={setRowData}
						setDialogState={setDialogState}
					/>
				</TabsContent>
			</Tabs>

			<Dialog
				open={dialogState === "add"}
				onOpenChange={(open) => setDialogState(open ? "add" : null)}
				modal={true}
			>
				<AddTrainingDialogContent
					collaboratorId={rowData?.id || ""}
					collaboratorName={rowData?.name || ""}
					trainingId={data.id || ""}
					trainingDescription={data.nome || ""}
				/>
			</Dialog>
			<Dialog
				open={dialogState === "delete"}
				onOpenChange={(open) => setDialogState(open ? "delete" : null)}
				modal={true}
			>
				<ConfirmDeleteTraining
					collaboratorId={rowData?.id || ""}
					collaboratorName={rowData?.name || ""}
					trainingId={data.id || ""}
					trainingDescription={data.nome || ""}
				/>
			</Dialog>
			<Dialog
				open={dialogState === "deleteAll"}
				onOpenChange={(open) => setDialogState(open ? "deleteAll" : null)}
				modal={true}
			>
				<ConfirmDeleteTraining
					collaboratorId={rowData?.id || ""}
					collaboratorName={rowData?.name || ""}
					trainingId={data.id || ""}
					trainingDescription={data.nome || ""}
					allTrainings
				/>
			</Dialog>
		</>
	);
}
