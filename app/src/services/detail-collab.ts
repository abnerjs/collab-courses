import { env } from "@/env";

export const getCollabDetails = async (
	id: string,
): Promise<CollabDetailResponse> => {
	const response = await fetch(`${env.VITE_API_URL}/collaborators/${id}`);
	const data = await response.json();
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
