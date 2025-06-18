import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getTrainings } from "../../services/get-trainings";
import { changeTraining } from "../../services/change-trainings";

export const TrainingsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/trainings",
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
			const [cargoMatrix, treinamentos] = await getTrainings();

			reply.status(200).send({
				treinamentos: treinamentos,
				cargos: cargoMatrix,
			});
		},
	);

	app.post(
		"/trainings/change",
		{
			schema: z.object({
				body: z.object({
					treinamentoId: z.string(),
					cargoId: z.string(),
					status: z.boolean(),
				}),
			}),
		},
		async (request, reply) => {
			const { treinamentoId, cargoId, status } = request.body as {
				treinamentoId: string;
				cargoId: string;
				status: boolean;
			};

			await changeTraining(treinamentoId, cargoId, status);

			reply.status(200).send({
				message: "Treinamento atualizado com sucesso",
			});

			reply.status(400).send({
				message: "Erro ao atualizar treinamento",
			});
		},
	);
};
