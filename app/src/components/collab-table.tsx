import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CollabSummaryResponse } from "@/services/get-collab-summary";
import { useEffect } from "react";
import { Badge } from "./ui/badge";

interface CollabTableProps {
	data?: CollabSummaryResponse;
	isLoading?: boolean;
	isError?: boolean;
}

export function CollabTable({ data, isLoading, isError }: CollabTableProps) {
	useEffect(() => {
		console.log("Data fetched:", data);
	}, [data]);

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
			header: "Status",
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
	];

	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	if (isLoading) {
		return <div>Carregando...</div>;
	}

	if (isError) {
		return <div>Erro ao carregar os dados.</div>;
	}

	return (
		<div className="w-full px-8 flex-1 flex flex-col">
			<div className="flex items-center py-4">
				<Input
					placeholder="Buscar por nome..."
					value={
						(table.getColumn("nomeColaborador")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("nomeColaborador")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border flex-1">
				<Table>
					<TableHeader>
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
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum resultado encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} de{" "}
					{table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						próximo
					</Button>
				</div>
			</div>
		</div>
	);
}
