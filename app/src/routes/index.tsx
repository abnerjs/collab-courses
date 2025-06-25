import { CollabTable } from "@/components/collab-table";
import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { Input } from "@/components/ui/input";
import { getCollabSummary } from "@/services/get-collab";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";

export const Route = createFileRoute("/")({
	component: function Index() {
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

		const { data, isLoading, isError, isStale } = useQuery({
			queryKey: ["colaboradores", search],
			queryFn: ({ queryKey }) =>
				getCollabSummary({
					queryKey: ["colaboradores", { nome: queryKey[1] as string }],
				}),
			staleTime: 1000 * 60 * 5,
		});

		return (
			<>
				<div className="w-full px-8 mb-8 flex-1 flex flex-col">
					<div className="flex items-center py-4 gap-4">
						<h1 className="text-2xl font-semibold">Colaboradores</h1>
						<Input
							placeholder="Buscar por nome..."
							value={search}
							onChange={setCurrentSearch}
							className="max-w-sm"
						/>
						<h1>{isStale ? "sim" : "nao"}</h1>
					</div>
					{isLoading && !data && (
						<ErrorLoadingMessage message="Carregando colaboradores..." />
					)}
					{isError && (
						<ErrorLoadingMessage message="Erro ao carregar colaboradores." />
					)}
					{!isLoading && !!data && <CollabTable data={data} />}
				</div>
			</>
		);
	},
});
