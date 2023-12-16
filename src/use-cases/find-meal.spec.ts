import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { NotFoundError } from "./errors/not-found";
import { FindMeal } from "./find-meal";

let inMemoryMealsRepository: MealsRepository;
let sut: FindMeal;

describe("Find Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new FindMeal(inMemoryMealsRepository);
  });

  it("should find a meal", async () => {
    const date = new Date();

    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: new UniqueID(),
        name: "meal-name",
        description: "meal-description",
        timestamp: date,
        isOnDiet: true,
      })
    );

    const { meal: foundMeal } = await sut.execute(meal.id);

    expect(foundMeal).toMatchObject({
      id: expect.any(String),
      name: "meal-name",
      description: "meal-description",
      timestamp: date,
      isOnDiet: true,
    });
  });

  it("should not find a meal that does not exists", async () => {
    await expect(sut.execute("non-existent-meal-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
