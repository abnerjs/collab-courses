import { db } from "../db";
import { cargoTreinamento } from "../db/schema";
import { eq, and } from "drizzle-orm";

export async function changeTraining(
	treinamentoId: string,
	cargoId: string,
	status: boolean,
) {
	const existingRecord = await db
		.select()
		.from(cargoTreinamento)
		.where(
			and(
				eq(cargoTreinamento.treinamento, treinamentoId),
				eq(cargoTreinamento.cargo, cargoId),
			),
		);

	if (status) {
		if (existingRecord.length === 0)
			await db.insert(cargoTreinamento).values({
				cargo: cargoId,
				treinamento: treinamentoId,
			});
	} else {
		if (existingRecord.length > 0) {
			await db
				.delete(cargoTreinamento)
				.where(
					and(
						eq(cargoTreinamento.treinamento, treinamentoId),
						eq(cargoTreinamento.cargo, cargoId),
					),
				);
		}
	}
}
