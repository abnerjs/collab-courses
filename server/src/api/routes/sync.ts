import type { FastifyInstance } from "fastify";
import { eq, gt } from "drizzle-orm";
import {
	colaborador,
	treinamento,
	cargo,
	setor,
	cargoTreinamento,
	treinamentoColaborador,
} from "../../db/schema";
import { db } from "../../db";

// Utilitário para mapear tabelas por nome
const tableMap = {
	colaborador,
	treinamento,
	cargo,
	setor,
	cargoTreinamento,
	treinamentoColaborador,
};

export default async function syncRoutes(fastify: FastifyInstance) {
	// Endpoint para receber lote de alterações do cliente
	fastify.post("/sync/changes", async (request, reply) => {
		const { changes } = request.body as {
			changes: Array<{
				table: keyof typeof tableMap;
				operation: "create" | "update" | "delete";
				data: Record<string, unknown>;
				id?: string;
				clientId?: string;
			}>;
		};
		const results: (Record<string, unknown> | null)[] = [];
		for (const change of changes) {
			const table = tableMap[change.table];
			if (!table) continue;
			let result: Record<string, unknown>[] | null = null;
			if (change.operation === "create") {
				// Remove id se for clientId
				const { clientId, ...data } = change.data;
				result = await db
					.insert(table)
					.values({ ...data, updatedAt: new Date() })
					.returning();
			} else if (change.operation === "update") {
				result = await db
					.update(table)
					.set({ ...change.data, updatedAt: new Date() })
					.where(
						eq(
							table.id,
							change.id ??
								(() => {
									throw new Error("change.id is undefined");
								})(),
						),
					)
					.returning();
			} else if (change.operation === "delete") {
				result = await db
					.delete(table)
					.where(
						eq(
							table.id,
							change.id ??
								(() => {
									throw new Error("change.id is undefined");
								})(),
						),
					)
					.returning();
			}
			results.push(result?.[0] || null);
		}
		reply.send({ results });
	});

	// Endpoint para buscar registros modificados desde um timestamp
	fastify.get("/sync/updates", async (request, reply) => {
		const { since } = request.query as { since: string };
		const sinceDate = new Date(since);
		const updates: Record<string, Record<string, unknown>[]> = {};
		for (const [name, table] of Object.entries(tableMap)) {
			updates[name] = await db
				.select()
				.from(table)
				.where(gt(table.updatedAt, sinceDate));
		}
		reply.send({ updates });
	});
}
