import { User } from "../../entities/user";
import { UsersRepository } from "../users";

export class InMemoryUsersRepository implements UsersRepository {
  #users: User[] = [];

  async create(user: User) {
    this.#users.push(user);
    return user;
  }

  async findById(userId: string) {
    return this.#users.find((user) => user.id === userId);
  }

  async findByEmail(email: string) {
    return this.#users.find((user) => user.email === email);
  }
}
