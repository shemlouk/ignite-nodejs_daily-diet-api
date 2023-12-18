import "dotenv/config";
import { z } from "zod";

const envsSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["test", "dev", "prod"]).default("prod"),
});

const envs = envsSchema.parse(process.env);

// const databaseSchema = envs.NODE_ENV === "prod" ? "public" : envs.NODE_ENV;
// const databaseUrl = new URL(envs.DATABASE_URL);

// databaseUrl.searchParams.set("search_path", databaseSchema);
// envs.DATABASE_URL = databaseUrl.href;

export { envs };
