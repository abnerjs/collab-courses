import { CollabTable } from "@/components/collab-table";
import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { getCollabSummary } from "@/services/get-collab";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: function Index() {
		const { data, isLoading, isError } = useQuery({
			queryKey: ["colaboradores"],
			queryFn: getCollabSummary,
		});

		return (
			<>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando colaboradores..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar dados dos colaboradores." />
				)}
				{data && <CollabTable data={data} />}
			</>
		);
	},
});
