import * as pgCore from "drizzle-orm/pg-core";

const { boolean, pgTable, text, timestamp, uuid, varchar } = pgCore;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 92 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 72 }).notNull(),
});

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 92 }).notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: false }).notNull(),
  isOnDiet: boolean("is_on_diet").notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});
