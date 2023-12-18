import { db } from "@/lib/db";
import { createAndAuthenticateUser } from "@/lib/utils/tests/create-and-authenticate-user";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Create Meal Controller", () => {
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

  it("should create a meal", async () => {
    const { cookie } = await createAndAuthenticateUser();

    const date = new Date();

    const response = await request(app.server)
      .post("/meals")
      .set("Cookie", [cookie])
      .send({
        name: "meal-name",
        description: "meal-description",
        timestamp: date,
        isOnDiet: true,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      userId: expect.any(String),
      name: "meal-name",
      description: "meal-description",
      timestamp: date.toISOString(),
      isOnDiet: true,
    });
  });

  it("should not create a meal for an unauthorized user", async () => {
    await request(app.server)
      .post("/meals")
      .send({
        name: "meal-name",
        description: "meal-description",
        timestamp: new Date(),
        isOnDiet: true,
      })
      .expect(401);
  });
});
