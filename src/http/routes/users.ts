import { DrizzleUsersRepository } from "@/repositories/drizzle/users";
import { FastifyInstance } from "fastify";
import { RegisterUserController } from "../controllers/register-user";

const drizzleUsersRepository = new DrizzleUsersRepository();

const registerUserController = new RegisterUserController(
  drizzleUsersRepository
);

export async function usersRoute(app: FastifyInstance) {
  app.post("/register", (req, rep) => registerUserController.execute(req, rep));
}
