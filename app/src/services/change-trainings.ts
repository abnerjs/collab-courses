import { env } from "@/env";

export const changeTrainings = async (
	treinamentoId: string,
	cargoId: string,
	status: boolean,
): Promise<{ success: boolean }> => {
	const response = await fetch(`${env.VITE_API_URL}/trainings/change`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			treinamentoId,
			cargoId,
			status,
		}),
	});
	const data = await response.json();
	return data;
};
