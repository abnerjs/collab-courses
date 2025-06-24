import { env } from "@/env";
import { idbGet, idbSet } from "@/lib/query-idb-persister";

export const getCollabDetails = async (
	id: string,
): Promise<CollabDetailResponse> => {
	const cacheKey = `collab-detail-${id}`;
	const cached = await idbGet<CollabDetailResponse>(cacheKey);
	if (cached) return cached;

	const response = await fetch(`${env.VITE_API_URL}/collaborators/${id}`);
	const data = await response.json();
	await idbSet(cacheKey, data);
	return data;
};

export interface CollabDetailResponse {
	id: string;
	nome: string;
	cargo: string;
	setor: string;
	noPrazo: TreinamentoComplete[];
	vencendo: TreinamentoComplete[];
	vencido: TreinamentoComplete[];
	naoRealizado: TreinamentoComplete[];
}

export interface TreinamentoComplete {
	treinamentoId: string;
	nome: string;
	validade: number;
	realizacao?: string;
}
