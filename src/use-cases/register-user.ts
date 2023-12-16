import { User } from "../entities/user";
import { UsersRepository } from "../repositories/users";
import { ConflictError } from "./errors/conflict";

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

type RegisterUserOutput = {
  user: User;
};

export class RegisterUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserInput): Promise<RegisterUserOutput> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);
    if (emailAlreadyInUse) throw new ConflictError("Email");

    const user = new User({ name, email, password });
    await this.usersRepository.create(user);

    return { user };
  }
}
