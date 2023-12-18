import { MealsRepository } from "@/repositories/meals";
import { InvalidFormatError } from "@/use-cases/errors/invalid-format";
import { FindMeal } from "@/use-cases/find-meal";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

export class FindMealController {
  static paramsSchema = z.object({
    mealId: z.string(),
  });

  private _findMeal: FindMeal;

  constructor(mealsRepository: MealsRepository) {
    this._findMeal = new FindMeal(mealsRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { mealId } = FindMealController.paramsSchema.parse(request.params);
      const { sub } = request.user;

      const { meal } = await this._findMeal.execute({ userId: sub, mealId });

      return reply.send({ meal });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InvalidFormatError(error.format());
      }

      throw error;
    }
  }
}
