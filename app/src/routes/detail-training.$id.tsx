import { DetailTrainingTable } from "@/components/detail-training-table";
import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { Badge } from "@/components/ui/badge";
import {
	getTrainingDetails,
	type TrainingDetailResponse,
} from "@/services/detail-trainings";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/detail-training/$id")({
	component: function DetailTraining() {
		const { id } = Route.useParams();
		const { data, isLoading, isError } = useQuery<
			TrainingDetailResponse,
			Error
		>({
			queryKey: ["treinamentos-detail", id],
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			queryFn: () => getTrainingDetails(id!),
			enabled: !!id,
		});

		return (
			<>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando detalhes do colaborador..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar detalhChat, se eu tenho um container de tamanho X,Y. Ele é preenchido dinamicamente, como eu faço para que tenha o mesmo es do colaborador." />
				)}
				{data && (
					<>
						<div className="flex flex-col items gap-4 p-4 px-6">
							<h2 className="flex text-2xl font-bold items-center gap-2">
								{data.nome}
								<Badge variant="secondary">
									{data.validade} {data.validade === 1 ? "dia" : "dias"}
								</Badge>
							</h2>
						</div>
						<DetailTrainingTable data={data} />
					</>
				)}
			</>
		);
	},
});
