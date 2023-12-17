import { envs } from "@/lib/envs";
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    connectionString: envs.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
