import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTraining } from "@/services/delete-trainings";

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
	allTrainings?: boolean;
}

export function ConfirmDeleteTraining({
	collaboratorId,
	collaboratorName,
	trainingId,
	trainingDescription,
	allTrainings,
}: AddTrainingDialogProps) {
	const dialog = useRef(null);
	const queryClient = useQueryClient();

	return (
		<DialogContent ref={dialog} className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>
					Apagar treinamento{allTrainings ? "s" : " mais recente"}
				</DialogTitle>
				<DialogDescription>
					Apagar treinamento{allTrainings ? "s" : " mais recente"} de{" "}
					{trainingDescription} para {collaboratorName || "colaborador"}
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<DialogClose>
					<Button
						onClick={async (e) => {
							await deleteTraining({
								colaboradorId: collaboratorId,
								treinamentoId: trainingId,
								lastValue: !allTrainings,
							});

							queryClient.invalidateQueries({
								queryKey: ["colaboradores-detail"],
							});
						}}
						type="submit"
						variant="destructive"
					>
						Confirmar exclusão
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
