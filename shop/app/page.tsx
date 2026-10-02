import { getSession } from "@/features/auth/queries";
import { DecadeCatalogSection } from "@/features/catalog/components/decade-catalog-section";
import { GenreCatalogSection } from "@/features/catalog/components/genre-catalog-section";
import { PlatformCatalogSection } from "@/features/catalog/components/platform-catalog-section";
import { PopularCatalogSection } from "@/features/catalog/components/popular-catalog-section";
import { SpotlightCatalogSection } from "@/features/catalog/components/spotlight-catalog-section";
import {
  getDecadesWithPopularGames,
  getGenresWithPopularGames,
  getPlatformsWithPopularGames,
  getPopularGames,
  getSpotlightGames,
} from "@/features/catalog/queries";
import { getFavouriteGameIds } from "@/features/favourite/queries";
import { getLibraryGameIds } from "@/features/library/queries";
import { PersonalRecommendationSection } from "@/features/recommendation/components/personal-recommendation-section";
import { getRecommendationsForGames } from "@/features/recommendation/queries";

const getPersonalRecommendations = async () => {
  const session = await getSession();
  if (!session) return null;

  const [libraryGameIds, favouriteGameIds] = await Promise.all([
    getLibraryGameIds(),
    getFavouriteGameIds(),
  ]);

  return {
    libraryGameCount: libraryGameIds.length,
    recommendations: await getRecommendationsForGames(
      libraryGameIds,
      favouriteGameIds,
    ),
  };
};

export default async function HomePage() {
  const [spotlightGames, popularGames, genres, platforms, decades, personal] =
    await Promise.all([
      getSpotlightGames(),
      getPopularGames(),
      getGenresWithPopularGames(),
      getPlatformsWithPopularGames(),
      getDecadesWithPopularGames(),
      getPersonalRecommendations(),
    ]);

  return (
    <>
      <SpotlightCatalogSection spotlightGames={spotlightGames} />
      {personal && (
        <PersonalRecommendationSection
          recommendations={personal.recommendations}
          libraryGameCount={personal.libraryGameCount}
        />
      )}
      <PopularCatalogSection popularGames={popularGames} />
      <GenreCatalogSection genres={genres} />
      <PlatformCatalogSection platforms={platforms} />
      <DecadeCatalogSection decades={decades} />
    </>
  );
}
