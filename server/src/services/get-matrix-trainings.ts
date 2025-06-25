import { eq } from "drizzle-orm";
import { db } from "../db";
import { cargo, cargoTreinamento, treinamento } from "../db/schema";

export async function getMatrixTrainings() {
	const cargosWithTrainings = await db
		.select({
			id: cargo.id,
			descricao: cargo.descricao,
		})
		.from(cargo)
		.orderBy(cargo.descricao);

	const result = await Promise.all(
		cargosWithTrainings.map(async (cargoItem) => {
			const treinamentos = await db
				.select({
					id: treinamento.id,
				})
				.from(treinamento)
				.innerJoin(
					cargoTreinamento,
					eq(cargoTreinamento.treinamento, treinamento.id),
				)
				.where(eq(cargoTreinamento.cargo, cargoItem.id));

			return {
				...cargoItem,
				treinamentos,
			};
		}),
	);

	const treinamentos = await db
		.select({
			id: treinamento.id,
			nome: treinamento.nome,
		})
		.from(treinamento);
	// .orderBy(treinamento.nome);

	return [result, treinamentos];
}
