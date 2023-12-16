import { MealsRepository } from "@/repositories/meals";

export class DeleteMeal {
  constructor(private mealsRepository: MealsRepository) {}

  async execute(mealId: string) {
    await this.mealsRepository.deleteById(mealId);
  }
}
