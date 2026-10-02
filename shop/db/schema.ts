import { pgTable, integer, varchar, timestamp, text, date, doublePrecision, index, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const gameGameModes = pgTable("game_game_modes", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	gameModeId: integer("game_mode_id").notNull().references(() => gameModes.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.gameModeId], name: "game_game_modes_pkey"}),
]);

export const gameGenres = pgTable("game_genres", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	genreId: integer("genre_id").notNull().references(() => genres.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.genreId], name: "game_genres_pkey"}),
]);

export const gameKeywords = pgTable("game_keywords", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	keywordId: integer("keyword_id").notNull().references(() => keywords.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.keywordId], name: "game_keywords_pkey"}),
]);

export const gameModes = pgTable("game_modes", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const gamePlatforms = pgTable("game_platforms", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	platformId: integer("platform_id").notNull().references(() => platforms.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.platformId], name: "game_platforms_pkey"}),
]);

export const gamePlayerPerspectives = pgTable("game_player_perspectives", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	playerPerspectiveId: integer("player_perspective_id").notNull().references(() => playerPerspectives.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.playerPerspectiveId], name: "game_player_perspectives_pkey"}),
]);

export const gameSteamApps = pgTable("game_steam_apps", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	steamAppId: integer("steam_app_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.steamAppId], name: "game_steam_apps_pkey"}),
	index("game_steam_apps_steam_app_id_idx").using("btree", table.steamAppId.asc().nullsLast()),
]);

export const gameThemes = pgTable("game_themes", {
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	themeId: integer("theme_id").notNull().references(() => themes.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.gameId, table.themeId], name: "game_themes_pkey"}),
]);

export const games = pgTable("games", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }),
	summary: text(),
	storyline: text(),
	url: varchar({ length: 255 }),
	coverUrl: varchar("cover_url", { length: 255 }),
	firstReleaseDate: date("first_release_date"),
	rating: doublePrecision(),
	ratingCount: integer("rating_count"),
	aggregatedRating: doublePrecision("aggregated_rating"),
	aggregatedRatingCount: integer("aggregated_rating_count"),
	totalRating: doublePrecision("total_rating"),
	totalRatingCount: integer("total_rating_count"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const genres = pgTable("genres", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const keywords = pgTable("keywords", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const platforms = pgTable("platforms", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const playerPerspectives = pgTable("player_perspectives", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const screenshots = pgTable("screenshots", {
	id: integer().primaryKey(),
	gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" } ),
	url: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const themes = pgTable("themes", {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});
