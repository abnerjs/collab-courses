import { eq } from "drizzle-orm";
import { db } from "../db";
import { cargo, setor } from "../db/schema";
import { NotFoundError } from "./errors";

export interface SectorDto {
	id: string;
	descricao: string;
}

export interface PositionDto {
	id: string;
	descricao: string;
	setor: SectorDto;
}

export async function listSectors(): Promise<SectorDto[]> {
	const result = await db.select().from(setor).orderBy(setor.descricao);

	return result.map((row) => ({
		id: row.id,
		descricao: row.descricao,
	}));
}

export async function listPositionsBySector(
	sectorId: string,
): Promise<PositionDto[]> {
	const [sectorRow] = await db
		.select()
		.from(setor)
		.where(eq(setor.id, sectorId))
		.limit(1);

	if (!sectorRow) {
		throw new NotFoundError("Setor não encontrado", { sectorId });
	}

	const result = await db
		.select({
			id: cargo.id,
			descricao: cargo.descricao,
		})
		.from(cargo)
		.where(eq(cargo.setor, sectorId))
		.orderBy(cargo.descricao);

	return result.map((row) => ({
		id: row.id,
		descricao: row.descricao,
		setor: {
			id: sectorRow.id,
			descricao: sectorRow.descricao,
		},
	}));
}

export async function listPositions(): Promise<PositionDto[]> {
	const result = await db
		.select({
			id: cargo.id,
			descricao: cargo.descricao,
			setor: {
				id: setor.id,
				descricao: setor.descricao,
			},
		})
		.from(cargo)
		.innerJoin(setor, eq(cargo.setor, setor.id))
		.orderBy(setor.descricao, cargo.descricao);

	return result.map((row) => ({
		id: row.id,
		descricao: row.descricao,
		setor: {
			id: row.setor.id,
			descricao: row.setor.descricao,
		},
	}));
}
