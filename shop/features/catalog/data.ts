import { CatalogFilters, CatalogSort } from "./types";

export const CATALOG_SORTS: { value: CatalogSort; label: string }[] = [
  { value: "popularity", label: "Most popular" },
  { value: "score", label: "Highest Score" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name", label: "Name A to Z" },
];

export const CATALOG_MIN_SCORES = [60, 70, 80, 90];

// What a Game needs before its Player Score and Critic Score are compared.
export const CATALOG_SCORE_GAP_FLOOR = { playerRatings: 100, criticReviews: 5 };

export const CATALOG_FILTER_PARAMS = {
  name: "name",
  genreId: "genre",
  platformId: "platform",
  decade: "decade",
  minScore: "score",
  sort: "sort",
  page: "page",
} as const;

export const catalogPageHref = (filters: CatalogFilters, page: number) => {
  const params = new URLSearchParams();
  const values = {
    name: filters.name,
    genreId: filters.genreId,
    platformId: filters.platformId,
    decade: filters.decade,
    minScore: filters.minScore,
    sort: filters.sort === "popularity" ? null : filters.sort,
    page: page > 1 ? page : null,
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      params.set(
        CATALOG_FILTER_PARAMS[key as keyof typeof values],
        String(value),
      );
    }
  }

  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
};
