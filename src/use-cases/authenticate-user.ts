import { UsersRepository } from "@/repositories/users";
import { NotFoundError } from "./errors/not-found";
import { UnauthorizedError } from "./errors/unauthorized";

type AuthenticateUserInput = {
  email: string;
  password: string;
};

type AuthenticateUserOutput = {
  payload: {
    sub: string;
  };
};

export class AuthenticateUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User");

    const isAuthenticated = user.comparePassword(password);
    if (!isAuthenticated) throw new UnauthorizedError();

    return {
      payload: { sub: user.id },
    };
  }
}
