import { fastify } from "fastify";
import { usersRoute } from "./routes/users";

const app = fastify();

app.register(usersRoute, { prefix: "users" });

export { app };
