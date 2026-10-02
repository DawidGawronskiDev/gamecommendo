import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	games: {
		gameModes: r.many.gameModes({
			from: r.games.id.through(r.gameGameModes.gameId),
			to: r.gameModes.id.through(r.gameGameModes.gameModeId)
		}),
		genres: r.many.genres({
			from: r.games.id.through(r.gameGenres.gameId),
			to: r.genres.id.through(r.gameGenres.genreId)
		}),
		keywords: r.many.keywords({
			from: r.games.id.through(r.gameKeywords.gameId),
			to: r.keywords.id.through(r.gameKeywords.keywordId)
		}),
		platforms: r.many.platforms({
			from: r.games.id.through(r.gamePlatforms.gameId),
			to: r.platforms.id.through(r.gamePlatforms.platformId)
		}),
		playerPerspectives: r.many.playerPerspectives({
			from: r.games.id.through(r.gamePlayerPerspectives.gameId),
			to: r.playerPerspectives.id.through(r.gamePlayerPerspectives.playerPerspectiveId)
		}),
		gameSteamApps: r.many.gameSteamApps(),
		themes: r.many.themes({
			from: r.games.id.through(r.gameThemes.gameId),
			to: r.themes.id.through(r.gameThemes.themeId)
		}),
		screenshots: r.many.screenshots(),
	},
	gameModes: {
		games: r.many.games(),
	},
	genres: {
		games: r.many.games(),
	},
	keywords: {
		games: r.many.games(),
	},
	platforms: {
		games: r.many.games(),
	},
	playerPerspectives: {
		games: r.many.games(),
	},
	gameSteamApps: {
		game: r.one.games({
			from: r.gameSteamApps.gameId,
			to: r.games.id
		}),
	},
	themes: {
		games: r.many.games(),
	},
	screenshots: {
		game: r.one.games({
			from: r.screenshots.gameId,
			to: r.games.id
		}),
	},
}))