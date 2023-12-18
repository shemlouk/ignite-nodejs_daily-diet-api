import { db } from "@/lib/db";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Register User Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await db.delete(meals);
    await db.delete(users);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create an user", async () => {
    await request(app.server)
      .post("/users/register")
      .send({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      })
      .expect(201);
  });

  it("should not create an user with an already in use email", async () => {
    await request(app.server).post("/users/register").send({
      name: "fulano",
      email: "fulano@example.com",
      password: "fulano-password",
    });

    await request(app.server)
      .post("/users/register")
      .send({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      })
      .expect(409);
  });
});
