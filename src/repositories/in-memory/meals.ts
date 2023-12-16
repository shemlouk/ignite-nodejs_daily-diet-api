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

  async findManyByUserId(userId: string) {
    return this.#meals.filter((meal) => meal.userId === userId);
  }

  async update(meal: Meal) {
    const index = this.#meals.findIndex((m) => m.id === meal.id);
    if (index > -1) {
      this.#meals.splice(index, 1);
      this.#meals.push(meal);
      return meal;
    }
  }

  async deleteById(mealId: string) {
    const index = this.#meals.findIndex((meal) => meal.id === mealId);
    if (index > -1) this.#meals.splice(index, 1);
  }
}
