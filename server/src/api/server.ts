import fastifyCors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { CollabRoute } from "./routes/collab";
import { CollabSummaryRoute } from "./routes/collab-summary";
import { MatrixRoute } from "./routes/matrix";
import { SectorsRoute } from "./routes/sectors";
import { TestRoute } from "./routes/test";
import { TrainingsRoute } from "./routes/trainings";

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
app.register(SectorsRoute);
app.register(MatrixRoute);
app.register(TestRoute);

app
	.listen({
		port: 3000,
		host: "0.0.0.0",
	})
	.then(() => {
		console.log("HTTP server running!");
	});
