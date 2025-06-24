import { CollabTable } from "@/components/collab-table";
import { Navbar } from "@/components/navbar";
import { getCollabSummary } from "@/services/get-collab";
import { useQuery } from "@tanstack/react-query";
import { idbRemove } from "@/lib/query-idb-persister";

function Index() {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["colaboradores"],
		queryFn: getCollabSummary,
	});

	async function handleSync() {
		await idbRemove("collab-summary");
		refetch();
	}

	return (
		<>
			<Navbar sync={handleSync} />
			{isLoading && <div>Loading...</div>}
			{isError && <div>Error loading data</div>}
			{data && <CollabTable data={data} />}
		</>
	);
}

export default Index;
