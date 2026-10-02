import { getLibraryGameIds } from "../queries";

export async function LibraryStyle() {
  const gameIds = await getLibraryGameIds();
  const hasGames = gameIds.length > 0;

  if (!hasGames) return null;

  const selector = gameIds
    .map((gameId) => `[data-game-id="${Number(gameId)}"]`)
    .join(",");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `${selector}{--game-ring:var(--library)}`,
      }}
    />
  );
}
