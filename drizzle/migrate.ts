import { envs } from "@/lib/envs";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connection = postgres(envs.DATABASE_URL, { max: 1 });
const db = drizzle(connection);

migrate(db, { migrationsFolder: "./drizzle/migrations" }).then(async () => {
  await connection.end();
});
