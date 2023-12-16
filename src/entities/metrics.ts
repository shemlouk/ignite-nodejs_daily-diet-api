import { Entity } from "./entity";
import { Meal } from "./meal";
import { UniqueID } from "./value-objects/unique-id";

interface MetricsProps {
  userId: UniqueID;
  meals: Meal[];
}

export class Metrics extends Entity {
  private _userId: UniqueID;

  readonly data: {
    totalMeals: number;
    bestOnDietStreak: number;
    totalMealsOnDiet: number;
    totalMealsOffDiet: number;
  };

  constructor({ userId, meals }: MetricsProps, id?: string) {
    super(id);
    this._userId = userId;

    const { mealsCount, bestStreak, onDietCount, offDietCount } =
      this.getMetrics(meals);

    this.data = {
      totalMeals: mealsCount,
      bestOnDietStreak: bestStreak,
      totalMealsOnDiet: onDietCount,
      totalMealsOffDiet: offDietCount,
    };
  }

  private getMetrics(meals: Meal[]) {
    const streaks: number[] = [];

    let mealsCount = 0;
    let streakCount = 0;
    let onDietCount = 0;
    let offDietCount = 0;

    meals.forEach((meal) => {
      mealsCount++;

      if (meal.isOnDiet) {
        onDietCount++;
        streakCount++;
      } else {
        offDietCount++;

        if (streakCount) {
          streaks.push(streakCount);
          streakCount = 0;
        }
      }
    });

    return {
      mealsCount,
      bestStreak: Math.max(...streaks, streakCount),
      onDietCount,
      offDietCount,
    };
  }

  toObject() {
    return Object.freeze({
      id: this.id,
      userId: this._userId.value,
      ...this.data,
    });
  }
}
