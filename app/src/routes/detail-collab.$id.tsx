import { AddTrainingDialogContent } from "@/components/add-training-dialog"
import { ConfirmDeleteTraining } from "@/components/confirm-delete-training"
import { DetailCollabTable, type TrainingRowData } from "@/components/detail-collab-table/"
import { ErrorLoadingMessage } from "@/components/error-loading-message"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import type { CollabDetailResponse } from "@/services/detail-collab"
import { getCollabDetails } from "@/services/detail-collab"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/detail-collab/$id")({
	component: function DetailCollab() {
		const { id } = Route.useParams();
		const { data, isLoading, isError } = useQuery<CollabDetailResponse, Error>({
			queryKey: ["colaboradores-detail", id],
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			queryFn: () => getCollabDetails(id!),
			enabled: !!id,
		});

		const [dialogState, setDialogState] = React.useState<
			"add" | "delete" | "deleteAll" | null
		>(null);
		const [selectedTraining, setSelectedTraining] = React.useState<
			TrainingRowData | null
		>(null);

		const handleDialogOpen = React.useCallback(
			(type: "add" | "delete" | "deleteAll", row: TrainingRowData) => {
				setSelectedTraining(row);
				setDialogState(type);
			},
			[],
		);

		const handleDialogClose = React.useCallback(() => {
			setDialogState(null);
			setSelectedTraining(null);
			if (typeof document !== "undefined") {
				document.body.style.removeProperty("pointer-events");
			}
		}, []);

		React.useEffect(() => {
			if (!dialogState && typeof document !== "undefined") {
				document.body.style.removeProperty("pointer-events");
			}
		}, [dialogState]);

		React.useEffect(() => {
			return () => {
				if (typeof document !== "undefined") {
					document.body.style.removeProperty("pointer-events");
				}
			};
		}, []);

		return (
			<>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando detalhes do colaborador..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar detalhes do colaborador." />
				)}
				{data && (
					<>
						<div className="flex flex-col items gap-4 p-4 px-6">
							<h2 className="flex text-2xl font-bold items-center gap-2">
								{data.nome}
								<Badge variant="secondary">{data.cargo.setor.descricao}</Badge>
								<Badge variant="secondary">{data.cargo.descricao}</Badge>
							</h2>
						</div>
						<DetailCollabTable data={data} onDialogOpen={handleDialogOpen} />
						<Dialog
							open={dialogState === "add"}
							onOpenChange={(open) => {
								if (!open) {
									handleDialogClose();
								}
							}}
							modal={true}
						>
							<AddTrainingDialogContent
								collaboratorId={data.id}
								collaboratorName={data.nome}
								trainingId={selectedTraining?.id || ""}
								trainingDescription={selectedTraining?.description || ""}
								onClose={handleDialogClose}
							/>
						</Dialog>
						<Dialog
							open={dialogState === "delete"}
							onOpenChange={(open) => {
								if (!open) {
									handleDialogClose();
								}
							}}
							modal={true}
						>
							<ConfirmDeleteTraining
								collaboratorId={data.id}
								collaboratorName={data.nome}
								trainingId={selectedTraining?.id || ""}
								trainingDescription={selectedTraining?.description || ""}
								onClose={handleDialogClose}
							/>
						</Dialog>
						<Dialog
							open={dialogState === "deleteAll"}
							onOpenChange={(open) => {
								if (!open) {
									handleDialogClose();
								}
							}}
							modal={true}
						>
							<ConfirmDeleteTraining
								collaboratorId={data.id}
								collaboratorName={data.nome}
								trainingId={selectedTraining?.id || ""}
								trainingDescription={selectedTraining?.description || ""}
								allTrainings
								onClose={handleDialogClose}
							/>
						</Dialog>
					</>
				)}
			</>
		);
	},
});
