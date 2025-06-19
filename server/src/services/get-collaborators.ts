import { sql, eq, and } from "drizzle-orm";
import { db } from "../db";
import {
	colaborador,
	cargo,
	setor,
	treinamentoColaborador,
	cargoTreinamento,
	treinamento,
} from "../db/schema";

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
			),
		);

	const noPrazo = trainings.filter((t) => {
		if (!t.realizacao) return false;
		const validade = new Date(t.realizacao);
		validade.setDate(validade.getDate() + t.validade);
		return (
			validade > new Date() &&
			validade > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		);
	});

	const vencendo = trainings.filter((t) => {
		if (!t.realizacao) return false;
		const validade = new Date(t.realizacao);
		validade.setDate(validade.getDate() + t.validade);
		return (
			validade > new Date() &&
			validade <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		);
	});

	const vencido = trainings.filter((t) => {
		if (!t.realizacao) return false;
		const validade = new Date(t.realizacao);
		validade.setDate(validade.getDate() + t.validade);
		return validade < new Date();
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
