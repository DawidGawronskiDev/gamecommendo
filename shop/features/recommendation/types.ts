import type {
  getRecommendationsForGames,
  getRecommendedGames,
} from "./queries";

export type Recommendation = Awaited<
  ReturnType<typeof getRecommendedGames>
>[number];

export type PersonalRecommendation = Awaited<
  ReturnType<typeof getRecommendationsForGames>
>[number];
