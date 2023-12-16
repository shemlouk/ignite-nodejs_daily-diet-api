import { Meal } from "@/entities/meal";
import { User } from "@/entities/user";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users";
import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";
import { GetUserMetrics } from "./get-user-metrics";

let inMemoryUsersRepository: UsersRepository;
let inMemoryMealsRepository: MealsRepository;
let sut: GetUserMetrics;

describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new GetUserMetrics(inMemoryMealsRepository, inMemoryUsersRepository);
  });

  it("should get users metrics", async () => {
    const user = await inMemoryUsersRepository.create(
      new User({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      })
    );

    const date = new Date();

    for (let i = 0; i < 10; i++) {
      await inMemoryMealsRepository.create(
        new Meal({
          userId: new UniqueID(user.id),
          name: `meal-name-${i}`,
          description: "meal-description",
          timestamp: date,
          isOnDiet: i < 5,
        })
      );
    }

    const { metrics } = await sut.execute(user.id);

    expect(metrics).toMatchObject({
      id: expect.any(String),
      userId: user.id,
      totalMeals: 10,
      bestOnDietStreak: 5,
      totalMealsOnDiet: 5,
      totalMealsOffDiet: 5,
    });
  });

  it("should not get metrics from an user that does not exists", async () => {
    await expect(sut.execute("non-existent-user-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
