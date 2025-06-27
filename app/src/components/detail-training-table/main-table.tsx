import type * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { RowActions } from "./row-actions";
import { flexRender } from "@tanstack/react-table";
import type { ColumnDef, useReactTable } from "@tanstack/react-table";
import type { CollabRowData } from ".";
import type { CollabComplete } from "@/services/detail-trainings";

interface MainTableProps {
	table: ReturnType<typeof useReactTable<CollabComplete>>;
	columns: ColumnDef<CollabComplete>[];
	setRowData: React.Dispatch<React.SetStateAction<CollabRowData | null>>;
	setDialogState: React.Dispatch<
		React.SetStateAction<"add" | "delete" | "deleteAll" | null>
	>;
}

export function MainTable({
	table,
	columns,
	setRowData,
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
												<RowActions
													row={row}
													setRowData={setRowData}
													setDialogState={setDialogState}
												/>
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
