import type {
	CollabDetailResponse,
	TreinamentoComplete,
} from "@/services/detail-collab"
import type {
	ColumnDef,
	ColumnFiltersState,
	VisibilityState,
} from "@tanstack/react-table"
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table"
import dayjs from "dayjs"
import * as React from "react"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { MainTable } from "./main-table"

interface CollabDetailTableProps {
	data: CollabDetailResponse;
	onDialogOpen: (
		type: "add" | "delete" | "deleteAll",
		row: TrainingRowData,
	) => void;
}

export interface TrainingRowData {
	id: string;
	description: string;
}

export function DetailCollabTable({ data, onDialogOpen }: CollabDetailTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

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
			{
				const realizacao = row.original.realizacao;
				const vencimento = realizacao
					? dayjs(realizacao).add(row.original.validade, "day")
					: null;
				const hoje = dayjs();
				const trintaDiasAntesVencimento = vencimento
					? vencimento.subtract(30, "day")
					: null;

				if (realizacao) {
					if (vencimento && vencimento.isAfter(hoje)) {
						if (
							trintaDiasAntesVencimento &&
							trintaDiasAntesVencimento.isAfter(hoje)
						) {
							return (
								<Badge
									variant="secondary"
									className="text-zinc-950 bg-emerald-200"
								>
									No prazo
								</Badge>
							);
						} else {
							return (
								<Badge variant="secondary" className="text-zinc-950 bg-amber-200">
									Vencendo
								</Badge>
							);
						}
					} else {
						return (
							<Badge variant="secondary" className="text-zinc-950 bg-red-200">
								Vencido
							</Badge>
						);
					}
				} else {
					return (
						<Badge variant="secondary" className="text-zinc-950 bg-zinc-200">
							Não realizado
						</Badge>
					);
				}
			}
		},
		{
			id: "actions",
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
				className="w-full flex-col justify-start gap-6 flex-1 mb-8"
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
							onDialogOpen={onDialogOpen}
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
						onDialogOpen={onDialogOpen}
					/>
				</TabsContent>
				<TabsContent
					value="vencendo"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableVencendo}
						columns={columns}
						onDialogOpen={onDialogOpen}
					/>
				</TabsContent>
				<TabsContent
					value="vencido"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableVencido}
						columns={columns}
						onDialogOpen={onDialogOpen}
					/>
				</TabsContent>
				<TabsContent
					value="nao-realizado"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<MainTable
						table={tableNaoRealizado}
						columns={columns}
						onDialogOpen={onDialogOpen}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
