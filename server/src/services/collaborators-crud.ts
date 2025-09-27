import { eq } from "drizzle-orm";
import { db } from "../db";
import { cargo, colaborador, setor } from "../db/schema";
import { NotFoundError, ValidationError } from "./errors";

export interface CollaboratorPayload {
	nome: string;
	cargoId: string;
}

export interface CollaboratorUpdatePayload {
	nome?: string;
	cargoId?: string;
}

export interface CollaboratorDto {
	id: string;
	nome: string;
	createdAt: Date;
	cargo: {
		id: string;
		descricao: string;
		setor: {
			id: string;
			descricao: string;
		};
	};
}

interface CollaboratorRow {
	id: string;
	nome: string;
	createdAt: Date;
	cargoId: string;
	cargoDescricao: string;
	setorId: string;
	setorDescricao: string;
}

function mapCollaborator(row: CollaboratorRow): CollaboratorDto {
	return {
		id: row.id,
		nome: row.nome,
		createdAt: row.createdAt,
		cargo: {
			id: row.cargoId,
			descricao: row.cargoDescricao,
			setor: {
				id: row.setorId,
				descricao: row.setorDescricao,
			},
		},
	};
}

async function fetchCollaboratorById(
	id: string,
): Promise<CollaboratorRow | null> {
	const result = await db
		.select({
			id: colaborador.id,
			nome: colaborador.nome,
			createdAt: colaborador.createdAt,
			cargoId: cargo.id,
			cargoDescricao: cargo.descricao,
			setorId: setor.id,
			setorDescricao: setor.descricao,
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.where(eq(colaborador.id, id))
		.limit(1);

	return result[0] ?? null;
}

async function ensureCargoExists(cargoId: string) {
	const [existing] = await db
		.select({ id: cargo.id })
		.from(cargo)
		.where(eq(cargo.id, cargoId))
		.limit(1);

	if (!existing) {
		throw new ValidationError("Cargo informado não existe", { cargoId });
	}
}

export async function listCollaborators(): Promise<CollaboratorDto[]> {
	const result = await db
		.select({
			id: colaborador.id,
			nome: colaborador.nome,
			createdAt: colaborador.createdAt,
			cargoId: cargo.id,
			cargoDescricao: cargo.descricao,
			setorId: setor.id,
			setorDescricao: setor.descricao,
		})
		.from(colaborador)
		.innerJoin(cargo, eq(colaborador.cargo, cargo.id))
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.orderBy(colaborador.nome);

	return result.map(mapCollaborator);
}

export async function getCollaborator(id: string): Promise<CollaboratorDto> {
	const row = await fetchCollaboratorById(id);

	if (!row) {
		throw new NotFoundError("Colaborador não encontrado", { id });
	}

	return mapCollaborator(row);
}

export async function createCollaborator(
	payload: CollaboratorPayload,
): Promise<CollaboratorDto> {
	await ensureCargoExists(payload.cargoId);

	const [inserted] = await db
		.insert(colaborador)
		.values({
			nome: payload.nome,
			cargo: payload.cargoId,
		})
		.returning({ id: colaborador.id });

	const row = await fetchCollaboratorById(inserted.id);

	if (!row) {
		throw new NotFoundError("Erro ao buscar colaborador recém-criado", {
			id: inserted.id,
		});
	}

	return mapCollaborator(row);
}

export async function updateCollaborator(
	id: string,
	payload: CollaboratorUpdatePayload,
): Promise<CollaboratorDto> {
	const existing = await fetchCollaboratorById(id);

	if (!existing) {
		throw new NotFoundError("Colaborador não encontrado", { id });
	}

	if (!payload.nome && !payload.cargoId) {
		return mapCollaborator(existing);
	}

	if (payload.cargoId) {
		await ensureCargoExists(payload.cargoId);
	}

	await db
		.update(colaborador)
		.set({
			nome: payload.nome ?? existing.nome,
			cargo: payload.cargoId ?? existing.cargoId,
		})
		.where(eq(colaborador.id, id));

	const updated = await fetchCollaboratorById(id);

	if (!updated) {
		throw new NotFoundError("Colaborador não encontrado após atualização", {
			id,
		});
	}

	return mapCollaborator(updated);
}

export async function deleteCollaborator(id: string): Promise<void> {
	const [deleted] = await db
		.delete(colaborador)
		.where(eq(colaborador.id, id))
		.returning({ id: colaborador.id });

	if (!deleted) {
		throw new NotFoundError("Colaborador não encontrado", { id });
	}
}
