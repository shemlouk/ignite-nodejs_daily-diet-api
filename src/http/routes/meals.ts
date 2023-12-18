import { DrizzleMealsRepository } from "@/repositories/drizzle/meals";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users";
import { FastifyInstance } from "fastify";
import { CreateMealController } from "../controllers/create-meal";
import { DeleteMealController } from "../controllers/delete-meal";
import { EditMealController } from "../controllers/edit-meal";
import { authenticationMiddleware } from "../middlewares/authentication";

const drizzleUsersRepository = new DrizzleUsersRepository();
const drizzleMealsRepository = new DrizzleMealsRepository();

const createMealController = new CreateMealController(
  drizzleMealsRepository,
  drizzleUsersRepository
);

const editMealController = new EditMealController(drizzleMealsRepository);
const deleteMealController = new DeleteMealController(drizzleMealsRepository);

export async function mealsRoute(app: FastifyInstance) {
  app.addHook("onRequest", authenticationMiddleware);

  app.post("/", (req, rep) => createMealController.execute(req, rep));
  app.put("/:mealId", (req, rep) => editMealController.execute(req, rep));
  app.delete("/:mealId", (req, rep) => deleteMealController.execute(req, rep));
  app.get("/:mealId", () => "Not implemented yet.");
}
