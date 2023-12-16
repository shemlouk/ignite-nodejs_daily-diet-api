import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { DeleteMeal } from "./delete-meal";
import { UnauthorizedError } from "./errors/unauthorized";

let inMemoryMealsRepository: MealsRepository;
let sut: DeleteMeal;

describe("Delete Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new DeleteMeal(inMemoryMealsRepository);
  });

  it("should delete a meal", async () => {
    const userId = new UniqueID();

    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId,
        name: "meal",
        description: "meal",
        timestamp: new Date(),
        isOnDiet: true,
      })
    );

    await sut.execute({ userId: userId.value, mealId: meal.id });

    await expect(inMemoryMealsRepository.findById(meal.id)).resolves.toEqual(
      undefined
    );
  });

  it("should not delete a meal from another user", async () => {
    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: new UniqueID(),
        name: "meal",
        description: "meal",
        timestamp: new Date(),
        isOnDiet: true,
      })
    );

    await expect(
      sut.execute({ userId: "another-user-id", mealId: meal.id })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
