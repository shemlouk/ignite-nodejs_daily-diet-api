import { DrizzleMealsRepository } from "@/repositories/drizzle/meals";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users";
import { FastifyInstance } from "fastify";
import { CreateMealController } from "../controllers/create-meal";
import { EditMealController } from "../controllers/edit-meal";
import { authenticationMiddleware } from "../middlewares/authentication";

const drizzleUsersRepository = new DrizzleUsersRepository();
const drizzleMealsRepository = new DrizzleMealsRepository();

const createMealController = new CreateMealController(
  drizzleMealsRepository,
  drizzleUsersRepository
);

const editMealController = new EditMealController(drizzleMealsRepository);

export async function mealsRoute(app: FastifyInstance) {
  app.addHook("onRequest", authenticationMiddleware);

  app.post("/", (req, rep) => createMealController.execute(req, rep));
  app.put("/:mealId", (req, rep) => editMealController.execute(req, rep));
  app.delete("/:mealId", () => "Not implemented yet.");
  app.get("/:mealId", () => "Not implemented yet.");
}
