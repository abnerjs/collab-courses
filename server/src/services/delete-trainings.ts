import { and, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { treinamentoColaborador } from "../db/schema";

export const deleteTrainings = async ({
	colaboradorId,
	treinamentoId,
	lastValue = false,
}: {
	colaboradorId: string;
	treinamentoId: string;
	lastValue?: boolean;
}) => {
	if (!lastValue) {
		const result = await db
			.delete(treinamentoColaborador)
			.where(
				and(
					eq(treinamentoColaborador.colaborador, colaboradorId),
					eq(treinamentoColaborador.treinamento, treinamentoId),
				),
			)
			.returning();
		return result;
	}

	const lastExistingRecord = await db
		.select()
		.from(treinamentoColaborador)
		.where(
			and(
				eq(treinamentoColaborador.colaborador, colaboradorId),
				eq(treinamentoColaborador.treinamento, treinamentoId),
			),
		)
		.orderBy(desc(treinamentoColaborador.realizacao))
		.limit(1)
		.then((records) => records[0]);

	const result = await db
		.delete(treinamentoColaborador)
		.where(eq(treinamentoColaborador.id, lastExistingRecord.id))
		.returning();
	return result;
};
