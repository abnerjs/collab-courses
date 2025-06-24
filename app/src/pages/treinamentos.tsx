import { MatrixTrainings } from "@/components/matrix-trainings";
import { Navbar } from "@/components/navbar";
import { getTrainings } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";
import { idbRemove } from "@/lib/query-idb-persister";

export function Treinamentos() {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["treinamentos"],
		queryFn: getTrainings,
	});

	async function handleSync() {
		await idbRemove("trainings");
		refetch();
	}

	return (
		<>
			<Navbar sync={handleSync} />
			{isLoading && <div>Carregando...</div>}
			{isError && <div>Erro ao carregar os dados.</div>}
			{data && <MatrixTrainings data={data} />}
		</>
	);
}
