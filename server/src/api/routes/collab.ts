import type { FastifyReply } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
	createCollaborator,
	deleteCollaborator,
	getCollaborator,
	listCollaborators,
	updateCollaborator,
} from "../../services/collaborators-crud";
import { AppError } from "../../services/errors";
import { getCollaboratorsById } from "../../services/get-collaborators";

const collaboratorIdParamSchema = z.object({
	id: z.string().min(1, "Identificador é obrigatório"),
});

const createCollaboratorSchema = z.object({
	nome: z.string().min(1, "Nome é obrigatório"),
	cargoId: z.string().min(1, "Cargo é obrigatório"),
});

const updateCollaboratorSchema = createCollaboratorSchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Informe ao menos um campo para atualização",
	});

function handleError(reply: FastifyReply, error: unknown) {
	if (error instanceof AppError) {
		return reply
			.status(error.statusCode)
			.send({ success: false, error: error.message, details: error.details });
	}

	reply.log.error({ err: error }, "Erro inesperado na rota de colaboradores");
	return reply
		.status(500)
		.send({ success: false, error: "Erro interno no servidor" });
}

export const CollabRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/collaborators", async (_request, reply) => {
		try {
			const collaborators = await listCollaborators();
			return reply.status(200).send({ success: true, data: collaborators });
		} catch (error) {
			return handleError(reply, error);
		}
	});

	app.post(
		"/collaborators",
		{ schema: { body: createCollaboratorSchema } },
		async (request, reply) => {
			try {
				const body = createCollaboratorSchema.parse(request.body);
				const collaborator = await createCollaborator(body);

				return reply.status(201).send({
					success: true,
					message: "Colaborador criado com sucesso",
					data: collaborator,
				});
			} catch (error) {
				return handleError(reply, error);
			}
		},
	);

	app.put(
		"/collaborators/:id",
		{ schema: { body: updateCollaboratorSchema } },
		async (request, reply) => {
			try {
				const { id } = collaboratorIdParamSchema.parse(request.params);
				const body = updateCollaboratorSchema.parse(request.body);
				const collaborator = await updateCollaborator(id, body);

				return reply.status(200).send({
					success: true,
					message: "Colaborador atualizado com sucesso",
					data: collaborator,
				});
			} catch (error) {
				return handleError(reply, error);
			}
		},
	);

	app.delete("/collaborators/:id", async (request, reply) => {
		try {
			const { id } = collaboratorIdParamSchema.parse(request.params);
			await deleteCollaborator(id);

			return reply.status(200).send({
				success: true,
				message: "Colaborador removido com sucesso",
			});
		} catch (error) {
			return handleError(reply, error);
		}
	});

	app.get("/collaborators/:id", async (request, reply) => {
		try {
			const { id } = collaboratorIdParamSchema.parse(request.params);

			const collaboratorDetails = await getCollaboratorsById(id);
			const collaborator = await getCollaborator(id);

			const { noPrazo, vencendo, vencido, naoRealizado } = collaboratorDetails;

			return reply.status(200).send({
				success: true,
				data: {
					...collaborator,
					noPrazo,
					vencendo,
					vencido,
					naoRealizado,
				},
			});
		} catch (error) {
			return handleError(reply, error);
		}
	});
};
