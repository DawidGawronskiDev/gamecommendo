import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Tables the shop owns: Better Auth's (db/auth-schema.ts) and the shop's own
// (db/shop-schema.ts). Migrated with `pnpm db:generate` and `pnpm db:migrate`.
// Game tables are not listed here on purpose, so a migration can never touch
// them. See db/README.md.
export default defineConfig({
  out: "./drizzle/shop",
  schema: ["./db/auth-schema.ts", "./db/shop-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations_shop",
  },
});
