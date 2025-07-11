import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getMatrixTrainings } from "../../services/get-matrix-trainings";
import { changeTraining } from "../../services/change-trainings";
import { createTraining } from "../../services/create-trainings";
import { deleteTrainings } from "../../services/delete-trainings";
import { getTrainingById, getTrainings } from "../../services/get-trainings";

export const TrainingsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/trainings",
		{
			schema: z.object({
				querystring: z.object({
					descricao: z.string().optional(),
				}),
				response: z.object({
					treinamentos: z.array(
						z.object({
							id: z.string(),
							nome: z.string(),
							validade: z.number(),
							noPrazo: z.number(),
							vencendo: z.number(),
							vencido: z.number(),
							naoRealizado: z.number(),
						}),
					),
				}),
			}),
		},
		async (request, reply) => {
			const { descricao } = request.query as { descricao?: string };

			const response = await getTrainings({ descricao });

			reply.status(200).send({
				data: response,
			});
		},
	);

	app.get("/trainings/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const { treinamento, noPrazo, vencendo, vencido, naoRealizado } =
			await getTrainingById(id);

		if (!treinamento) {
			return reply.status(404).send({ error: "Training not found" });
		}
		if (!noPrazo || !vencendo || !vencido || !naoRealizado) {
			return reply.status(500).send({ error: "Error fetching collabs" });
		}

		return reply.status(200).send({
			id: (await treinamento).id,
			nome: (await treinamento).nome,
			validade: (await treinamento).validade,
			noPrazo: noPrazo,
			vencendo: vencendo,
			vencido: vencido,
			naoRealizado: naoRealizado,
		});
	});

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
				success: true,
			});

			reply.status(400).send({
				success: false,
			});
		},
	);

	app.post(
		"/trainings/create",
		{
			schema: z.object({
				body: z.object({
					treinamentoId: z.string(),
					colaboradorId: z.string(),
					realizacao: z.string().datetime(),
				}),
			}),
		},
		async (request, reply) => {
			const { treinamentoId, colaboradorId, realizacao } = request.body as {
				treinamentoId: string;
				colaboradorId: string;
				realizacao: string;
			};

			try {
				await createTraining(treinamentoId, colaboradorId, realizacao);

				return reply.status(200).send({
					success: true,
				});
			} catch (error) {
				reply.status(500).send({
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Erro ao criar treinamento",
				});
			}
		},
	);

	app.delete(
		"/trainings/delete",
		{
			schema: z.object({
				body: z.object({
					colaboradorId: z.string(),
					treinamentoId: z.string(),
					lastValue: z.boolean().optional().default(false),
				}),
			}),
		},
		async (request, reply) => {
			const { colaboradorId, treinamentoId, lastValue } = request.body as {
				colaboradorId: string;
				treinamentoId: string;
				lastValue?: boolean;
			};

			const result = await deleteTrainings({
				colaboradorId,
				treinamentoId,
				lastValue: lastValue ?? false,
			});

			if (result.length === 0)
				return reply
					.status(404)
					.send({ success: false, error: "Registro não encontrado" });

			reply.status(200).send({
				success: true,
			});
		},
	);
};
