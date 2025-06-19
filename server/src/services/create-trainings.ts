import { db } from "../db";
import { treinamentoColaborador } from "../db/schema";
import dayjs from "dayjs";

export async function createTraining(
	treinamentoId: string,
	colaboradorId: string,
	realizacao: string,
) {
	const result = db
		.insert(treinamentoColaborador)
		.values([
			{
				treinamento: treinamentoId,
				colaborador: colaboradorId,
				realizacao: dayjs(realizacao).toDate(),
			},
		])
		.returning();

	return result;
}
