import { DetailCollabTable } from "@/components/detail-collab-table";
import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { Badge } from "@/components/ui/badge";
import { getCollabDetails } from "@/services/detail-collab";
import type { CollabDetailResponse } from "@/services/detail-collab";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/detail-collab/$id")({
	component: function DetailCollab() {
		const { id } = Route.useParams();
		const { data, isLoading, isError } = useQuery<CollabDetailResponse, Error>({
			queryKey: ["colaboradores-detail", id],
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			queryFn: () => getCollabDetails(id!),
			enabled: !!id,
		});

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
								<Badge variant="secondary">{data.setor}</Badge>
								<Badge variant="secondary">{data.cargo}</Badge>
							</h2>
						</div>
						<DetailCollabTable data={data} />
					</>
				)}
			</>
		);
	},
});
