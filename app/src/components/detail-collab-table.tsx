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
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "./ui/popover";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AddTrainingDialogContent } from "./add-training-dialog";

const columns: ColumnDef<TreinamentoComplete>[] = [
	{
		accessorKey: "treinamento",
		header: "Treinamento",
		cell: ({ row }) => {
			return <h1>{row.original.nome}</h1>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "realizacao",
		header: "Realização",
		cell: ({ row }) => {
			return row.original.realizacao
				? dayjs(row.original.realizacao).format("DD/MM/YYYY")
				: "";
		},
		enableHiding: false,
	},
	{
		accessorKey: "validade",
		header: "Validade (dias)",
		cell: ({ row }) => {
			return row.original.validade;
		},
		enableHiding: false,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) =>
			row.original.realizacao ? (
				dayjs(row.original.realizacao).isAfter(
					dayjs().add(row.original.validade, "day"),
				) ? (
					<Badge variant="secondary" className="text-zinc-950 bg-red-200">
						Vencido
					</Badge>
				) : dayjs(row.original.realizacao)
						.add(30, "day")
						.isAfter(dayjs().add(row.original.validade, "day")) ? (
					<Badge variant="secondary" className="text-zinc-950 bg-amber-200">
						Vencendo
					</Badge>
				) : (
					<Badge variant="secondary" className="text-zinc-950 bg-emerald-200">
						No Prazo
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
		cell: ({ row, table }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="secondary"
						className="data-[state=open]:bg-muted text-muted-foreground flex size-8 ml-auto mr-4"
						size="icon"
					>
						<Icon icon="fluent:more-vertical-16-regular" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem>
						<Dialog>
							<form>
								<DialogTrigger>Adicionar treinamento</DialogTrigger>
								<AddTrainingDialogContent
									collaboratorId={table?.options?.meta?.collaboratorId || ""}
									collaboratorName={
										table?.options?.meta?.collaboratorName || ""
									}
									trainingId={row.original.treinamentoId}
									trainingDescription={row.original.nome}
								/>
							</form>
						</Dialog>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive">
						<Popover>
							<PopoverTrigger>Deletar último treinamento</PopoverTrigger>
						</Popover>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

interface MainTableProps {
	table: ReturnType<typeof useReactTable<TreinamentoComplete>>;
}

function MainTable({ table }: MainTableProps) {
	return (
		<div className="flex flex-1 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="bg-muted sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
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
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
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

	const collaboratorId = data.id;
	const collaboratorName = data.nome;

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
				<MainTable table={tableTodos} />
			</TabsContent>
			<TabsContent
				value="no-prazo"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable table={tableNoPrazo} />
			</TabsContent>
			<TabsContent
				value="vencendo"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable table={tableVencendo} />
			</TabsContent>
			<TabsContent
				value="vencido"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable table={tableVencido} />
			</TabsContent>
			<TabsContent
				value="nao-realizado"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<MainTable table={tableNaoRealizado} />
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
