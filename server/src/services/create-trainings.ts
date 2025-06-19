import { db } from "../db";
import { treinamentoColaborador } from "../db/schema";
import dayjs from "dayjs";

export async function createTraining(
	treinamentoId: string,
	colaboradorId: string,
	data: Date,
) {
	const result = db
		.insert(treinamentoColaborador)
		.values([
			{
				treinamento: treinamentoId,
				colaborador: colaboradorId,
				realizacao: data,
			},
		])
		.returning();

	return result;
}
