import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const memberSteam = pgTable("member_steam", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  steamId: text("steam_id").notNull(),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// game_id points at a table Ingestion owns, so it carries no foreign key: a
// constraint here would make Ingestion's tables depend on the shop's.
export const libraryGame = pgTable(
  "library_game",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: integer("game_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.gameId] }),
    index("library_game_gameId_idx").on(table.gameId),
  ],
);

export const favouriteGame = pgTable(
  "favourite_game",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: integer("game_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.gameId] }),
    index("favourite_game_gameId_idx").on(table.gameId),
  ],
);

export const dismissedGame = pgTable(
  "dismissed_game",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: integer("game_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.gameId] }),
    index("dismissed_game_gameId_idx").on(table.gameId),
  ],
);
