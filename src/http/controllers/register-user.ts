import { UsersRepository } from "@/repositories/users";
import { InvalidFormatError } from "@/use-cases/errors/invalid-format";
import { RegisterUser } from "@/use-cases/register-user";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

export class RegisterUserController {
  static bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6).max(16),
  });

  private _registerUser: RegisterUser;

  constructor(usersRepository: UsersRepository) {
    this._registerUser = new RegisterUser(usersRepository);
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = RegisterUserController.bodySchema.parse(request.body);

      const { user } = await this._registerUser.execute(data);
      const { hashedPassword, ...payload } = user.toObject();

      return reply.status(201).send(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InvalidFormatError(error.format());
      }

      throw error;
    }
  }
}
