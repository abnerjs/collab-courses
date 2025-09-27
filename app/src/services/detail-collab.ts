import { env } from "@/env"

export const getCollabDetails = async (
	id: string,
): Promise<CollabDetailResponse> => {
	const response = await fetch(`${env.VITE_API_URL}/collaborators/${id}`);
	const data = await response.json();
	return data.data;
};

export interface CollabDetailResponse {
	id: string;
	nome: string;
	cargo: Cargo;
	noPrazo: TreinamentoComplete[];
	vencendo: TreinamentoComplete[];
	vencido: TreinamentoComplete[];
	naoRealizado: TreinamentoComplete[];
}
export interface Cargo {
  id: string
  descricao: string
  setor: Setor
}

export interface Setor {
  id: string
  descricao: string
}

export interface TreinamentoComplete {
	treinamentoId: string;
	nome: string;
	validade: number;
	realizacao?: string;
}
