export const createTraining = async (training: {
	treinamentoId: string;
	colaboradorId: string;
	realizacao: Date;
}): Promise<{ success: boolean }> => {
	try {
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

		if (!response.ok) {
			throw new Error(`Erro ao criar treinamento: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Erro na função createTraining:", error);
		return { success: false };
	}
};
