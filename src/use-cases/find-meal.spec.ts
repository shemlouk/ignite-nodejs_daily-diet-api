import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";
import { FindMeal } from "./find-meal";

let inMemoryMealsRepository: MealsRepository;
let sut: FindMeal;

describe("Find Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new FindMeal(inMemoryMealsRepository);
  });

  it("should find a meal", async () => {
    const userId = new UniqueID();
    const date = new Date();

    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: userId,
        name: "meal-name",
        description: "meal-description",
        timestamp: date,
        isOnDiet: true,
      })
    );

    const { meal: foundMeal } = await sut.execute({
      userId: userId.value,
      mealId: meal.id,
    });

    expect(foundMeal).toMatchObject({
      id: expect.any(String),
      name: "meal-name",
      description: "meal-description",
      timestamp: date,
      isOnDiet: true,
    });
  });

  it("should not find a meal that does not exists", async () => {
    await expect(
      sut.execute({ userId: "some-user-id", mealId: "non-existent-meal-id" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not return a meal to a user that did not created it", async () => {
    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: new UniqueID(),
        name: "meal-name",
        description: "meal-description",
        timestamp: new Date(),
        isOnDiet: true,
      })
    );

    await expect(
      sut.execute({ userId: "some-other-user-id", mealId: meal.id })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
