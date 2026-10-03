"use server";

import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  gte,
  ilike,
  isNotNull,
  lte,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import {
  gameGenres,
  gamePlatforms,
  games as gamesTable,
  platforms as platformsTable,
} from "@/db/schema";
import { getDismissedGameIds } from "@/features/dismissal/queries";
import { getGamesByIds } from "@/features/game/queries";
import { getRecommendedGames } from "@/features/recommendation/queries";
import { CATALOG_SCORE_GAP_FLOOR } from "./data";
import { CatalogFilters } from "./types";

export const getSpotlightGames = async () => {
  const games = await db.query.games.findMany({
    where: { totalRatingCount: { isNotNull: true } },
    orderBy: {
      totalRatingCount: "desc",
    },
    limit: 6,
    with: {
      screenshots: true,
      genres: true,
    },
  });

  const dismissedGameIds = await getDismissedGameIds();

  return Promise.all(
    games.map(async (game) => ({
      ...game,
      recommendations: await getRecommendedGames(game.id, 6, dismissedGameIds),
    })),
  );
};

export const getPopularGames = async () => {
  return db.query.games.findMany({
    where: { totalRatingCount: { isNotNull: true } },
    orderBy: {
      totalRatingCount: "desc",
    },
    limit: 10,
    with: {
      genres: true,
    },
  });
};

export const getScoreGapGames = async () => {
  const gap = sql`${gamesTable.rating} - ${gamesTable.aggregatedRating}`;

  // A Score built on a handful of ratings makes the biggest gaps and means the least.
  const pick = async (order: ReturnType<typeof desc>) => {
    const games = await db
      .select({
        id: gamesTable.id,
        name: gamesTable.name,
        coverUrl: gamesTable.coverUrl,
        firstReleaseDate: gamesTable.firstReleaseDate,
        playerScore: gamesTable.rating,
        playerRatingCount: gamesTable.ratingCount,
        criticScore: gamesTable.aggregatedRating,
        criticReviewCount: gamesTable.aggregatedRatingCount,
      })
      .from(gamesTable)
      .where(
        and(
          gte(gamesTable.ratingCount, CATALOG_SCORE_GAP_FLOOR.playerRatings),
          gte(
            gamesTable.aggregatedRatingCount,
            CATALOG_SCORE_GAP_FLOOR.criticReviews,
          ),
        ),
      )
      .orderBy(order)
      .limit(10);

    return games.flatMap((game) =>
      game.playerScore != null && game.criticScore != null
        ? {
            ...game,
            playerScore: Math.round(game.playerScore),
            criticScore: Math.round(game.criticScore),
          }
        : [],
    );
  };

  const [playersHigher, criticsHigher] = await Promise.all([
    pick(desc(gap)),
    pick(asc(gap)),
  ]);

  return {
    playersHigher: playersHigher.filter(
      (game) => game.playerScore > game.criticScore,
    ),
    criticsHigher: criticsHigher.filter(
      (game) => game.criticScore > game.playerScore,
    ),
  };
};

export const getGenresWithPopularGames = async () => {
  const genres = await db.query.genres.findMany({
    orderBy: {
      name: "asc",
    },
    with: {
      games: {
        where: { totalRatingCount: { isNotNull: true } },
        orderBy: {
          totalRatingCount: "desc",
        },
        limit: 12,
      },
    },
  });

  return genres.filter((genre) => genre.games.length > 0);
};

export const getPlatformsWithPopularGames = async () => {
  const platformCounts = await db
    .select({ id: gamePlatforms.platformId, gameCount: count() })
    .from(gamePlatforms)
    .groupBy(gamePlatforms.platformId)
    .orderBy(desc(count()))
    .limit(12);
  if (!platformCounts.length) return [];

  const platforms = await db.query.platforms.findMany({
    where: { id: { in: platformCounts.map((platform) => platform.id) } },
    with: {
      games: {
        where: { totalRatingCount: { isNotNull: true } },
        orderBy: {
          totalRatingCount: "desc",
        },
        limit: 12,
        with: {
          genres: true,
        },
      },
    },
  });

  return platformCounts.flatMap(({ id, gameCount }) => {
    const platform = platforms.find((platform) => platform.id === id);
    return platform ? { ...platform, gameCount } : [];
  });
};

