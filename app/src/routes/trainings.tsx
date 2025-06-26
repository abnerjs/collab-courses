import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { TrainingTable } from "@/components/training-table";
import { Input } from "@/components/ui/input";
import { getTrainings } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";

export const Route = createFileRoute("/trainings")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState(() => {
		const url = new URL(window.location.toString());
		if (url.searchParams.has("search")) {
			return url.searchParams.get("search") ?? "";
		}

		return "";
	});

	function setCurrentSearch(event: ChangeEvent<HTMLInputElement>) {
		const url = new URL(window.location.toString());
		url.searchParams.set("search", event.target.value);
		window.history.pushState({}, "", url);

		if (event.target.value === "") {
			url.searchParams.delete("search");
			window.history.pushState({}, "", url);
		}

		setSearch(event.target.value);
	}

	const { data, isLoading, isError } = useQuery({
		queryKey: ["treinamentos", search],
		queryFn: ({ queryKey }) =>
			getTrainings({
				queryKey: ["treinamentos", { descricao: queryKey[1] as string }],
			}),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<div className="w-full px-8 mb-8 flex-1 flex flex-col">
			<div className="flex items-center py-4 gap-4">
				<h1 className="text-2xl font-semibold">Treinamentos</h1>
				<Input
					placeholder="Buscar por descrição..."
					value={search}
					onChange={setCurrentSearch}
					className="max-w-sm"
				/>
			</div>
			{isLoading && !data && (
				<ErrorLoadingMessage message="Carregando treinamentos..." />
			)}
			{isError && (
				<ErrorLoadingMessage message="Erro ao carregar treinamentos." />
			)}
			{!isLoading && !!data && <TrainingTable data={data} />}
		</div>
	);
}
