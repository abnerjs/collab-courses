import { db } from "../db";
import { treinamento } from "../db/schema";

export async function getTrainings() {
	const trainings = await db
		.select({
			id: treinamento.id,
			nome: treinamento.nome,
		})
		.from(treinamento);
}
