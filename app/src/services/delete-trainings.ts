export const deleteTraining = async (training: {
	treinamentoId: string;
	colaboradorId: string;
	lastValue?: boolean;
}): Promise<{ success: boolean }> => {
	try {
		const response = await fetch(`${process.env.API_URL}/trainings/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				treinamentoId: training.treinamentoId,
				colaboradorId: training.colaboradorId,
				lastValue: training.lastValue,
			}),
		});

		if (!response.ok) {
			throw new Error(`Erro ao deletar treinamento: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Erro na função deleteTraining:", error);
		return { success: false };
	}
};
