import { db } from "@/lib/db";
import { createAndAuthenticateUser } from "@/lib/utils/tests/create-and-authenticate-user";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Edit Meal Controller", () => {
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

  it("should edit a meal", async () => {
    const { cookie } = await createAndAuthenticateUser();

    const {
      body: { id: mealId },
    } = await request(app.server).post("/meals").set("Cookie", [cookie]).send({
      name: "meal-name",
      description: "meal-description",
      timestamp: new Date(),
      isOnDiet: true,
    });

    const newDate = new Date();

    const response = await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", [cookie])
      .send({
        name: "new-meal-name",
        description: "new-meal-description",
        timestamp: newDate,
        isOnDiet: false,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      id: mealId,
      userId: expect.any(String),
      name: "new-meal-name",
      description: "new-meal-description",
      timestamp: newDate.toISOString(),
      isOnDiet: false,
    });
  });

  it("should not edit a meal from another user", async () => {
    const { cookie } = await createAndAuthenticateUser();

    const {
      body: { id: mealId },
    } = await request(app.server).post("/meals").set("Cookie", [cookie]).send({
      name: "meal-name",
      description: "meal-description",
      timestamp: new Date(),
      isOnDiet: true,
    });

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", ["token=another-user-token"])
      .send({
        name: "new-meal-name",
        description: "new-meal-description",
        timestamp: new Date(),
        isOnDiet: false,
      })
      .expect(401);
  });
});
