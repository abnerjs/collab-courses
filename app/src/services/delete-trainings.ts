export const deleteTraining = async (training: {
	treinamentoId: string;
	colaboradorId: string;
	lastValue?: boolean;
}): Promise<{ success: boolean }> => {
	const response = await fetch("http://localhost:3000/trainings/delete", {
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
	const data = await response.json();
	return data;
};
