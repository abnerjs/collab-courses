import { eq } from "drizzle-orm";
import { db } from "../db";
import { treinamento } from "../db/schema";
import { NotFoundError, ValidationError } from "./errors";

export interface TrainingPayload {
	nome: string;
	validade: number;
}

export interface TrainingUpdatePayload {
	nome?: string;
	validade?: number;
}

export interface TrainingDto {
	id: string;
	nome: string;
	validade: number;
}

function mapTraining(row: typeof treinamento.$inferSelect): TrainingDto {
	return {
		id: row.id,
		nome: row.nome,
		validade: row.validade,
	};
}

async function fetchTraining(id: string) {
	const [training] = await db
		.select()
		.from(treinamento)
		.where(eq(treinamento.id, id))
		.limit(1);

	return training ?? null;
}

function ensureValidPayload(payload: TrainingPayload | TrainingUpdatePayload) {
	if (payload.validade !== undefined && payload.validade <= 0) {
		throw new ValidationError("Validade deve ser maior que zero", payload);
	}
}

export async function listTrainings(): Promise<TrainingDto[]> {
	const result = await db.select().from(treinamento).orderBy(treinamento.nome);

	return result.map(mapTraining);
}

export async function getTrainingRecord(id: string): Promise<TrainingDto> {
	const training = await fetchTraining(id);

	if (!training) {
		throw new NotFoundError("Treinamento não encontrado", { id });
	}

	return mapTraining(training);
}

export async function createTrainingRecord(
	payload: TrainingPayload,
): Promise<TrainingDto> {
	ensureValidPayload(payload);

	const [inserted] = await db
		.insert(treinamento)
		.values({
			nome: payload.nome,
			validade: payload.validade,
		})
		.returning();

	return mapTraining(inserted);
}

export async function updateTrainingRecord(
	id: string,
	payload: TrainingUpdatePayload,
): Promise<TrainingDto> {
	const existing = await fetchTraining(id);

	if (!existing) {
		throw new NotFoundError("Treinamento não encontrado", { id });
	}

	if (!payload.nome && payload.validade === undefined) {
		return mapTraining(existing);
	}

	ensureValidPayload(payload);

	const [updated] = await db
		.update(treinamento)
		.set({
			nome: payload.nome ?? existing.nome,
			validade: payload.validade ?? existing.validade,
		})
		.where(eq(treinamento.id, id))
		.returning();

	if (!updated) {
		throw new NotFoundError("Treinamento não encontrado após atualização", {
			id,
		});
	}

	return mapTraining(updated);
}

export async function deleteTrainingRecord(id: string): Promise<void> {
	const [deleted] = await db
		.delete(treinamento)
		.where(eq(treinamento.id, id))
		.returning({ id: treinamento.id });

	if (!deleted) {
		throw new NotFoundError("Treinamento não encontrado", { id });
	}
}
