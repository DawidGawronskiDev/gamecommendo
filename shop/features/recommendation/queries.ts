"use server";

import { getDismissedGameIds } from "@/features/dismissal/queries";
import { getGamesByIds } from "@/features/game/queries";
import { GameId } from "@/features/game/types";
import {
  getBlendedGameIds,
  getGameIdsCloseToMany,
  getGameIdsByQuery,
  getRecommendedGameIds,
} from "@/lib/chroma";

export const getRecommendedGames = async (
  gameId: GameId,
  limit = 6,
  dismissedGameIds?: GameId[],
) => {
  const dismissed = dismissedGameIds ?? (await getDismissedGameIds());
  const ids = await getRecommendedGameIds(gameId, limit, dismissed).catch(
    (error) => {
      console.error(`Recommendations failed for Game ${gameId}`, error);
      return [];
    },
  );

  return getGamesByIds(ids);
};

export const queryGames = async (query: string) => {
  const text = String(query).trim().slice(0, 200);
  if (text.length < 2) return [];

  try {
    return await getGamesByIds(await getGameIdsByQuery(text));
  } catch (error) {
    console.error(error);
    throw new Error("Recommendations are unavailable right now.");
  }
};

export const getBlendRecommendations = async (
  gameIdA: GameId,
  gameIdB: GameId,
  lean = 50,
) => {
  const percent = Math.min(
    100,
    Math.max(0, Math.round(Number(lean) / 10) * 10),
  );
  const ids = await getBlendedGameIds(
    gameIdA,
    gameIdB,
    (Number.isFinite(percent) ? percent : 50) / 100,
    await getDismissedGameIds(),
  ).catch((error) => {
    console.error(`Blend failed for Games ${gameIdA} and ${gameIdB}`, error);
    return [];
  });

  return getGamesByIds(ids);
};

const REASON_LIMIT = 2;

const toGameIds = (values: GameId[]) =>
  values.map(Number).filter((id) => Number.isInteger(id) && id > 0);

export const getRecommendationsForGames = async (
  sourceGameIds: GameId[],
  excludedGameIds: GameId[],
) => {
  const scored = await getGameIdsCloseToMany(toGameIds(sourceGameIds), [
    ...toGameIds(excludedGameIds),
    ...(await getDismissedGameIds()),
  ]).catch((error) => {
    console.error("Recommendations for many Games failed", error);
    return [];
  });
  if (!scored.length) return [];

  const reasonIds = [
    ...new Set(scored.flatMap((item) => item.sourceIds.slice(0, REASON_LIMIT))),
  ];
  const [games, reasons] = await Promise.all([
    getGamesByIds(scored.map((item) => item.id)),
    getGamesByIds(reasonIds),
  ]);

  return scored.flatMap((item) => {
    const game = games.find((candidate) => candidate.id === item.id);
    if (!game) return [];

    const because = item.sourceIds
      .slice(0, REASON_LIMIT)
      .flatMap((id) => reasons.find((reason) => reason.id === id)?.name ?? []);

    return {
      game,
      because,
      otherReasonCount: item.sourceIds.length - because.length,
    };
  });
};
