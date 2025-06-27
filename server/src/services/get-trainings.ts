import { sql, eq, and, ilike, desc } from "drizzle-orm";
import { db } from "../db";
import {
	cargoTreinamento,
	colaborador,
	treinamento,
	treinamentoColaborador,
} from "../db/schema";
import dayjs from "dayjs";

interface FilterParams {
	descricao?: string;
}

export async function getTrainings({ descricao }: FilterParams) {
	const conditions = [];

	if (descricao) {
		descricao = descricao.trim();
		descricao = descricao.normalize("NFD").replace(/\p{M}/gu, "");
		descricao = descricao.replace("ç", "c");

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

export async function getTrainingById(id: string) {
	const training = await db
		.select()
		.from(treinamento)
		.where(eq(treinamento.id, id))
		.limit(1)
		.then((rows) => rows[0]);

	const collabs = await db
		.select({
			id: colaborador.id,
			nome: colaborador.nome,
			cargo: colaborador.cargo,
			realizacao: treinamentoColaborador.realizacao,
		})
		.from(colaborador)
		.innerJoin(cargoTreinamento, eq(cargoTreinamento.cargo, colaborador.cargo))
		.where(eq(cargoTreinamento.treinamento, id))
		.orderBy(desc(colaborador.nome));

	const noPrazo = collabs.filter((t) => {
		if (!t.realizacao) return false;
		const validade = dayjs(t.realizacao).add(training.validade, "day");

		return validade.isAfter(dayjs().add(30, "day").toDate());
	});

	const vencendo = collabs.filter((t) => {
		if (!t.realizacao) return false;
		const validade = dayjs(t.realizacao).add(training.validade, "day");

		return (
			validade.isAfter(dayjs().toDate()) &&
			validade.isBefore(dayjs().add(30, "day").toDate())
		);
	});

	const vencido = collabs.filter((t) => {
		if (!t.realizacao) return false;
		const validade = dayjs(t.realizacao).add(training.validade, "day");

		return validade.isBefore(dayjs().toDate());
	});

	const naoRealizado = collabs.filter((t) => !t.realizacao);

	return {
		treinamento: training,
		noPrazo: noPrazo,
		vencendo: vencendo,
		vencido: vencido,
		naoRealizado: naoRealizado,
	};
}
