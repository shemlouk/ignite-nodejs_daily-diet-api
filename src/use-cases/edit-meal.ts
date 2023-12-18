import { Meal } from "@/entities/meal";
import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";

type EditMealInput = {
  userId: string;
  mealId: string;
  name?: string;
  description?: string;
  timestamp?: Date;
  isOnDiet?: boolean;
};

type EditMealOutput = {
  meal: Meal;
};

export class EditMeal {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
    mealId,
    ...data
  }: EditMealInput): Promise<EditMealOutput> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) throw new NotFoundError("Meal");
    if (meal.userId !== userId) throw new UnauthorizedError();

    for (const key in data) {
      const value = data[key as keyof typeof data] as never;
      meal[key as Exclude<keyof Meal, "id" | "userId">] = value;
    }

    await this.mealsRepository.update(meal);

    return { meal };
  }
}
