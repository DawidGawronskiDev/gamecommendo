"use server";

import { headers } from "next/headers";
import { avg, count, eq, isNotNull, sql } from "drizzle-orm";
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core";

import { db } from "@/db";
import {
  gameGameModes,
  gameGenres,
  gameModes,
  gamePlayerPerspectives,
  games as gamesTable,
  gameThemes,
  genres,
  playerPerspectives,
  themes,
} from "@/db/schema";
import { favouriteGame, libraryGame } from "@/db/shop-schema";
import { auth } from "@/lib/auth";

const MIN_LIBRARY_GAMES = 10;
const MIN_FAVOURITE_GAMES = 5;
const ITEMS_PER_DIMENSION = 6;
const DISTINCTIVE_ITEMS = 4;

const gameDecade = sql<number>`(floor(extract(year from ${gamesTable.firstReleaseDate}) / 10) * 10)::int`;

type Lookup = {
  junction: PgTable;
  gameId: AnyPgColumn;
  itemId: AnyPgColumn;
  lookup: PgTable;
  lookupId: AnyPgColumn;
  lookupName: AnyPgColumn;
};

const LOOKUPS = {
  genres: {
    junction: gameGenres,
    gameId: gameGenres.gameId,
    itemId: gameGenres.genreId,
    lookup: genres,
    lookupId: genres.id,
    lookupName: genres.name,
  },
  themes: {
    junction: gameThemes,
    gameId: gameThemes.gameId,
    itemId: gameThemes.themeId,
    lookup: themes,
    lookupId: themes.id,
    lookupName: themes.name,
  },
  perspectives: {
    junction: gamePlayerPerspectives,
    gameId: gamePlayerPerspectives.gameId,
    itemId: gamePlayerPerspectives.playerPerspectiveId,
    lookup: playerPerspectives,
    lookupId: playerPerspectives.id,
    lookupName: playerPerspectives.name,
  },
  gameModes: {
    junction: gameGameModes,
    gameId: gameGameModes.gameId,
    itemId: gameGameModes.gameModeId,
    lookup: gameModes,
    lookupId: gameModes.id,
    lookupName: gameModes.name,
  },
} satisfies Record<string, Lookup>;

const getShares = async (
  memberId: string,
  { junction, gameId, itemId, lookup, lookupId, lookupName }: Lookup,
  libraryCount: number,
  catalogCount: number,
) => {
  const [mine, everyone] = await Promise.all([
    db
      .select({
        id: sql<number>`${lookupId}`,
        name: sql<string>`${lookupName}`,
        gameCount: count(),
      })
      .from(libraryGame)
      .innerJoin(junction, eq(gameId, libraryGame.gameId))
      .innerJoin(lookup, eq(lookupId, itemId))
      .where(eq(libraryGame.userId, memberId))
      .groupBy(lookupId, lookupName),
    db
      .select({ id: sql<number>`${itemId}`, gameCount: count() })
      .from(junction)
      .groupBy(itemId),
  ]);

  const catalog = new Map(everyone.map((row) => [row.id, row.gameCount]));

  return mine
    .map((row) => {
      const share = row.gameCount / libraryCount;
      const catalogShare = (catalog.get(row.id) ?? 0) / catalogCount;
      return {
        id: row.id,
        name: row.name,
        gameCount: row.gameCount,
        share,
        catalogShare,
        lift: catalogShare ? share / catalogShare : 0,
      };
    })
    .sort((a, b) => b.share - a.share);
};

