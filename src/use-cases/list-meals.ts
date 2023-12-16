import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";

type ListMealsOutput = {
  meals: {
    id: string;
    name: string;
    description: string;
    timestamp: Date;
    isOnDiet: boolean;
  }[];
};

export class ListMeals {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(userId: string): Promise<ListMealsOutput> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    const meals = await this.mealsRepository.findManyByUserId(user.id);

    return { meals: meals.map((meal) => meal.toObject()) };
  }
}
