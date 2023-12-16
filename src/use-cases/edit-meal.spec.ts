import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { EditMeal } from "./edit-meal";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";

let inMemoryMealsRepository: MealsRepository;
let sut: EditMeal;

describe("Edit Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new EditMeal(inMemoryMealsRepository);
  });

  it("should edit a meal", async () => {
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

    const { meal: updatedMeal } = await sut.execute({
      userId: userId.value,
      mealId: meal.id,
      name: "new-meal-name",
      description: "new-meal-description",
    });

    expect(updatedMeal.id).toEqual(meal.id);
    expect(updatedMeal.name).toEqual("new-meal-name");
    expect(updatedMeal.description).toEqual("new-meal-description");
  });

  it("should not edit a meal if it does not exists", async () => {
    await expect(
      sut.execute({
        userId: "some-user-id",
        mealId: "non-existent-meal-id",
        name: "new-meal-name",
        description: "new-meal-description",
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not edit a meal from another user", async () => {
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
      sut.execute({
        userId: "some-other-user-id",
        mealId: meal.id,
        name: "new-meal-name",
        description: "new-meal-description",
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
