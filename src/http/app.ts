import { envs } from "@/lib/envs";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import { mealsRoute } from "./routes/meals";
import { usersRoute } from "./routes/users";

const app = fastify();

app
  .register(fastifyJwt, {
    secret: envs.JWT_SECRET,
    cookie: { cookieName: "token", signed: false },
  })
  .register(fastifyCookie)
  .register(usersRoute, { prefix: "users" })
  .register(mealsRoute, { prefix: "meals" });

export { app };
