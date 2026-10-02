import { and, desc, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { games } from "@/db/schema";
import { SelectedGame } from "./types";

export const getSelectedGames = async (): Promise<SelectedGame[]> => {
  return await db.select().from(games).limit(10);
};

export const getMostPopularGames = async (): Promise<SelectedGame[]> => {
  return await db
    .select()
    .from(games)
    .where(and(isNotNull(games.totalRatingCount), isNotNull(games.coverUrl)))
    .orderBy(desc(games.totalRatingCount))
    .limit(10);
};

export const getGamesWithScreenshots = async () => {
  return await db.query.games.findMany({
    where: { totalRatingCount: { isNotNull: true } },
    orderBy: { totalRatingCount: "desc" },
    limit: 6,
    with: { screenshots: true },
  });
};
