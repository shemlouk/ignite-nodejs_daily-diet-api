import { User } from "@/entities/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "drizzle/schema";
import { UsersRepository } from "../users";

type InsertUser = typeof users.$inferInsert;

export class DrizzleUsersRepository implements UsersRepository {
  async create(user: User) {
    const newUser: InsertUser = user.toObject();
    await db.insert(users).values(newUser);
    return user;
  }

  async findById(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return (
      user && new User({ ...user, password: user.hashedPassword }, user.id)
    );
  }

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return (
      user && new User({ ...user, password: user.hashedPassword }, user.id)
    );
  }
}
