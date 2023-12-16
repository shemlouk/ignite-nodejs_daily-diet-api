import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { EditMeal } from "./edit-meal";
import { NotFoundError } from "./errors/not-found";

let inMemoryMealsRepository: MealsRepository;
let sut: EditMeal;

describe("Edit Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new EditMeal(inMemoryMealsRepository);
  });

  it("should edit a meal", async () => {
    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: new UniqueID(),
        name: "meal",
        description: "meal",
        timestamp: new Date(),
        isOnDiet: true,
      })
    );

    const { meal: updatedMeal } = await sut.execute(meal.id, {
      name: "new-meal-name",
      description: "new-meal-description",
    });

    expect(updatedMeal.id).toEqual(meal.id);
    expect(updatedMeal.name).toEqual("new-meal-name");
    expect(updatedMeal.description).toEqual("new-meal-description");
  });

  it("should not edit a meal if it does not exists", async () => {
    await expect(
      sut.execute("non-existent-meal-id", {
        name: "new-meal-name",
        description: "new-meal-description",
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
