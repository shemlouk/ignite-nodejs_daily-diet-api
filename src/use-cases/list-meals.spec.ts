import { Meal } from "@/entities/meal";
import { User } from "@/entities/user";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users";
import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";
import { ListMeals } from "./list-meals";

let inMemoryUsersRepository: UsersRepository;
let inMemoryMealsRepository: MealsRepository;
let sut: ListMeals;

describe("List Meals Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new ListMeals(inMemoryMealsRepository, inMemoryUsersRepository);

    vi.useFakeTimers();
  });

  it("should list the meals of an user", async () => {
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
          isOnDiet: true,
        })
      );
    }

    const { meals } = await sut.execute(user.id);

    expect(meals).toHaveLength(10);

    expect(meals[0]).toMatchObject({
      name: "meal-name-0",
      description: "meal-description",
      timestamp: date,
      isOnDiet: true,
    });

    expect(meals[9]).toMatchObject({
      name: "meal-name-9",
      description: "meal-description",
      timestamp: date,
      isOnDiet: true,
    });
  });

  it("should not list the meals of an user that does not exists", async () => {
    await expect(sut.execute("non-existent-user-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