export const getTaste = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Log in to see your Taste.");
  const memberId = session.user.id;

  const [[library], [catalog], [favourites]] = await Promise.all([
    db
      .select({
        gameCount: count(),
        score: avg(gamesTable.totalRating).mapWith(Number),
        popularity: avg(gamesTable.totalRatingCount).mapWith(Number),
      })
      .from(libraryGame)
      .innerJoin(gamesTable, eq(gamesTable.id, libraryGame.gameId))
      .where(eq(libraryGame.userId, memberId)),
    db
      .select({
        gameCount: count(),
        score: avg(gamesTable.totalRating).mapWith(Number),
        popularity: avg(gamesTable.totalRatingCount).mapWith(Number),
      })
      .from(gamesTable),
    db
      .select({ gameCount: count() })
      .from(favouriteGame)
      .where(eq(favouriteGame.userId, memberId)),
  ]);

  const base = {
    gameCount: library.gameCount,
    minGameCount: MIN_LIBRARY_GAMES,
  };
  if (library.gameCount < MIN_LIBRARY_GAMES) return { ...base, taste: null };

  const shares = (lookup: Lookup) =>
    getShares(memberId, lookup, library.gameCount, catalog.gameCount);

  const [
    genreShares,
    themeShares,
    perspectiveShares,
    gameModeShares,
    libraryDecades,
    catalogDecades,
    favouriteGenres,
  ] = await Promise.all([
    shares(LOOKUPS.genres),
    shares(LOOKUPS.themes),
    shares(LOOKUPS.perspectives),
    shares(LOOKUPS.gameModes),
    db
      .select({ decade: gameDecade, gameCount: count() })
      .from(libraryGame)
      .innerJoin(gamesTable, eq(gamesTable.id, libraryGame.gameId))
      .where(eq(libraryGame.userId, memberId))
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db
      .select({ decade: gameDecade, gameCount: count() })
      .from(gamesTable)
      .where(isNotNull(gamesTable.firstReleaseDate))
      .groupBy(sql`1`),
    favourites.gameCount >= MIN_FAVOURITE_GAMES
      ? db
          .select({ name: genres.name, gameCount: count() })
          .from(favouriteGame)
          .innerJoin(gameGenres, eq(gameGenres.gameId, favouriteGame.gameId))
          .innerJoin(genres, eq(genres.id, gameGenres.genreId))
          .where(eq(favouriteGame.userId, memberId))
          .groupBy(genres.name)
          .orderBy(sql`2 desc`)
          .limit(3)
      : [],
  ]);

  const catalogDecadeCounts = new Map(
    catalogDecades.map((row) => [row.decade, row.gameCount]),
  );
  const decades = libraryDecades
    .filter((row) => row.decade !== null)
    .map((row) => ({
      id: row.decade,
      name: `${row.decade}s`,
      gameCount: row.gameCount,
      share: row.gameCount / library.gameCount,
      catalogShare:
        (catalogDecadeCounts.get(row.decade) ?? 0) / catalog.gameCount,
      href: `/browse?decade=${row.decade}`,
    }));

  const withHref = (
    items: Awaited<ReturnType<typeof getShares>>,
    href: (id: number) => string | null,
  ) => items.map((item) => ({ ...item, href: href(item.id) }));

  const dimensions = [
    {
      name: "Genres",
      items: withHref(genreShares, (id) => `/browse?genre=${id}`),
    },
    { name: "Themes", items: withHref(themeShares, () => null) },
    { name: "Perspectives", items: withHref(perspectiveShares, () => null) },
    { name: "Game modes", items: withHref(gameModeShares, () => null) },
  ];

  // A handful of Games can make anything look distinctive, so an item has to
  // cover a real part of the Library before it counts.
  const minDistinctiveCount = Math.max(5, Math.ceil(library.gameCount * 0.08));
  const distinctive = dimensions
    .flatMap((dimension) => dimension.items)
    .filter((item) => item.gameCount >= minDistinctiveCount && item.lift > 1.25)
    .sort((a, b) => b.lift - a.lift)
    .slice(0, DISTINCTIVE_ITEMS)
    .map(({ name, lift, share }) => ({ name, lift, share }));

  return {
    ...base,
    taste: {
      distinctive,
      dimensions: [
        ...dimensions.map((dimension) => ({
          name: dimension.name,
          items: dimension.items
            .slice(0, ITEMS_PER_DIMENSION)
            .map(({ name, share, catalogShare, gameCount, href }) => ({
              name,
              share,
              catalogShare,
              gameCount,
              href,
            })),
        })),
        {
          name: "Decades",
          items: decades.map(
            ({ name, share, catalogShare, gameCount, href }) => ({
              name,
              share,
              catalogShare,
              gameCount,
              href: href as string | null,
            }),
          ),
        },
      ],
      score: { library: library.score ?? 0, catalog: catalog.score ?? 0 },
      popularity: {
        library: library.popularity ?? 0,
        catalog: catalog.popularity || 1,
      },
      favouriteGenres: favouriteGenres.map((genre) => genre.name),
    },
  };
};
