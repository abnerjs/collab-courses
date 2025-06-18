import { CollabTable } from "@/components/collab-table";
import { Navbar } from "@/components/navbar";
import { getCollabSummary } from "@/services/get-collab-summary";
import { useQuery } from "@tanstack/react-query";

function Index() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["colaboradores"],
		queryFn: getCollabSummary,
	});

	return (
		<>
			<Navbar />
			<CollabTable data={data} isLoading={isLoading} isError={isError} />
		</>
	);
}

export default Index;
