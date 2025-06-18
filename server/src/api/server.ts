import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { getCollabSummaryRoute } from "./routes/get-collab-summary";
import { getTrainingsRoute } from "./routes/get-trainings";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getCollabSummaryRoute);
app.register(getTrainingsRoute);

app
	.listen({
		port: 3000,
	})
	.then(() => {
		console.log("HTTP server running!");
	});
