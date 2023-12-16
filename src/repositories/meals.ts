import { Meal } from "../entities/meal";

export interface MealsRepository {
  create(meal: Meal): Promise<Meal>;
  update(meal: Meal): Promise<Meal | undefined>;
  findById(mealId: string): Promise<Meal | undefined>;
  findManyByUserId(userId: string): Promise<Meal[]>;
  deleteById(mealId: string): Promise<void>;
}
