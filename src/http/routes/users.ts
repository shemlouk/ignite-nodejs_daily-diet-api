import { DrizzleMealsRepository } from "@/repositories/drizzle/meals";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users";
import { FastifyInstance } from "fastify";
import { AuthenticateUserController } from "../controllers/authenticate-user";
import { ListMealsController } from "../controllers/list-meals";
import { RegisterUserController } from "../controllers/register-user";
import { authenticationMiddleware } from "../middlewares/authentication";

const drizzleUsersRepository = new DrizzleUsersRepository();
const drizzleMealsRepository = new DrizzleMealsRepository();

const registerUserController = new RegisterUserController(
  drizzleUsersRepository
);
const authenticateUserController = new AuthenticateUserController(
  drizzleUsersRepository
);
const listMealsController = new ListMealsController(
  drizzleMealsRepository,
  drizzleUsersRepository
);

export async function usersRoute(app: FastifyInstance) {
  app.post("/register", (req, rep) => registerUserController.execute(req, rep));
  app.post("/auth", (req, rep) => authenticateUserController.execute(req, rep));

  app.register(async (childApp) => {
    childApp.addHook("onRequest", authenticationMiddleware);

    childApp.get("/meals", (req, rep) => listMealsController.execute(req, rep));
  });
}
