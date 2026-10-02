"use server";

import { db } from "@/db";
import { GameId } from "@/features/game/types";
import { getRecommendedGames } from "@/features/recommendation/queries";

export const getProductById = async (id: GameId) => {
  const game = await db.query.games.findFirst({
    where: { id },
    with: {
      screenshots: true,
      genres: true,
      themes: true,
      keywords: true,
      platforms: true,
      gameModes: true,
      playerPerspectives: true,
    },
  });
  if (!game) return null;

  return {
    ...game,
    recommendations: await getRecommendedGames(game.id, 12),
  };
};
