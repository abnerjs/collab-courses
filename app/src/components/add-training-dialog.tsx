import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import { Calendar } from "./ui/calendar";
import { createTraining } from "@/services/create-trainings";
import { useQueryClient } from "@tanstack/react-query";

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
}

export function AddTrainingDialogContent({
	collaboratorId,
	collaboratorName,
	trainingId,
	trainingDescription,
}: AddTrainingDialogProps) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const dialog = useRef(null);
	const queryClient = useQueryClient();

	return (
		<DialogContent ref={dialog} className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Registro de treinamento</DialogTitle>
				<DialogDescription>
					Marcar treinamento de {trainingDescription} para{" "}
					{collaboratorName || "colaborador"}
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="date" className="px-1">
						Realização
					</Label>
					<Popover open={open} onOpenChange={setOpen} modal={true}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								id="date"
								className="w-48 justify-between font-normal"
							>
								{date ? date.toLocaleDateString() : "Selecione uma data"}
								<Icon icon="fluent:chevron-down-16-regular" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="start"
						>
							<Calendar
								mode="single"
								selected={date}
								captionLayout="dropdown"
								startMonth={dayjs().subtract(3, "year").toDate()}
								endMonth={dayjs().add(3, "year").toDate()}
								onSelect={(date) => {
									setDate(date);
									setOpen(false);
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<DialogClose>
					<Button
						onClick={async (e) => {
							await createTraining({
								colaboradorId: collaboratorId,
								treinamentoId: trainingId,
								realizacao: date ? new Date(date) : new Date(),
							});
							setDate(undefined);

							queryClient.invalidateQueries({
								queryKey: ["colaboradores-detail"],
							});
						}}
						type="submit"
					>
						Confirmar treinamento
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
