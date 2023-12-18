import { UsersRepository } from "@/repositories/users";
import { AuthenticateUser } from "@/use-cases/authenticate-user";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class AuthenticateUserController {
  static bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(16),
  });

  private _authenticateUser: AuthenticateUser;

  constructor(usersRepository: UsersRepository) {
    this._authenticateUser = new AuthenticateUser(usersRepository);
  }

  async execute(
    request: FastifyRequest,
    reply: FastifyReply,
    app: FastifyInstance
  ) {
    const data = AuthenticateUserController.bodySchema.parse(request.body);

    const { payload } = await this._authenticateUser.execute(data);
    const token = app.jwt.sign({ payload });

    reply.send({ token });
  }
}
