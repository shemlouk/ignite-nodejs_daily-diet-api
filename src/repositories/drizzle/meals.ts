import { Meal } from "@/entities/meal";
import { UniqueID } from "@/entities/value-objects/unique-id";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { meals } from "drizzle/schema";
import { MealsRepository } from "../meals";

type InsertMeal = typeof meals.$inferInsert;

export class DrizzleMealsRepository implements MealsRepository {
  async create(meal: Meal) {
    const newMeal: InsertMeal = meal.toObject();
    await db.insert(meals).values(newMeal);
    return meal;
  }

  async findById(mealId: string) {
    const [meal] = await db.select().from(meals).where(eq(meals.id, mealId));

    return (
      meal && new Meal({ ...meal, userId: new UniqueID(meal.userId) }, meal.id)
    );
  }

  async findManyByUserId(userId: string) {
    const mealsList = await db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId));

    return mealsList.map(
      (meal) =>
        new Meal({ ...meal, userId: new UniqueID(meal.userId) }, meal.id)
    );
  }

  async deleteById(mealId: string) {
    await db.delete(meals).where(eq(meals.id, mealId));
  }

  async update(meal: Meal) {
    const { name, description, timestamp, isOnDiet } = meal.toObject();

    await db
      .update(meals)
      .set({ name, description, timestamp, isOnDiet })
      .where(eq(meals.id, meal.id));

    return meal;
  }
}
