import { MealsRepository } from "@/repositories/meals";
import { UnauthorizedError } from "./errors/unauthorized";

type DeleteMealInput = {
  userId: string;
  mealId: string;
};

export class DeleteMeal {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({ userId, mealId }: DeleteMealInput) {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) return;
    if (meal.userId !== userId) throw new UnauthorizedError();

    await this.mealsRepository.deleteById(mealId);
  }
}
