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
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@tanstack/react-router";
import type {
	TrainingOverviewResponse,
	TreinamentoOverview,
} from "@/services/get-trainings";

interface TrainingTableProps {
	data?: TrainingOverviewResponse;
}

export function TrainingTable({ data }: TrainingTableProps) {
	const columns: ColumnDef<TreinamentoOverview>[] = [
		{
			accessorKey: "nome",
			header: "Descrição",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					{row.original.nome}
					<Badge variant="secondary">{row.original.validade}</Badge>
				</div>
			),
		},
		{
			id: "status",
			header: "Colaboradores",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					{row.original.noPrazo > 0 && (
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
					)}
					{row.original.vencendo > 0 && (
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
					)}
					{Number(row.original.vencido) + Number(row.original.naoRealizado) >
						0 && (
						<Badge
							variant="secondary"
							className="bg-red-400 py-0 pr-0 flex gap-1.5 border-0"
						>
							<span className="font-semibold">
								{Number(row.original.vencido) +
									Number(row.original.naoRealizado)}
							</span>
							<Badge
								variant="secondary"
								className="bg-red-700 text-white rounded-l-none"
							>
								Necessário
							</Badge>
						</Badge>
					)}
				</div>
			),
		},
		{
			id: "acoes",
			header: "Ações",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Link to="/detail-training/$id" params={{ id: row.original.id }}>
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
