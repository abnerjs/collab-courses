import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db";
import {
	cargo,
	cargoTreinamento,
	colaborador,
	treinamento,
	treinamentoColaborador,
} from "../../db/schema";
import { eq, sql, and } from "drizzle-orm";

export const TestRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/test/", async (request, reply) => {
		const response = await db
			.select({
				id: treinamento.id,
				nome: treinamento.nome,
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
			.groupBy(treinamento.id);

		return reply.status(200).send(response);
	});
};
