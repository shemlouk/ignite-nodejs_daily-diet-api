import { db } from "@/lib/db";
import { createAndAuthenticateUser } from "@/lib/utils/tests/create-and-authenticate-user";
import { meals, users } from "drizzle/schema";
import request from "supertest";
import { app } from "../app";

describe("Delete Meal Controller", () => {
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

  it("should delete a meal", async () => {
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
      .delete(`/meals/${mealId}`)
      .set("Cookie", [cookie])
      .send()
      .expect(204);

    await expect(db.select().from(meals)).resolves.toHaveLength(0);
  });

  it("should not delete a meal from another user", async () => {
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
      .delete(`/meals/${mealId}`)
      .set("Cookie", ["token=another-user-token"])
      .send()
      .expect(401);

    await expect(db.select().from(meals)).resolves.toHaveLength(1);
  });
});
