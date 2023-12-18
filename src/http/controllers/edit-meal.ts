import { MealsRepository } from "@/repositories/meals";
import { EditMeal } from "@/use-cases/edit-meal";
import { InvalidFormatError } from "@/use-cases/errors/invalid-format";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

export class EditMealController {
  static paramsSchema = z.object({
    mealId: z.string(),
  });

  static bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    timestamp: z
      .string()
      .transform((timestamp) => new Date(timestamp))
      .optional(),
    isOnDiet: z.boolean().optional(),
  });

  private _editMeal: EditMeal;

  constructor(mealsRepository: MealsRepository) {
    this._editMeal = new EditMeal(mealsRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { mealId } = EditMealController.paramsSchema.parse(request.params);
      const data = EditMealController.bodySchema.parse(request.body);
      const { sub } = request.user;

      const { meal } = await this._editMeal.execute({
        userId: sub,
        mealId,
        ...data,
      });

      return reply.send(meal.toObject());
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InvalidFormatError(error.format());
      }

      throw error;
    }
  }
}
