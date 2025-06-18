import { MatrixTrainings } from "@/components/matrix-trainings";
import { Navbar } from "@/components/navbar";
import { getTrainings } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";

export function Treinamentos() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["treinamentos"],
		queryFn: getTrainings,
	});

	return (
		<>
			<Navbar />
			<MatrixTrainings data={data} isLoading={isLoading} isError={isError} />
		</>
	);
}
