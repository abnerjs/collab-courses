// no seu arquivo de serviço: search-collaborators.ts
import { and, count, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import {
	cargo,
	cargoTreinamento,
	colaborador,
	setor,
	treinamento,
	treinamentoColaborador,
} from "../db/schema";

interface SearchCollaboratorsParams {
	nome?: string;
	setorIds?: string[];
	cargoIds?: string[];
	statuses?: string[];
}

export async function searchCollaboratorsWithTrainingStatus({
	nome,
	setorIds,
	cargoIds,
	statuses,
}: SearchCollaboratorsParams) {
	const conditions = [];

	if (nome) {
		nome = nome.normalize("NFD").replace(/\p{M}/gu, "");
		nome = nome.replace("ç", "c").trim();

		const tokens = nome.split(" ").filter((t) => t.length > 0);
		for (const token of tokens) {
			conditions.push(ilike(sql`(${colaborador.nome})`, `%${token}%`));
		}
	}

	if (cargoIds && cargoIds.length > 0) {
		conditions.push(inArray(colaborador.cargo, cargoIds));
	}

	if (setorIds && setorIds.length > 0) {
		conditions.push(inArray(cargo.setor, setorIds));
	}

	if (statuses && statuses.length > 0) {
		conditions.push(sql`COUNT(*) FILTER (WHERE
			CASE
				WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
				WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
				WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
				ELSE 'no_prazo'
			END IN (${statuses}) ) > 0`);
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const data = await db
		.select({
			id: colaborador.id,
			nomeColaborador: colaborador.nome,
			cargo: cargo.descricao,
			setor: setor.descricao,
			noPrazo: sql<number>`COUNT(*) FILTER (WHERE
		CASE
			WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
			ELSE 'no_prazo'
		END = 'no_prazo')`,
			vencendo: sql<number>`COUNT(*) FILTER (WHERE
		CASE
			WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
			ELSE 'no_prazo'
		END = 'vencendo')`,
			vencido: sql<number>`COUNT(*) FILTER (WHERE
		CASE
			WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
			ELSE 'no_prazo'
		END = 'vencido')`,
			naoRealizado: sql<number>`COUNT(*) FILTER (WHERE
		CASE
			WHEN ${treinamentoColaborador.realizacao} IS NULL THEN 'nao_realizado'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval < CURRENT_DATE THEN 'vencido'
			WHEN ${treinamentoColaborador.realizacao} + (${treinamento.validade} || ' days')::interval <= (CURRENT_DATE + INTERVAL '1 month') THEN 'vencendo'
			ELSE 'no_prazo'
		END = 'nao_realizado')`,
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.innerJoin(cargoTreinamento, eq(colaborador.cargo, cargoTreinamento.cargo))
		.innerJoin(treinamento, eq(treinamento.id, cargoTreinamento.treinamento))
		.leftJoin(
			treinamentoColaborador,
			and(
				eq(treinamentoColaborador.colaborador, colaborador.id),
				eq(treinamentoColaborador.treinamento, treinamento.id),
			),
		)
		.where(where)
		.groupBy(colaborador.id, colaborador.nome, cargo.descricao, setor.descricao)
		.orderBy(colaborador.nome);

	const total = await db
		.select({ count: sql<number>`COUNT(DISTINCT ${colaborador.id})` })
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.innerJoin(cargoTreinamento, eq(colaborador.cargo, cargoTreinamento.cargo))
		.innerJoin(treinamento, eq(treinamento.id, cargoTreinamento.treinamento))
		.where(where);

	const totalRecords = Number(total[0]?.count ?? 0);

	return {
		data: data,
		meta: {
			total: totalRecords,
		},
	};
}
