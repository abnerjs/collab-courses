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
	pageIndex?: number;
	pageSize?: number;
}

export async function searchCollaboratorsWithTrainingStatus({
	nome,
	setorIds,
	cargoIds,
	pageIndex = 0,
	pageSize = 10,
}: SearchCollaboratorsParams) {
	const requiredTrainings = db.$with("required_trainings").as(
		db
			.select({
				colaboradorId: colaborador.id,
				cargoId: colaborador.cargo,
				treinamentoId: cargoTreinamento.treinamento,
			})
			.from(colaborador)
			.innerJoin(
				cargoTreinamento,
				eq(colaborador.cargo, cargoTreinamento.cargo),
			),
	);

	const trainingsStatus = db.$with("trainings_status").as(
		db
			.with(requiredTrainings)
			.select({
				colaboradorId: requiredTrainings.colaboradorId,
				status: sql<
					"no_prazo" | "vencendo" | "vencido" | "nao_realizado"
				> /*sql*/`
          CASE
            WHEN tc.id IS NULL THEN 'nao_realizado'
            WHEN (tc.data_realizacao + (t.validade || ' days')::interval) < NOW() THEN 'vencido'
            WHEN (tc.data_realizacao + (t.validade || ' days')::interval) <= (NOW() + '1 month'::interval) THEN 'vencendo'
            ELSE 'no_prazo'
          END
        `.as("status"),
			})
			.from(requiredTrainings)
			.leftJoin(
				treinamentoColaborador,
				and(
					eq(
						requiredTrainings.colaboradorId,
						treinamentoColaborador.colaborador,
					),
					eq(
						requiredTrainings.treinamentoId,
						treinamentoColaborador.treinamento,
					),
				),
			)
			.innerJoin(
				treinamento,
				eq(requiredTrainings.treinamentoId, treinamento.id),
			),
	);

	const whereClauses = and(
		nome ? ilike(colaborador.nome, `%${nome}%`) : undefined,
		setorIds && setorIds.length > 0
			? inArray(cargo.setor, setorIds)
			: undefined,
		cargoIds && cargoIds.length > 0
			? inArray(colaborador.cargo, cargoIds)
			: undefined,
	);

	const collaboratorsWithStatus = await db
		.with(trainingsStatus)
		.select({
			id: colaborador.id,
			nome: colaborador.nome,
			cargo: cargo.descricao,
			setor: setor.descricao,
			noPrazo: count(sql`CASE WHEN status = 'no_prazo' THEN 1 END`).mapWith(
				Number,
			),
			vencendo: count(sql`CASE WHEN status = 'vencendo' THEN 1 END`).mapWith(
				Number,
			),
			vencido: count(sql`CASE WHEN status = 'vencido' THEN 1 END`).mapWith(
				Number,
			),
			naoRealizado: count(
				sql`CASE WHEN status = 'nao_realizado' THEN 1 END`,
			).mapWith(Number),
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.leftJoin(
			trainingsStatus,
			eq(colaborador.id, trainingsStatus.colaboradorId),
		)
		.where(whereClauses)
		.groupBy(colaborador.id, cargo.descricao, setor.descricao)
		.orderBy(colaborador.nome)
		.limit(pageSize)
		.offset(pageIndex * pageSize);

	const totalCountResult = await db
		.select({
			count: count().mapWith(Number),
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.where(whereClauses);

	return {
		collaborators: collaboratorsWithStatus,
		meta: {
			total: totalCountResult[0].count,
			pageIndex,
			pageSize,
			pageCount: Math.ceil(totalCountResult[0].count / pageSize),
		},
	};
}
