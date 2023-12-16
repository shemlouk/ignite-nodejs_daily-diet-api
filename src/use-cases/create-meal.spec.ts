import { User } from "@/entities/user";
import { InMemoryMealsRepository } from "@/repositories/in-memory/meals";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users";
import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { CreateMeal } from "./create-meal";
import { NotFoundError } from "./errors/not-found";

let inMemoryUsersRepository: UsersRepository;
let inMemoryMealsRepository: MealsRepository;
let sut: CreateMeal;

describe("Create Meal Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new CreateMeal(inMemoryMealsRepository, inMemoryUsersRepository);
  });

  it("should create a meal", async () => {
    const user = new User({
      name: "fulano",
      email: "fulano@example.com",
      password: "fulano-password",
    });

    await inMemoryUsersRepository.create(user);

    const { meal } = await sut.execute({
      userId: user.id,
      name: "meal",
      description: "meal",
      timestamp: new Date(),
      isOnDiet: true,
    });

    expect(meal.id).toEqual(expect.any(String));
  });

  it("should not create a meal if user does not exists", async () => {
    await expect(
      sut.execute({
        userId: "non-existent-user",
        name: "meal",
        description: "meal",
        timestamp: new Date(),
        isOnDiet: true,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
