export const getTrainings = async (): Promise<TrainingsResponse> => {
	const response = await fetch("http://localhost:3000/trainings");
	const data = await response.json();
	console.log(data);
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
