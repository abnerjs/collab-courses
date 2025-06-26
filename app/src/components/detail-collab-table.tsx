import * as React from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import type {
	CollabDetailResponse,
	TreinamentoComplete,
} from "@/services/detail-collab";
import dayjs from "dayjs";
import { Dialog } from "./ui/dialog";
import { AddTrainingDialogContent } from "./add-training-dialog";
import { ConfirmDeleteTraining } from "./confirm-delete-training";

interface MainTableProps {
	table: ReturnType<typeof useReactTable<TreinamentoComplete>>;
	columns: ColumnDef<TreinamentoComplete>[];
	dialogState: { type: "add" | "delete" | "deleteAll"; rowId: string } | null;
	setDialogState: React.Dispatch<
		React.SetStateAction<{
			type: "add" | "delete" | "deleteAll";
			rowId: string;
		} | null>
	>;
}

function MainTable({
	table,
	columns,
	dialogState,
	setDialogState,
}: MainTableProps) {
	return (
		<div className="flex flex-1 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="bg-muted sticky top-0 z-10">
					{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
					{table.getHeaderGroups().map((headerGroup: any) => (
						<TableRow key={headerGroup.id}>
							{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
							{headerGroup.headers.map((header: any) => {
								return (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="**:data-[slot=table-cell]:first:w-8">
					{table.getRowModel().rows?.length ? (
						table
							.getRowModel()
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
							.rows.map((row: any) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
									{row.getVisibleCells().map((cell: any) => (
										<TableCell key={cell.id}>
											{cell.column.id === "actions" ? (
												<RowActions row={row} table={table} />
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)
											)}
										</TableCell>
									))}
								</TableRow>
							))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Nenhum resultado encontrado.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

interface CollabDetailTableProps {
	data: CollabDetailResponse;
}

export function DetailCollabTable({ data }: CollabDetailTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [dialogState, setDialogState] = React.useState<{
		type: "add" | "delete" | "deleteAll";
		rowId: string;
	} | null>(null);

	const collaboratorId = data.id;
	const collaboratorName = data.nome;

	const columns: ColumnDef<TreinamentoComplete>[] = [
		{
			accessorKey: "treinamento",
			header: "Treinamento",
			cell: ({ row }) => <h1>{row.original.nome}</h1>,
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
							.add(row.original.validade, "day")
							.format("DD/MM/YYYY")
					: "",
		},
		{
			accessorKey: "validade",
			header: "Validade (dias)",
			cell: ({ row }) => row.original.validade,
			enableHiding: false,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) =>
				row.original.realizacao ? (
					dayjs(row.original.realizacao)
						.add(row.original.validade, "day")
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
			cell: ({ row, table }) => <RowActions row={row} table={table} />,
		},
	];

	const createTable = (data: TreinamentoComplete[]) => {
		return useReactTable({
			data,
			columns,
			state: {
				columnVisibility,
				columnFilters,
			},
			getRowId: (row) => row.treinamentoId.toString(),
			onColumnFiltersChange: setColumnFilters,
			onColumnVisibilityChange: setColumnVisibility,
			getCoreRowModel: getCoreRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFacetedUniqueValues: getFacetedUniqueValues(),
			meta: {
				collaboratorId,
				collaboratorName,
			},
		});
	};

	const tableNoPrazo = createTable(data.noPrazo);
	const tableVencido = createTable(data.vencido);
	const tableVencendo = createTable(data.vencendo);
	const tableNaoRealizado = createTable(data.naoRealizado);
	const tableTodos = createTable(
		[
			...data.noPrazo,
			...data.vencido,
			...data.vencendo,
			...data.naoRealizado,
		].sort((a, b) => {
			if (a.nome < b.nome) return -1;
			if (a.nome > b.nome) return 1;
			return 0;
		}),
	);

	return (
		<Tabs
			defaultValue="pertinentes"
			className="w-full flex-col justify-start gap-6 flex-1 mb-8"
		>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<Label htmlFor="view-selector" className="sr-only">
					View
				</Label>
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
					<TabsTrigger value="pertinentes">
						Todos treinamentos pertinentes
						<Badge variant="secondary">
							{data.noPrazo.length +
								data.vencendo.length +
								data.vencido.length +
								data.naoRealizado.length}
						</Badge>
					</TabsTrigger>
					<TabsTrigger value="no-prazo">
						No Prazo <Badge variant="secondary">{data.noPrazo.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="vencendo">
						Vencendo <Badge variant="secondary">{data.vencendo.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="vencido">
						Vencido <Badge variant="secondary">{data.vencido.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="nao-realizado">
						Não Realizado
						<Badge variant="secondary">{data.naoRealizado.length}</Badge>
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent
				value="pertinentes"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable
					table={tableTodos}
					columns={columns}
					dialogState={dialogState}
					setDialogState={setDialogState}
				/>
			</TabsContent>
			<TabsContent
				value="no-prazo"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable
					table={tableNoPrazo}
					columns={columns}
					dialogState={dialogState}
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
					dialogState={dialogState}
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
					dialogState={dialogState}
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
					dialogState={dialogState}
					setDialogState={setDialogState}
				/>
			</TabsContent>
		</Tabs>
	);
}

type CustomTableMeta = {
	collaboratorId: string;
	collaboratorName: string;
};

declare module "@tanstack/react-table" {
	interface TableMeta<TData> extends CustomTableMeta {}
}

// Componente de ações da linha, fora do array de columns
const RowActions = ({
	row,
	table,
}: {
	row: import("@tanstack/react-table").Row<TreinamentoComplete>;
	table: import("@tanstack/react-table").Table<TreinamentoComplete>;
}) => {
	const [isNewTrainingDialogOpen, setIsNewTrainingDialogOpen] =
		React.useState(false);
	const [isDeleteTrainingDialogOpen, setIsDeleteTrainingDialogOpen] =
		React.useState(false);
	const [isDeleteAllTrainingsDialogOpen, setIsDeleteAllTrainingsDialogOpen] =
		React.useState(false);

	return (
		<>
			<DropdownMenu key={`actions-menu-${row.original.treinamentoId}`}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="secondary"
						className="data-[state=open]:bg-muted text-muted-foreground flex size-8 ml-auto mr-4"
						size="icon"
					>
						<Icon icon="fluent:more-vertical-16-regular" />
						<span className="sr-only">Abrir menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem onClick={() => setIsNewTrainingDialogOpen(true)}>
						Adicionar treinamento
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setIsDeleteTrainingDialogOpen(true)}
					>
						Apagar último treinamento
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setIsDeleteAllTrainingsDialogOpen(true)}
					>
						Apagar todos deste treinamento
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{/* Dialogs */}
			<Dialog
				key={`add-training-dialog-${row.original.treinamentoId}`}
				open={isNewTrainingDialogOpen}
				onOpenChange={setIsNewTrainingDialogOpen}
				modal={true}
			>
				<AddTrainingDialogContent
					collaboratorId={table?.options?.meta?.collaboratorId || ""}
					collaboratorName={table?.options?.meta?.collaboratorName || ""}
					trainingId={row.original.treinamentoId}
					trainingDescription={row.original.nome}
				/>
			</Dialog>
			<Dialog
				key={`delete-training-dialog-${row.original.treinamentoId}`}
				open={isDeleteTrainingDialogOpen}
				onOpenChange={setIsDeleteTrainingDialogOpen}
				modal={true}
			>
				<ConfirmDeleteTraining
					collaboratorId={table?.options?.meta?.collaboratorId || ""}
					trainingId={row.original.treinamentoId}
					collaboratorName={table?.options?.meta?.collaboratorName || ""}
					trainingDescription={row.original.nome}
				/>
			</Dialog>
			<Dialog
				key={`delete-all-trainings-dialog-${row.original.treinamentoId}`}
				open={isDeleteAllTrainingsDialogOpen}
				onOpenChange={setIsDeleteAllTrainingsDialogOpen}
				modal={true}
			>
				<ConfirmDeleteTraining
					collaboratorId={table?.options?.meta?.collaboratorId || ""}
					trainingId={row.original.treinamentoId}
					collaboratorName={table?.options?.meta?.collaboratorName || ""}
					trainingDescription={row.original.nome}
					allTrainings
				/>
			</Dialog>
		</>
	);
};
