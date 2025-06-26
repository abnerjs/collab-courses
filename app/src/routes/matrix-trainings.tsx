import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { MatrixTrainings } from "@/components/matrix-trainings";
import { Button } from "@/components/ui/button";
import { getTrainingsMatrix } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/matrix-trainings")({
	component: function MatrizTreinamentos() {
		const { data, isLoading, isError } = useQuery({
			queryKey: ["matriz-treinamentos"],
			queryFn: getTrainingsMatrix,
		});

		return (
			<div className="w-full px-8 mb-8 flex-1 flex flex-col">
				<div className="flex w-full items-center py-4 gap-4">
					<h1 className="text-2xl font-semibold">Matriz de Treinamentos</h1>
					<Button className="ml-auto">Importar matriz</Button>
				</div>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando matriz de treinamentos..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar dados da matriz." />
				)}
				{data && <MatrixTrainings data={data} />}
			</div>
		);
	},
});