export const getDecadesWithPopularGames = async () => {
  const decadeCounts = await db
    .select({
      decade: sql<number>`(floor(extract(year from ${gamesTable.firstReleaseDate}) / 10) * 10)::int`,
      gameCount: count(),
    })
    .from(gamesTable)
    .where(isNotNull(gamesTable.firstReleaseDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return Promise.all(
    decadeCounts.map(async ({ decade, gameCount }) => ({
      decade,
      gameCount,
      games: await db.query.games.findMany({
        where: {
          firstReleaseDate: {
            gte: `${decade}-01-01`,
            lte: `${decade + 9}-12-31`,
          },
          totalRatingCount: { isNotNull: true },
        },
        orderBy: {
          totalRatingCount: "desc",
        },
        limit: 12,
        with: {
          genres: true,
        },
      }),
    })),
  );
};

const CATALOG_PAGE_SIZE = 48;

const catalogDecade = sql<number>`(floor(extract(year from ${gamesTable.firstReleaseDate}) / 10) * 10)::int`;

const catalogOrder = {
  popularity: sql`${gamesTable.totalRatingCount} desc nulls last`,
  score: sql`${gamesTable.totalRating} desc nulls last`,
  newest: sql`${gamesTable.firstReleaseDate} desc nulls last`,
  oldest: sql`${gamesTable.firstReleaseDate} asc nulls last`,
  name: asc(gamesTable.name),
};

export const getCatalogPage = async (filters: CatalogFilters) => {
  const where = and(
    filters.name
      ? ilike(gamesTable.name, `%${filters.name.replace(/[\\%_]/g, "\\$&")}%`)
      : undefined,
    filters.minScore
      ? gte(gamesTable.totalRating, filters.minScore)
      : undefined,
    filters.decade
      ? and(
          gte(gamesTable.firstReleaseDate, `${filters.decade}-01-01`),
          lte(gamesTable.firstReleaseDate, `${filters.decade + 9}-12-31`),
        )
      : undefined,
    filters.genreId
      ? exists(
          db
            .select({ one: sql`1` })
            .from(gameGenres)
            .where(
              and(
                eq(gameGenres.gameId, gamesTable.id),
                eq(gameGenres.genreId, filters.genreId),
              ),
            ),
        )
      : undefined,
    filters.platformId
      ? exists(
          db
            .select({ one: sql`1` })
            .from(gamePlatforms)
            .where(
              and(
                eq(gamePlatforms.gameId, gamesTable.id),
                eq(gamePlatforms.platformId, filters.platformId),
              ),
            ),
        )
      : undefined,
  );

  const [rows, gameCount] = await Promise.all([
    db
      .select({ id: gamesTable.id })
      .from(gamesTable)
      .where(where)
      .orderBy(catalogOrder[filters.sort], asc(gamesTable.id))
      .limit(CATALOG_PAGE_SIZE)
      .offset((filters.page - 1) * CATALOG_PAGE_SIZE),
    db.$count(gamesTable, where),
  ]);

  return {
    games: await getGamesByIds(rows.map((row) => row.id)),
    gameCount,
    pageCount: Math.max(1, Math.ceil(gameCount / CATALOG_PAGE_SIZE)),
  };
};

export const getCatalogFilterOptions = async () => {
  const [genres, platforms, decades] = await Promise.all([
    db.query.genres.findMany({
      columns: { id: true, name: true },
      orderBy: {
        name: "asc",
      },
    }),
    db
      .select({ id: platformsTable.id, name: platformsTable.name })
      .from(gamePlatforms)
      .innerJoin(
        platformsTable,
        eq(platformsTable.id, gamePlatforms.platformId),
      )
      .groupBy(platformsTable.id, platformsTable.name)
      .orderBy(desc(count()))
      .limit(20),
    db
      .select({ decade: catalogDecade })
      .from(gamesTable)
      .where(isNotNull(gamesTable.firstReleaseDate))
      .groupBy(sql`1`)
      .orderBy(sql`1 desc`),
  ]);

  return { genres, platforms, decades: decades.map((row) => row.decade) };
};
