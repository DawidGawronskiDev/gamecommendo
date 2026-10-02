import { Metadata } from "next";

import { getPopularGames } from "@/features/catalog/queries";
import { getGamesByIds } from "@/features/game/queries";
import { BlendRecommendationSection } from "@/features/recommendation/components/blend-recommendation-section";
import { getBlendRecommendations } from "@/features/recommendation/queries";

export const metadata: Metadata = {
  title: "Blend | gamecommendo",
  description:
    "Pick two Games and get the Recommendation that sits between them in meaning.",
};

type BlendPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const toGameId = (value: string | string[] | undefined) => {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const toLean = (value: string | string[] | undefined) => {
  const lean = Number(Array.isArray(value) ? value[0] : (value ?? 50));
  return Number.isFinite(lean)
    ? Math.min(100, Math.max(0, Math.round(lean / 10) * 10))
    : 50;
};

export default async function BlendPage({ searchParams }: BlendPageProps) {
  const params = await searchParams;
  const firstId = toGameId(params.a);
  const secondId = toGameId(params.b) === firstId ? null : toGameId(params.b);

  const [picks, suggestions] = await Promise.all([
    getGamesByIds([firstId, secondId].filter((id) => id !== null)),
    getPopularGames(),
  ]);
  const first = picks.find((game) => game.id === firstId) ?? null;
  const second = picks.find((game) => game.id === secondId) ?? null;
  const lean = toLean(params.lean);
  const blends =
    first && second
      ? await getBlendRecommendations(first.id, second.id, lean)
      : [];

  return (
    <BlendRecommendationSection
      key={`${first?.id}-${second?.id}`}
      first={first}
      second={second}
      blends={blends}
      lean={lean}
      suggestions={suggestions}
    />
  );
}
