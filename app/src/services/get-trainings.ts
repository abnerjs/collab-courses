import { env } from "@/env";
import { idbGet, idbSet } from "@/lib/query-idb-persister";

export const getTrainings = async (): Promise<TrainingsResponse> => {
	const cacheKey = "trainings";
	const cached = await idbGet<TrainingsResponse>(cacheKey);
	if (cached) return cached;

	const response = await fetch(`${env.VITE_API_URL}/trainings`);
	const data = await response.json();
	await idbSet(cacheKey, data);
	return data;
};

export interface TrainingsResponse {
	treinamentos: Treinamento[];
	cargos: Cargo[];
}

export interface Treinamento {
	id: string;
	nome: string;
}

export interface Cargo {
	id: string;
	descricao: string;
	treinamentos: Treinamento2[];
}

export interface Treinamento2 {
	id: string;
}
