import { Button } from "@/components/ui/button"
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createTraining } from "@/services/create-trainings"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import React from "react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface AddTrainingDialogProps {
	collaboratorId: string;
	collaboratorName?: string;
	trainingId: string;
	trainingDescription?: string;
	onClose?: () => void;
}

export function AddTrainingDialogContent({
	collaboratorId,
	collaboratorName,
	trainingId,
	trainingDescription,
 	onClose,
}: AddTrainingDialogProps) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const queryClient = useQueryClient();
	const isMountedRef = React.useRef(true);

	const mutation = useMutation({
		mutationFn: createTraining,
		onSuccess: () => {
			if (isMountedRef.current) {
				setDate(undefined);
				setOpen(false);
				onClose?.();
			}
			queryClient.invalidateQueries({
				queryKey: ["colaboradores-detail", collaboratorId],
			});
			queryClient.invalidateQueries({
				queryKey: ["treinamentos-detail", trainingId],
			});
		},
		onError: (error) => {
			console.error("Erro na mutação:", error);
		},
	});

	React.useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const isConfirmDisabled =
		mutation.status === "pending" || !collaboratorId || !trainingId;

	function handleConfirm() {
		if (isConfirmDisabled) {
			return;
		}
		mutation.mutate({
			colaboradorId: collaboratorId,
			treinamentoId: trainingId,
			realizacao: date ? new Date(date) : new Date(),
		});
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
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
				<Button
					onClick={handleConfirm}
					disabled={isConfirmDisabled}
					type="submit"
				>
					{mutation.status === "pending"
						? "Salvando..."
						: "Confirmar treinamento"}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
