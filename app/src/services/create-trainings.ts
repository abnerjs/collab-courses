export const createTraining = async (training: {
	treinamentoId: string;
	colaboradorId: string;
	realizacao: Date;
}): Promise<{ success: boolean }> => {
	const response = await fetch("http://localhost:3000/trainings/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			treinamentoId: training.treinamentoId,
			colaboradorId: training.colaboradorId,
			realizacao: training.realizacao.toISOString(),
		}),
	});
	const data = await response.json();
	return data;
};
