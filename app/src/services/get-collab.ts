import { env } from "@/env";
import { idbGet, idbSet } from "@/lib/query-idb-persister";

export const getCollabSummary = async (): Promise<CollabSummaryResponse> => {
	const cacheKey = "collab-summary";
	const cached = await idbGet<CollabSummaryResponse>(cacheKey);
	if (cached) return cached;

	const response = await fetch(`${env.VITE_API_URL}/`);
	const data = await response.json();
	await idbSet(cacheKey, data);
	return data;
};

export type CollabSummaryResponse = {
	data: {
		id: string;
		nomeColaborador: string;
		cargo: string;
		setor: string;
		noPrazo: number;
		vencendo: number;
		vencido: number;
		naoRealizado: number;
	}[];
	meta: {
		total: number;
		pageIndex: number;
		pageSize: number;
		pageCount: number;
	};
};
