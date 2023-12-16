import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";

type CreateMealInput = {
  userId: string;
  name: string;
  description: string;
  timestamp: Date;
  isOnDiet: boolean;
};

type CreateMealOutput = {
  meal: Meal;
};

export class CreateMeal {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    name,
    description,
    timestamp,
    isOnDiet,
  }: CreateMealInput): Promise<CreateMealOutput> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    const meal = await this.mealsRepository.create(
      new Meal({
        userId: new UniqueID(user.id),
        name,
        description,
        timestamp,
        isOnDiet,
      })
    );

    return { meal };
  }
}
