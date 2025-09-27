import { env } from "@/env"

export interface TrainingDto {
	id: string;
	nome: string;
	validade: number;
}

export interface CreateTrainingRequest {
	nome: string;
	validade: number;
}

export interface UpdateTrainingRequest {
	nome?: string;
	validade?: number;
}

export const getTrainingsList = async (): Promise<TrainingDto[]> => {
	const response = await fetch(`${env.VITE_API_URL}/trainings`);
	const data = await response.json();
	return data.data;
};

export const createTraining = async (training: CreateTrainingRequest): Promise<TrainingDto> => {
	const response = await fetch(`${env.VITE_API_URL}/trainings`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(training),
	});
	const data = await response.json();
	return data.data;
};

export const updateTraining = async (id: string, training: UpdateTrainingRequest): Promise<TrainingDto> => {
	const response = await fetch(`${env.VITE_API_URL}/trainings/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(training),
	});
	const data = await response.json();
	return data.data;
};

export const deleteTraining = async (id: string): Promise<void> => {
	await fetch(`${env.VITE_API_URL}/trainings/${id}`, {
		method: 'DELETE',
	});
};