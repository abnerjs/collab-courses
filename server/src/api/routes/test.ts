import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db";
import { cargo, cargoTreinamento, treinamento } from "../../db/schema";
import { eq } from "drizzle-orm";

export const TestRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/test/", async (request, reply) => {
		const response = await db
			.select({
				cargo: cargo.descricao,
				treinamento: treinamento.nome,
			})
			.from(cargoTreinamento)
			.innerJoin(cargo, eq(cargo.id, cargoTreinamento.cargo))
			.innerJoin(treinamento, eq(treinamento.id, cargoTreinamento.treinamento));
		return reply.status(200).send(response);
	});
};
