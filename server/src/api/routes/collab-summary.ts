import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getCollaborators } from "../../services/get-collaborators";

export const CollabSummaryRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/",
		{
			schema: {
				summary: "Get Collaborators",
				tags: ["Collaborators"],
				headers: z.object({
					"x-cargos": z.string().optional(),
					"x-setores": z.string().optional(),
					"x-statuses": z.string().optional(),
				}),
				querystring: z.object({
					nome: z.string().optional(),
				}),
				response: {
					200: z.object({
						data: z.array(
							z.object({
								id: z.string(),
								nomeColaborador: z.string(),
								cargo: z.string(),
								setor: z.string(),
								noPrazo: z.coerce.number(),
								vencido: z.coerce.number(),
								vencendo: z.coerce.number(),
								naoRealizado: z.coerce.number(),
							}),
						),
						meta: z.object({
							total: z.number().default(0),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { nome } = request.query as { nome?: string };
			const cargosHeader = request.headers["x-cargos"];
			const setoresHeader = request.headers["x-setores"];
			const statusesHeader = request.headers["x-statuses"];
			const statuses =
				typeof statusesHeader === "string"
					? statusesHeader.split(",")
					: Array.isArray(statusesHeader)
						? statusesHeader
						: undefined;
			if (
				statuses &&
				statuses.length > 0 &&
				!["no_prazo", "vencido", "vencendo", "nao_realizado"].every((s) =>
					statuses.includes(s),
				)
			) {
				return reply.status(400).send({
					error:
						"Invalid status filter. Allowed values are: no_prazo, vencido, vencendo, nao_realizado.",
				});
			}
			const cargos =
				typeof cargosHeader === "string"
					? cargosHeader.split(",")
					: Array.isArray(cargosHeader)
						? cargosHeader
						: [];

			const setores =
				typeof setoresHeader === "string"
					? setoresHeader.split(",")
					: Array.isArray(setoresHeader)
						? setoresHeader
						: [];

			const result = await getCollaborators({
				nome,
				setorIds: setores,
				cargoIds: cargos,
				statuses: statuses,
			});
			return reply.status(200).send(result);
		},
	);
};
