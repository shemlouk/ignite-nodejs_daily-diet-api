import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { ListMeals } from "@/use-cases/list-meals";
import { FastifyReply, FastifyRequest } from "fastify";

export class ListMealsController {
  private _listMeals: ListMeals;

  constructor(
    mealsRepository: MealsRepository,
    usersRepository: UsersRepository
  ) {
    this._listMeals = new ListMeals(mealsRepository, usersRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user;
    const { meals } = await this._listMeals.execute(sub);
    return reply.send({ meals });
  }
}
