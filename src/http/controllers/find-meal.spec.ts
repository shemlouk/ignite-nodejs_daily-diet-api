import { db } from "@/lib/db";
import { createAndAuthenticateUser } from "@/lib/utils/tests/create-and-authenticate-user";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Find Meal Controller", () => {
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

  it("should find a meal", async () => {
    const { cookie } = await createAndAuthenticateUser();

    const date = new Date();

    const {
      body: { id: mealId },
    } = await request(app.server).post("/meals").set("Cookie", [cookie]).send({
      name: "meal-name",
      description: "meal-description",
      timestamp: date,
      isOnDiet: true,
    });

    const response = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", [cookie])
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      meal: {
        id: expect.any(String),
        userId: expect.any(String),
        name: "meal-name",
        description: "meal-description",
        timestamp: expect.any(String),
        isOnDiet: true,
      },
    });
  });

  it("should not find another users meal", async () => {
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
      .get(`/meals/${mealId}`)
      .set("Cookie", ["token=another-user-token"])
      .send()
      .expect(401);
  });
});
