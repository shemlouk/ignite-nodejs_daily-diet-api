import "dotenv/config";
import { z } from "zod";

const envsSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["test", "dev", "prod"]).default("prod"),
  JWT_SECRET: z.string().min(1).default("supersecret"),
});

const envs = envsSchema.parse(process.env);

const databaseUrl = new URL(envs.DATABASE_URL);
if (envs.NODE_ENV !== "prod") databaseUrl.pathname += "-" + envs.NODE_ENV;
envs.DATABASE_URL = databaseUrl.href;

export { envs };
