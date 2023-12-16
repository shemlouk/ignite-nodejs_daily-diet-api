import { Meal } from "@/entities/meal";
import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";

type EditMealInput = Partial<{
  name: string;
  description: string;
  timestamp: Date;
  isOnDiet: boolean;
}>;

type EditMealOutput = {
  meal: Meal;
};

export class EditMeal {
  constructor(private mealsRepository: MealsRepository) {}

  async execute(mealId: string, data: EditMealInput): Promise<EditMealOutput> {
    const meal = await this.mealsRepository.findById(mealId);
    if (!meal) throw new NotFoundError("Meal");

    for (const key in data) {
      const value = data[key as keyof typeof data] as never;
      if (value) meal[key as Exclude<keyof Meal, "id" | "userId">] = value;
    }

    await this.mealsRepository.update(meal);

    return { meal };
  }
}
