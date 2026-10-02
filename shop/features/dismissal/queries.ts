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
  if (!memberId) throw new Error("Log in to dismiss Games.");
  return memberId;
};

const toGameId = (value: GameId) => {
  const gameId = Number(value);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new Error("That Game does not exist.");
  }
  return gameId;
};

export const getDismissedGameIds = async () => {
  const memberId = await getMemberId();
  if (!memberId) return [];

  const rows = await db
    .select({ gameId: dismissedGame.gameId })
    .from(dismissedGame)
    .where(eq(dismissedGame.userId, memberId));

  return rows.map((row) => row.gameId);
};

export const getDismissedGames = async () => {
  const memberId = await requireMemberId();

  const rows = await db
    .select({ id: gamesTable.id })
    .from(dismissedGame)
    .innerJoin(gamesTable, eq(gamesTable.id, dismissedGame.gameId))
    .where(eq(dismissedGame.userId, memberId))
    .orderBy(desc(dismissedGame.createdAt));

  return getGamesByIds(rows.map((row) => row.id));
};

export const dismissGame = async (value: GameId) => {
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
        .insert(dismissedGame)
        .values({ userId: memberId, gameId })
        .onConflictDoNothing();
      // A Game cannot be both loved and dismissed; the last choice wins.
      await transaction
        .delete(favouriteGame)
        .where(
          and(
            eq(favouriteGame.userId, memberId),
            eq(favouriteGame.gameId, gameId),
          ),
        );
    });
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be dismissed. Try again.");
  }

  revalidatePath("/", "layout");
};

export const restoreGame = async (value: GameId) => {
  const memberId = await requireMemberId();
  const gameId = toGameId(value);

  try {
    await db
      .delete(dismissedGame)
      .where(
        and(
          eq(dismissedGame.userId, memberId),
          eq(dismissedGame.gameId, gameId),
        ),
      );
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be restored. Try again.");
  }

  revalidatePath("/", "layout");
};
