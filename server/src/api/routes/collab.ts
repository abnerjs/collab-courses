import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getCollaboratorsById } from "../../services/get-collaborators";

export const CollabRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/collaborators/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const { collaborator, noPrazo, vencendo, vencido, naoRealizado } =
			await getCollaboratorsById(id);

		if (!collaborator) {
			return reply.status(404).send({ error: "Collaborator not found" });
		}
		if (!noPrazo || !vencendo || !vencido || !naoRealizado) {
			return reply.status(500).send({ error: "Error fetching trainings" });
		}

		return reply.status(200).send({
			id: (await collaborator).id,
			nome: (await collaborator).nome,
			cargo: (await collaborator).cargo,
			setor: (await collaborator).setor,
			noPrazo: noPrazo,
			vencendo: vencendo,
			vencido: vencido,
			naoRealizado: naoRealizado,
		});
	});
};
