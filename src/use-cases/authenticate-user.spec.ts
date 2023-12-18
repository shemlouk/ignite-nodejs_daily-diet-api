import { User } from "@/entities/user";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users";
import { UsersRepository } from "@/repositories/users";
import { AuthenticateUser } from "./authenticate-user";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";

let inMemoryUsersRepository: UsersRepository;
let sut: AuthenticateUser;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUser(inMemoryUsersRepository);
  });

  it("should authenticate an user", async () => {
    await inMemoryUsersRepository.create(
      new User({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      })
    );

    const { payload } = await sut.execute({
      email: "fulano@example.com",
      password: "fulano-password",
    });

    expect(payload).toMatchObject({ sub: expect.any(String) });
  });

  it("should not authenticate if password is incorrect", async () => {
    await inMemoryUsersRepository.create(
      new User({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      })
    );

    await expect(
      sut.execute({
        email: "fulano@example.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should not authenticate if user does not exists", async () => {
    await expect(
      sut.execute({
        email: "non-existent-fulano@example.com",
        password: "non-existent-fulano-password",
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
