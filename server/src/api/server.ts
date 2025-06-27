import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { CollabSummaryRoute } from "./routes/collab-summary";
import { TrainingsRoute } from "./routes/trainings";
import { TestRoute } from "./routes/test";
import { CollabRoute } from "./routes/collab";
import { MatrixRoute } from "./routes/matrix";
import multipart from "@fastify/multipart";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(multipart);
app.register(CollabRoute);
app.register(CollabSummaryRoute);
app.register(TrainingsRoute);
app.register(MatrixRoute);
app.register(TestRoute);

app
	.listen({
		port: 3000,
	})
	.then(() => {
		console.log("HTTP server running!");
	});
