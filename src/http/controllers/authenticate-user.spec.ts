import { User } from "@/entities/user";
import { db } from "@/lib/db";
import { users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should authenticate user", async () => {
    await db.insert(users).values(
      new User({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      }).toObject()
    );

    const response = await request(app.server).post("/users/auth").send({
      email: "fulano@example.com",
      password: "fulano-password",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
  });

  it("should not authenticate user if password is incorrect", async () => {
    await db.insert(users).values(
      new User({
        name: "fulano",
        email: "fulano@example.com",
        password: "fulano-password",
      }).toObject()
    );

    await request(app.server)
      .post("/users/auth")
      .send({
        email: "fulano@example.com",
        password: "wrong-password",
      })
      .expect(401);
  });
});
