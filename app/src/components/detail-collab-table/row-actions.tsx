import * as React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog } from "../ui/dialog";
import { AddTrainingDialogContent } from "../add-training-dialog";
import { ConfirmDeleteTraining } from "../confirm-delete-training";
import type { TreinamentoComplete } from "@/services/detail-collab";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

export const RowActions = ({
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
