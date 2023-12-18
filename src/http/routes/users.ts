import { DrizzleUsersRepository } from "@/repositories/drizzle/users";
import { FastifyInstance } from "fastify";
import { AuthenticateUserController } from "../controllers/authenticate-user";
import { RegisterUserController } from "../controllers/register-user";

const drizzleUsersRepository = new DrizzleUsersRepository();

const registerUserController = new RegisterUserController(
  drizzleUsersRepository
);

const authenticateUserController = new AuthenticateUserController(
  drizzleUsersRepository
);

export async function usersRoute(app: FastifyInstance) {
  app.post("/register", (req, rep) => registerUserController.execute(req, rep));

  app.post("/auth", (req, rep) =>
    authenticateUserController.execute(req, rep, app)
  );
}
