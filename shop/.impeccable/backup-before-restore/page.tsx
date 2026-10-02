import { GameCarousel } from "@/features/game/components/game-carousel";
import { GameBanner } from "@/features/game/components/game-banner";
import {
  getGamesWithScreenshots,
  getMostPopularGames,
} from "@/features/game/queries";

export default async function HomePage() {
  const mostPopularGames = await getMostPopularGames();
  const bannerGames = await getGamesWithScreenshots();

  return (
    <>
      <h1 className="sr-only">
        gamecommendo: Games and Recommendations matched by meaning
      </h1>
      <GameBanner games={bannerGames} />
      <GameCarousel games={mostPopularGames} />
    </>
  );
}
