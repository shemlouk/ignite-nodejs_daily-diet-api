import { envs } from "@/lib/envs";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import { usersRoute } from "./routes/users";

const app = fastify();

app.register(fastifyJwt, {
  secret: envs.JWT_SECRET,
});

app.register(usersRoute, { prefix: "users" });

export { app };
