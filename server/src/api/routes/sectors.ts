import type { FastifyReply } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { AppError } from "../../services/errors";
import {
	listPositions,
	listPositionsBySector,
	listSectors,
} from "../../services/sectors";

const sectorIdParamSchema = z.object({
	sectorId: z.string().min(1, "Identificador é obrigatório"),
});

function handleError(reply: FastifyReply, error: unknown) {
	if (error instanceof AppError) {
		return reply
			.status(error.statusCode)
			.send({ success: false, error: error.message, details: error.details });
	}

	reply.log.error({ err: error }, "Erro inesperado na rota de setores");
	return reply
		.status(500)
		.send({ success: false, error: "Erro interno no servidor" });
}

export const SectorsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/sectors", async (_request, reply) => {
		try {
			const sectors = await listSectors();
			return reply.status(200).send({ success: true, data: sectors });
		} catch (error) {
			return handleError(reply, error);
		}
	});

	app.get("/sectors/:sectorId/positions", async (request, reply) => {
		try {
			const { sectorId } = sectorIdParamSchema.parse(request.params);
			const positions = await listPositionsBySector(sectorId);

			return reply.status(200).send({ success: true, data: positions });
		} catch (error) {
			return handleError(reply, error);
		}
	});

	app.get("/positions", async (_request, reply) => {
		try {
			const positions = await listPositions();
			return reply.status(200).send({ success: true, data: positions });
		} catch (error) {
			return handleError(reply, error);
		}
	});
};
