import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/index.tsx";
import { Treinamentos } from "./pages/treinamentos.tsx";
import { DetailCollab } from "./pages/detail-collab.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Index,
	},
	{
		path: "/trainings",
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

const queryClient = new QueryClient();

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
