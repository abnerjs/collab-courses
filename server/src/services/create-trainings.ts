import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { treinamentoColaborador } from "../db/schema";

export async function createTraining(
	treinamentoId: string,
	colaboradorId: string,
	realizacao: string,
) {
	const hasSameDate = await db
		.select()
		.from(treinamentoColaborador)
		.where(
			and(
				eq(treinamentoColaborador.treinamento, treinamentoId),
				eq(treinamentoColaborador.colaborador, colaboradorId),
				eq(treinamentoColaborador.realizacao, dayjs(realizacao).toDate()),
			),
		);

	if (hasSameDate.length > 0) {
		throw new Error("Treinamento já registrado para essa data");
	}

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
