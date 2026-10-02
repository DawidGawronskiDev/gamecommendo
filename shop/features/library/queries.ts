"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { gameSteamApps, games as gamesTable } from "@/db/schema";
import { libraryGame, memberSteam } from "@/db/shop-schema";
import { getGamesByIds } from "@/features/game/queries";
import { GameId } from "@/features/game/types";
import { auth } from "@/lib/auth";
import { getOwnedSteamAppIds, resolveSteamId } from "@/lib/steam";

const getMemberId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
};

const requireMemberId = async () => {
  const memberId = await getMemberId();
  if (!memberId) throw new Error("Log in to use your Library.");
  return memberId;
};

const toGameId = (value: GameId) => {
  const gameId = Number(value);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new Error("That Game does not exist.");
  }
  return gameId;
};

export const getLibraryGameIds = async () => {
  const memberId = await getMemberId();
  if (!memberId) return [];

  const rows = await db
    .select({ gameId: libraryGame.gameId })
    .from(libraryGame)
    .where(eq(libraryGame.userId, memberId));

  return rows.map((row) => row.gameId);
};

export const getLibrary = async () => {
  const memberId = await requireMemberId();

  const [rows, [steam]] = await Promise.all([
    db
      .select({ id: gamesTable.id })
      .from(libraryGame)
      .innerJoin(gamesTable, eq(gamesTable.id, libraryGame.gameId))
      .where(eq(libraryGame.userId, memberId))
      .orderBy(sql`${gamesTable.totalRatingCount} desc nulls last`),
    db
      .select({ steamId: memberSteam.steamId, syncedAt: memberSteam.syncedAt })
      .from(memberSteam)
      .where(eq(memberSteam.userId, memberId))
      .limit(1),
  ]);

  return {
    steamId: steam?.steamId ?? null,
    syncedAt: steam?.syncedAt ?? null,
    games: await getGamesByIds(rows.map((row) => row.id)),
  };
};

export const syncSteamLibrary = async (steamInput: string) => {
  const memberId = await requireMemberId();
  const text = String(steamInput).trim().slice(0, 200);
  if (!text) throw new Error("Enter a Steam ID, profile link or custom name.");

  let steamId: string | null;
  let appIds: number[] | null;
  try {
    steamId = await resolveSteamId(text);
    appIds = steamId ? await getOwnedSteamAppIds(steamId) : null;
  } catch (error) {
    console.error(error);
    throw new Error("Steam could not be reached. Try again in a moment.");
  }

  if (!steamId) {
    throw new Error(
      "No Steam profile found for that. Use the 17-digit Steam ID, your profile link or your custom name.",
    );
  }
  if (!appIds) {
    throw new Error(
      "Steam shared no games for this profile. In Steam, set Profile and Game details to Public under Privacy Settings, then sync again.",
    );
  }

  try {
    const matches = appIds.length
      ? await db
          .selectDistinct({ gameId: gameSteamApps.gameId })
          .from(gameSteamApps)
          .where(inArray(gameSteamApps.steamAppId, appIds))
      : [];

    const added = matches.length
      ? await db
          .insert(libraryGame)
          .values(matches.map(({ gameId }) => ({ userId: memberId, gameId })))
          .onConflictDoNothing()
          .returning({ gameId: libraryGame.gameId })
      : [];

    await db
      .insert(memberSteam)
      .values({ userId: memberId, steamId, syncedAt: new Date() })
      .onConflictDoUpdate({
        target: memberSteam.userId,
        set: { steamId, syncedAt: new Date() },
      });

    revalidatePath("/", "layout");

    return {
      ownedCount: appIds.length,
      matchedCount: matches.length,
      addedCount: added.length,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Your Library could not be saved. Try again.");
  }
};

export const addToLibrary = async (value: GameId) => {
  const memberId = await requireMemberId();
  const gameId = toGameId(value);

  const [game] = await db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(eq(gamesTable.id, gameId))
    .limit(1);
  if (!game) throw new Error("That Game does not exist.");

  try {
    await db
      .insert(libraryGame)
      .values({ userId: memberId, gameId })
      .onConflictDoNothing();
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be added. Try again.");
  }

  revalidatePath("/", "layout");
};

export const removeFromLibrary = async (value: GameId) => {
  const memberId = await requireMemberId();
  const gameId = toGameId(value);

  try {
    await db
      .delete(libraryGame)
      .where(
        and(eq(libraryGame.userId, memberId), eq(libraryGame.gameId, gameId)),
      );
  } catch (error) {
    console.error(error);
    throw new Error("The Game could not be removed. Try again.");
  }

  revalidatePath("/", "layout");
};

export const clearLibrary = async () => {
  const memberId = await requireMemberId();

  try {
    await db.delete(libraryGame).where(eq(libraryGame.userId, memberId));
  } catch (error) {
    console.error(error);
    throw new Error("Your Library could not be cleared. Try again.");
  }

  revalidatePath("/", "layout");
};
