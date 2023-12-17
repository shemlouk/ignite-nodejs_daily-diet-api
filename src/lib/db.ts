import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envs } from "./envs";

const connection = postgres(envs.DATABASE_URL);
const db = drizzle(connection);

export { db };
