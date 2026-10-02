"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { games as gamesTable } from "@/db/schema";
import { dismissedGame, favouriteGame } from "@/db/shop-schema";
import { getGamesByIds } from "@/features/game/queries";
import { GameId } from "@/features/game/types";
import { auth } from "@/lib/auth";

const getMemberId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
};

const requireMemberId = async () => {
  const memberId = await getMemberId();
  if (!memberId) throw new Error("Log in to keep Favourites.");
  return memberId;
};

const toGameId = (value: GameId) => {
  const gameId = Number(value);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new Error("That Game does not exist.");
  }
  return gameId;
};

export const getFavouriteGameIds = async () => {
  const memberId = await getMemberId();
  if (!memberId) return [];

  const rows = await db
    .select({ gameId: favouriteGame.gameId })
    .from(favouriteGame)
    .where(eq(favouriteGame.userId, memberId));

  return rows.map((row) => row.gameId);
};

export const getFavourites = async () => {
  const memberId = await requireMemberId();

  const rows = await db
    .select({ id: gamesTable.id })
    .from(favouriteGame)
    .innerJoin(gamesTable, eq(gamesTable.id, favouriteGame.gameId))
    .where(eq(favouriteGame.userId, memberId))
    .orderBy(desc(favouriteGame.createdAt));

  return getGamesByIds(rows.map((row) => row.id));
};

export const addToFavourites = async (value: GameId) => {
  const memberId = await requireMemberId();
  const gameId = toGameId(value);

  const [game] = await db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(eq(gamesTable.id, gameId))
    .limit(1);
  if (!game) throw new Error("That Game does not exist.");

  try {
    await db.transaction(async (transaction) => {
      await transaction
        .insert(favouriteGame)
        .values({ userId: memberId, gameId })
        .onConflictDoNothing();
      // A Game cannot be both loved and dismissed; the last choice wins.
      await transaction
        .delete(dismissedGame)
        .where(
          and(
            eq(dismissedGame.userId, memberId),
            eq(dismissedGame.gameId, gameId),
          ),
        );
    });
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be added. Try again.");
  }

  revalidatePath("/", "layout");
};

export const removeFromFavourites = async (value: GameId) => {
  const memberId = await requireMemberId();
  const gameId = toGameId(value);

  try {
    await db
      .delete(favouriteGame)
      .where(
        and(
          eq(favouriteGame.userId, memberId),
          eq(favouriteGame.gameId, gameId),
        ),
      );
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be removed. Try again.");
  }

  revalidatePath("/", "layout");
};

export const clearFavourites = async () => {
  const memberId = await requireMemberId();

  try {
    await db.delete(favouriteGame).where(eq(favouriteGame.userId, memberId));
  } catch (error) {
    console.error(error);
    throw new Error("Your Favourites could not be cleared. Try again.");
  }

  revalidatePath("/", "layout");
};
