import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { MealsRepository } from "@/repositories/meals";
import { DeleteMeal } from "./delete-meal";

let inMemoryMealsRepository: MealsRepository;
let sut: DeleteMeal;

describe("Delete Meal Use Case", () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new DeleteMeal(inMemoryMealsRepository);
  });

  it("should delete a meal", async () => {
    const meal = await inMemoryMealsRepository.create(
      new Meal({
        userId: new UniqueID(),
        name: "meal",
        description: "meal",
        timestamp: new Date(),
        isOnDiet: true,
      })
    );

    await sut.execute(meal.id);

    await expect(inMemoryMealsRepository.findById(meal.id)).resolves.toEqual(
      undefined
    );
  });
});
