import "dotenv/config";
import { z } from "zod";

const envsSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
});

const envs = envsSchema.parse(process.env);

export { envs };
