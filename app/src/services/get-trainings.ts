import { env } from "@/env";

export const getTrainingsMatrix = async (): Promise<TrainingsResponse> => {
	const response = await fetch(`${env.VITE_API_URL}/matrix-trainings`);
	const data = await response.json();
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
