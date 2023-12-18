import { MealsRepository } from "@/repositories/meals";
import { UsersRepository } from "@/repositories/users";
import { GetUserMetrics } from "@/use-cases/get-user-metrics";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetUserMetricsController {
  private _getUserMetrics: GetUserMetrics;

  constructor(
    mealsRepository: MealsRepository,
    usersRepository: UsersRepository
  ) {
    this._getUserMetrics = new GetUserMetrics(mealsRepository, usersRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user;
    const { metrics } = await this._getUserMetrics.execute(sub);
    return reply.send({ metrics });
  }
}
