import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";

type FindMealOutput = {
  meal: {
    id: string;
    name: string;
    description: string;
    timestamp: Date;
    isOnDiet: boolean;
  };
};

export class FindMeal {
  constructor(private mealsRepository: MealsRepository) {}

  async execute(mealId: string): Promise<FindMealOutput> {
    const meal = await this.mealsRepository.findById(mealId);
    if (!meal) throw new NotFoundError("Meal");

    return { meal: meal.toObject() };
  }
}
