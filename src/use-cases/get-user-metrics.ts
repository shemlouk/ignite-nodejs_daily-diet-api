import { Metrics } from "@/entities/metrics";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";

type GetUserMetricsOutput = {
  metrics: {
    id: string;
    userId: string;
    totalMeals: number;
    bestOnDietStreak: number;
    totalMealsOnDiet: number;
    totalMealsOffDiet: number;
  };
};

export class GetUserMetrics {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(userId: string): Promise<GetUserMetricsOutput> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    const meals = await this.mealsRepository.findManyByUserId(user.id);
    const metrics = new Metrics({ userId: new UniqueID(user.id), meals });

    return { metrics: metrics.toObject() };
  }
}
