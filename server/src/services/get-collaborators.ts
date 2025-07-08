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
import dayjs from "dayjs";

interface SearchCollaboratorsParams {
	nome?: string;
	setorIds?: string[];
	cargoIds?: string[];
	statuses?: string[];
}

export async function getCollaborators({
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
				sql`(${treinamentoColaborador.realizacao}) = (
					SELECT MAX(tc2.realizacao)
					FROM ${treinamentoColaborador} as tc2
					WHERE tc2.colaborador = ${colaborador.id}
					AND tc2.treinamento = ${treinamento.id}
				)`,
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

export async function getCollaboratorsById(id: string) {
	const requiredTrainings = db.$with("required_trainings").as(
		db
			.select({
				treinamentoId: cargoTreinamento.treinamento,
				nome: treinamento.nome,
				validade: treinamento.validade,
			})
			.from(colaborador)
			.innerJoin(
				cargoTreinamento,
				eq(colaborador.cargo, cargoTreinamento.cargo),
			)
			.innerJoin(treinamento, eq(treinamento.id, cargoTreinamento.treinamento))
			.where(eq(colaborador.id, id)),
	);

	const trainings = await db
		.with(requiredTrainings)
		.select({
			treinamentoId: requiredTrainings.treinamentoId,
			nome: requiredTrainings.nome,
			validade: requiredTrainings.validade,
			realizacao: treinamentoColaborador.realizacao,
		})
		.from(requiredTrainings)
		.leftJoin(
			treinamentoColaborador,
			and(
				eq(treinamentoColaborador.colaborador, id),
				eq(treinamentoColaborador.treinamento, requiredTrainings.treinamentoId),
				sql`(${treinamentoColaborador.realizacao}) = (
								SELECT MAX(tc2.realizacao)
								FROM ${treinamentoColaborador} as tc2
								WHERE tc2.colaborador = ${treinamentoColaborador.colaborador}
								AND tc2.treinamento = ${treinamentoColaborador.treinamento}
							)`,
			),
		);

	const noPrazo = trainings.filter((t) => {
		if (!t.realizacao) return false;
		const validade = dayjs(t.realizacao).add(t.validade, "day");

		return validade.isAfter(dayjs().add(30, "day").toDate());
	});

	const vencendo = trainings.filter((t) => {
		if (!t.realizacao) return false;
		const validade = dayjs(t.realizacao).add(t.validade, "day");

		return (
			validade.isBefore(dayjs().add(30, "day").toDate()) &&
			validade.isAfter(dayjs().toDate())
		);
	});

	const vencido = trainings.filter((t) => {
		if (!t.realizacao) return false;

		const validade = dayjs(t.realizacao).add(t.validade, "day");
		return validade.isBefore(dayjs().toDate());
	});

	const naoRealizado = trainings.filter((t) => !t.realizacao);

	const collaborator = db
		.select({
			id: colaborador.id,
			nome: colaborador.nome,
			cargo: cargo.descricao,
			setor: setor.descricao,
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.where(eq(colaborador.id, id))
		.limit(1)
		.then((rows) => rows[0]);

	return {
		collaborator,
		noPrazo,
		vencendo,
		vencido,
		naoRealizado,
	};
}
