import { env } from "@/env";

export const getTrainingDetails = async (
	id: string,
): Promise<TrainingDetailResponse> => {
	const response = await fetch(`${env.VITE_API_URL}/trainings/${id}`);
	const data = await response.json();
	return data;
};

export interface TrainingDetailResponse {
	id: string;
	nome: string;
	validade: number;
	noPrazo: CollabComplete[];
	vencendo: CollabComplete[];
	vencido: CollabComplete[];
	naoRealizado: CollabComplete[];
}

export interface CollabComplete {
	id: string;
	nome: string;
	cargo: string;
	realizacao: Date | null;
}
