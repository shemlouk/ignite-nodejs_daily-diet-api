import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { CreateMeal } from "@/use-cases/create-meal";
import { InvalidFormatError } from "@/use-cases/errors/invalid-format";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

export class CreateMealController {
  static bodySchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    timestamp: z.string().transform((timestamp) => new Date(timestamp)),
    isOnDiet: z.boolean(),
  });

  private _createMeal: CreateMeal;

  constructor(
    mealsRepository: MealsRepository,
    usersRepository: UsersRepository
  ) {
    this._createMeal = new CreateMeal(mealsRepository, usersRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = CreateMealController.bodySchema.parse(request.body);
      const { sub } = request.user;

      const { meal } = await this._createMeal.execute({ userId: sub, ...data });

      reply.status(201).send(meal.toObject());
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InvalidFormatError(error.format());
      }

      throw error;
    }
  }
}
