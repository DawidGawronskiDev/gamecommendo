import { getFavouriteGameIds } from "../queries";

export async function FavouriteStyle() {
  const gameIds = await getFavouriteGameIds();
  const hasGames = gameIds.length > 0;

  if (!hasGames) return null;

  const selector = gameIds
    .map((gameId) => `[data-game-id="${Number(gameId)}"]`)
    .join(",");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `${selector}{--game-ring:var(--favourite)}`,
      }}
    />
  );
}
