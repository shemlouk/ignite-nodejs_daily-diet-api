import { Meal } from "../entities/meal";

export interface MealsRepository {
  create(meal: Meal): Promise<Meal>;
  findById(mealId: string): Promise<Meal | undefined>;
}
