import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CollabSummaryResponse } from "@/services/get-collab";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@tanstack/react-router";

interface CollabTableProps {
	data?: CollabSummaryResponse;
}

export function CollabTable({ data }: CollabTableProps) {
	const columns: ColumnDef<{
		id: string;
		nomeColaborador: string;
		cargo: string;
		setor: string;
		noPrazo: number;
		vencendo: number;
		vencido: number;
		naoRealizado: number;
	}>[] = [
		{
			accessorKey: "nomeColaborador",
			header: "Nome",
		},
		{
			id: "cargoSetor",
			header: "Cargo",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Badge variant="secondary">{row.original.setor}</Badge>
					{row.original.cargo}
				</div>
			),
		},
		{
			id: "status",
			header: "Treinamentos",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
						className="bg-green-400 py-0 pr-0 flex gap-1.5 border-0"
					>
						<span className="font-semibold">{row.original.noPrazo}</span>
						<Badge
							variant="secondary"
							className="bg-green-600 text-white rounded-l-none"
						>
							No prazo
						</Badge>
					</Badge>
					<Badge
						variant="secondary"
						className="bg-yellow-400 py-0 pr-0 flex gap-1.5 border-0"
					>
						<span className="font-semibold">{row.original.vencendo}</span>
						<Badge
							variant="secondary"
							className="bg-yellow-600 text-white rounded-l-none"
						>
							Vencendo
						</Badge>
					</Badge>
					<Badge
						variant="secondary"
						className="bg-red-400 py-0 pr-0 flex gap-1.5 border-0"
					>
						<span className="font-semibold">
							{row.original.vencido + row.original.naoRealizado}
						</span>
						<Badge
							variant="secondary"
							className="bg-red-700 text-white rounded-l-none"
						>
							Necessário
						</Badge>
					</Badge>
				</div>
			),
		},
		{
			id: "acoes",
			header: "Ações",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Link to="/detail-collab/$id" params={{ id: row.original.id }}>
						<Button variant="secondary" size="sm">
							<Icon icon="fluent:eye-16-regular" width={16} height={16} />
						</Button>
					</Link>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="rounded-md border flex-1 overflow-auto flex max-h-[calc(100dvh-180px)]">
			<Table className="pt-20 overflow-auto">
				<TableHeader className="sticky top-0 bg-white z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
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
				<TableBody>
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
