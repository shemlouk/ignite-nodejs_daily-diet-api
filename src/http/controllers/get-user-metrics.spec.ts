import { db } from "@/lib/db";
import { createAndAuthenticateUser } from "@/lib/utils/tests/create-and-authenticate-user";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Get User Metrics Controller", () => {
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

  it("should get user metrics", async () => {
    const { cookie } = await createAndAuthenticateUser();

    for (let i = 0; i < 10; i++) {
      await request(app.server)
        .post("/meals")
        .set("Cookie", [cookie])
        .send({
          name: "meal-name",
          description: "meal-description",
          timestamp: new Date(),
          isOnDiet: i < 5,
        });
    }

    const response = await request(app.server)
      .get("/users/metrics")
      .set("Cookie", [cookie])
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      metrics: {
        id: expect.any(String),
        userId: expect.any(String),
        totalMeals: 10,
        bestOnDietStreak: 5,
        totalMealsOnDiet: 5,
        totalMealsOffDiet: 5,
      },
    });
  });
});
