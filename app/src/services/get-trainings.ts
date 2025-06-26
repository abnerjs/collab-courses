import { env } from "@/env";

interface TrainingRequest {
	descricao?: string;
}

export const getTrainingsMatrix = async (): Promise<TrainingsResponse> => {
	const response = await fetch(`${env.VITE_API_URL}/matrix-trainings`);
	const data = await response.json();
	return data;
};

export const getTrainings = async ({
	queryKey,
}: {
	queryKey: [string, TrainingRequest];
}): Promise<TrainingOverviewResponse> => {
	const [_key, { descricao }] = queryKey as [string, TrainingRequest];

	const url = new URL(`${env.VITE_API_URL}/trainings`);

	if (descricao && descricao.trim().length > 0) {
		url.searchParams.set("descricao", descricao);
	}

	const response = fetch(url).then((res) => {
		return res.json();
	});

	return response;
};

export interface TrainingOverviewResponse {
	data: TreinamentoOverview[];
}

export interface TreinamentoOverview {
	id: string;
	nome: string;
	validade: number;
	noPrazo: number;
	vencendo: number;
	vencido: number;
	naoRealizado: number;
}

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
