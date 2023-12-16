import { Meal } from "@/entities/meal";
import { MealsRepository } from "../meals";

export class InMemoryMealsRepository implements MealsRepository {
  #meals: Meal[] = [];

  async create(meal: Meal) {
    this.#meals.push(meal);
    return meal;
  }

  async findById(mealId: string) {
    return this.#meals.find((meal) => meal.id === mealId);
  }
}
