import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "./lib/query-idb-persister";
import Index from "./pages/index.tsx";
import { Treinamentos } from "./pages/treinamentos.tsx";
import { DetailCollab } from "./pages/detail-collab.tsx";
import { SyncManager } from "@/components/SyncManager";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Index,
	},
	{
		path: "/matrix_trainings",
		Component: Treinamentos,
	},
	{
		path: "/collaborators/:id",
		Component: DetailCollab,
	},
]);

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutos
			refetchInterval: 1000 * 60 * 60 * 24, // 24h
			refetchOnWindowFocus: false,
		},
	},
});

(async () => {
	const persister = await createIDBPersister();
	persistQueryClient({
		queryClient,
		persister,
		maxAge: 1000 * 60 * 60 * 24, // 24h
	});

	createRoot(root).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<SyncManager />
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
})();
