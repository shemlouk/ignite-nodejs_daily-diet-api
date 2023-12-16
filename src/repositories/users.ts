import { User } from "../entities/user";

export interface UsersRepository {
  create(user: User): Promise<User>;
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
}
