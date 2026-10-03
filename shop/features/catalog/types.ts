import type {
  getCatalogFilterOptions,
  getCatalogPage,
  getDecadesWithPopularGames,
  getGenresWithPopularGames,
  getPlatformsWithPopularGames,
  getPopularGames,
  getScoreGapGames,
  getSpotlightGames,
} from "./queries";

export type SpotlightGame = Awaited<
  ReturnType<typeof getSpotlightGames>
>[number];

export type PopularGame = Awaited<ReturnType<typeof getPopularGames>>[number];

export type ScoreGapGames = Awaited<ReturnType<typeof getScoreGapGames>>;

export type ScoreGapGame = ScoreGapGames["playersHigher"][number];

export type GenreWithPopularGames = Awaited<
  ReturnType<typeof getGenresWithPopularGames>
>[number];

export type PlatformWithPopularGames = Awaited<
  ReturnType<typeof getPlatformsWithPopularGames>
>[number];

export type DecadeWithPopularGames = Awaited<
  ReturnType<typeof getDecadesWithPopularGames>
>[number];

export type CatalogSort = "popularity" | "score" | "newest" | "oldest" | "name";

export type CatalogFilters = {
  name: string;
  genreId: number | null;
  platformId: number | null;
  decade: number | null;
  minScore: number | null;
  sort: CatalogSort;
  page: number;
};

export type CatalogPage = Awaited<ReturnType<typeof getCatalogPage>>;

export type CatalogFilterOptions = Awaited<
  ReturnType<typeof getCatalogFilterOptions>
>;
