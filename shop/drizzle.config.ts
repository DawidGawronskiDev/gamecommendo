import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Game tables only. They are owned by Ingestion (../ingestion/init.sql) and are
// pulled, never migrated: run `pnpm db:pull`. See db/README.md.
export default defineConfig({
  out: "./drizzle/pull",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [
    "games",
    "screenshots",
    "genres",
    "platforms",
    "player_perspectives",
    "game_modes",
    "themes",
    "keywords",
    "game_*",
  ],
});
