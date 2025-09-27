import type { CollabComplete } from "@/services/detail-trainings"
import { Icon } from "@iconify/react/dist/iconify.js"
import type { Row } from "@tanstack/react-table"
import type { CollabRowData } from "."
import { Button } from "../ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export const RowActions = ({
	row,
	onDialogOpen,
}: {
	row: Row<CollabComplete>;
	onDialogOpen: (
		type: "add" | "delete" | "deleteAll",
		row: CollabRowData,
	) => void;
}) => {
	const handleDialogOpen = (type: "add" | "delete" | "deleteAll") => {
		onDialogOpen(type, {
			id: row.original.id,
			description: row.original.nome,
		});
	};

	return (
		<>
			<DropdownMenu modal={false} key={`actions-menu-${row.original.id}`}>
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
					<DropdownMenuItem onClick={() => handleDialogOpen("add")}>
						Adicionar treinamento
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => handleDialogOpen("delete")}
					>
						Apagar último treinamento
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => handleDialogOpen("deleteAll")}
					>
						Apagar todos deste treinamento
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
