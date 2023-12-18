import { app } from "@/http/app";
import request from "supertest";

export async function createAndAuthenticateUser() {
  await request(app.server).post("/users/register").send({
    name: "fulano",
    email: "fulano@example.com",
    password: "fulano-password",
  });

  const response = await request(app.server).post("/users/auth").send({
    email: "fulano@example.com",
    password: "fulano-password",
  });

  return { cookie: response.headers["set-cookie"][0] };
}
