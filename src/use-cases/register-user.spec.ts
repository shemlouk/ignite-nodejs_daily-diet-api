import { InMemoryUsersRepository } from "@/repositories/in-memory/users";
import { UsersRepository } from "@/repositories/users";
import { ConflictError } from "./errors/conflict";
import { RegisterUser } from "./register-user";

let inMemoryUsersRepository: UsersRepository;
let sut: RegisterUser;

describe("Register User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUser(inMemoryUsersRepository);
  });

  it("should register a user", async () => {
    const { user } = await sut.execute({
      name: "fulano",
      email: "fulano@example.com",
      password: "fulano-password",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash password upon registration", async () => {
    const { user } = await sut.execute({
      name: "fulano",
      email: "fulano@example.com",
      password: "fulano-password",
    });

    expect(user.comparePassword("fulano-password")).toBeTruthy();
    expect(user.comparePassword("sicrano-password")).toBeFalsy();
  });

  it("should not register with same email twice", async () => {
    const data = {
      name: "fulano",
      email: "fulano@example.com",
      password: "fulano-password",
    };

    await sut.execute(data);

    await expect(sut.execute(data)).rejects.toBeInstanceOf(ConflictError);
  });
});
