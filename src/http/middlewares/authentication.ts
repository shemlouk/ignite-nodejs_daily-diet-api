import { UnauthorizedError } from "@/use-cases/errors/unauthorized";
import { FastifyRequest } from "fastify";

export async function authenticationMiddleware(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError();
  }
}
