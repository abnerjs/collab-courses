import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { MatrixTrainings } from "@/components/matrix-trainings";
import { getTrainingsMatrix } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/matrix-trainings")({
	component: function MatrizTreinamentos() {
		const { data, isLoading, isError } = useQuery({
			queryKey: ["matriz-treinamentos"],
			queryFn: getTrainingsMatrix,
		})

		return (
			<>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando matriz de treinamentos..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar dados da matriz." />
				)}
				{data && <MatrixTrainings data={data} />}
			</>
		)
	},
});
