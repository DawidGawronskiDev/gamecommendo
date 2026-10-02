"use server";

import { asc, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { games as gamesTable } from "@/db/schema";
import { GameId } from "./types";

export const getGamesByIds = async (ids: GameId[]) => {
  if (!ids.length) return [];

  const games = await db.query.games.findMany({
    where: { id: { in: ids } },
    with: { genres: true },
  });

  // Keep Chroma's order, closest first.
  return ids.flatMap((id) => games.find((game) => game.id === id) ?? []);
};

export const searchGamesByName = async (name: string) => {
  const text = String(name).trim().slice(0, 80);
  if (text.length < 2) return [];

  const rows = await db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(ilike(gamesTable.name, `%${text.replace(/[\\%_]/g, "\\$&")}%`))
    .orderBy(
      sql`${gamesTable.totalRatingCount} desc nulls last`,
      asc(gamesTable.id),
    )
    .limit(8);

  return getGamesByIds(rows.map((row) => row.id));
};
