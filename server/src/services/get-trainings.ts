import { sql, eq, and, ilike } from "drizzle-orm";
import { db } from "../db";
import {
	cargoTreinamento,
	colaborador,
	treinamento,
	treinamentoColaborador,
} from "../db/schema";

interface FilterParams {
	descricao?: string;
}

export async function getTrainings({ descricao }: FilterParams) {
	const conditions = [];

	if (descricao) {
		descricao = descricao.normalize("NFD").replace(/\p{M}/gu, "");

		const tokens = descricao.split(" ").filter((t) => t.length > 0);

		for (const token of tokens) {
			conditions.push(ilike(sql`(${treinamento.nome})`, `%${token}%`));
		}
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const response = await db
		.select({
			id: treinamento.id,
			nome: treinamento.nome,
			validade: treinamento.validade,
			noPrazo: sql<number>`COUNT(colaborador.id) FILTER (WHERE
						CASE
							WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
							ELSE 'no_prazo'
						END = 'no_prazo')`,
			vencendo: sql<number>`COUNT(colaborador.id) FILTER (WHERE
						CASE
							WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
							ELSE 'no_prazo'
						END = 'vencendo')`,
			vencido: sql<number>`COUNT(colaborador.id) FILTER (WHERE
						CASE
							WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
							ELSE 'no_prazo'
						END = 'vencido')`,
			naoRealizado: sql<number>`COUNT(colaborador.id) FILTER (WHERE
						CASE
							WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
							WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
							ELSE 'no_prazo'
						END = 'nao_realizado')`,
		})
		.from(treinamento)
		.innerJoin(
			cargoTreinamento,
			eq(cargoTreinamento.treinamento, treinamento.id),
		)
		.innerJoin(colaborador, eq(cargoTreinamento.cargo, colaborador.cargo))
		.leftJoin(
			treinamentoColaborador,
			and(
				eq(treinamentoColaborador.treinamento, treinamento.id),
				eq(treinamentoColaborador.colaborador, colaborador.id),
			),
		)
		.where(where)
		.groupBy(treinamento.id)
		.orderBy(treinamento.nome);

	return response;
}
