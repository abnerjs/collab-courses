import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

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
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Registro de treinamento</DialogTitle>
				<DialogDescription>
					Adicionando novo treinamento para {collaboratorName || "colaborador"}:
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="realizacao">Realização</Label>
					<Input
						id="realizacao"
						name="name"
						defaultValue={dayjs().format("YYYY-MM-DD")}
					/>
				</div>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				<Button type="submit">Confirmar treinamento</Button>
			</DialogFooter>
		</DialogContent>
	);
}
