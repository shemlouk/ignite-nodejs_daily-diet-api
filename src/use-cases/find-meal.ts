import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";

type FindMealInput = {
  userId: string;
  mealId: string;
};

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

  async execute({ userId, mealId }: FindMealInput): Promise<FindMealOutput> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) throw new NotFoundError("Meal");
    if (meal.userId !== userId) throw new UnauthorizedError();

    return { meal: meal.toObject() };
  }
}
