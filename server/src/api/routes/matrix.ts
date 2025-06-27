import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getMatrixTrainings } from "../../services/get-matrix-trainings";
import { importMatrix } from "../../services/import-matrix";
// Certifique-se de registrar o plugin: app.register(require('@fastify/multipart'))

export const MatrixRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/matrix-trainings",
		{
			schema: z.object({
				response: z.object({
					treinamentos: z.array(
						z.object({
							id: z.string(),
							nome: z.string(),
						}),
					),
					cargos: z.array(
						z.object({
							id: z.string(),
							descricao: z.string(),
							treinamentos: z.array(
								z.object({
									id: z.string(),
								}),
							),
						}),
					),
				}),
			}),
		},
		async (_, reply) => {
			const [cargoMatrix, treinamentos] = await getMatrixTrainings();

			reply.status(200).send({
				treinamentos: treinamentos,
				cargos: cargoMatrix,
			});
		},
	);

	app.post("/import-matrix", async (request, reply) => {
		const data = await request.file?.();
		if (!data) {
			return reply.status(400).send({ error: "Arquivo não enviado" });
		}
		try {
			const buffer = await data.toBuffer();
			await importMatrix(buffer);
			return reply.status(200).send({ success: true });
		} catch (err) {
			return reply.status(400).send({
				error: err instanceof Error ? err.message : "Erro ao importar matriz",
			});
		}
	});
};
