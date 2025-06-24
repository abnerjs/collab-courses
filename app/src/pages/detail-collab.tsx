import { DetailCollabTable } from "@/components/detail-collab-table";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { getCollabDetails } from "@/services/detail-collab";
import type { CollabDetailResponse } from "@/services/detail-collab";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { idbRemove } from "@/lib/query-idb-persister";
import { Button } from "@/components/ui/button";

export const DetailCollab = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, refetch } = useQuery<
		CollabDetailResponse,
		Error
	>({
		queryKey: ["colaboradores-detail", id],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		queryFn: () => getCollabDetails(id!),
		enabled: !!id,
	});

	async function handleSync() {
		if (id) {
			await idbRemove(`collab-detail-${id}`);
			refetch();
		}
	}

	return (
		<>
			<Navbar sync={handleSync} />
			{isLoading && <p>Carregando...</p>}
			{isError && <p>Erro ao carregar detalhes do colaborador.</p>}
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
};
