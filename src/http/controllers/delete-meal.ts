import { MealsRepository } from "@/repositories/meals";
import { DeleteMeal } from "@/use-cases/delete-meal";
import { InvalidFormatError } from "@/use-cases/errors/invalid-format";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

export class DeleteMealController {
  static paramsSchema = z.object({
    mealId: z.string(),
  });

  private _deleteMeal: DeleteMeal;

  constructor(mealsRepository: MealsRepository) {
    this._deleteMeal = new DeleteMeal(mealsRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { mealId } = DeleteMealController.paramsSchema.parse(
        request.params
      );

      const { sub } = request.user;

      await this._deleteMeal.execute({ userId: sub, mealId });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InvalidFormatError(error.format());
      }

      throw error;
    }
  }
}
