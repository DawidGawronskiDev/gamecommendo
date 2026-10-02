"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { SpotlightGame } from "../types";
import { SpotlightCatalogHero } from "./spotlight-catalog-hero";
import { SpotlightCatalogRail } from "./spotlight-catalog-rail";
import { SpotlightCatalogRecommendations } from "./spotlight-catalog-recommendations";

type SpotlightCatalogSectionProps = React.ComponentProps<"section"> & {
  spotlightGames: SpotlightGame[];
};

export function SpotlightCatalogSection({
  spotlightGames,
  className,
  ...props
}: SpotlightCatalogSectionProps) {
  const [currentGameIdx, setCurrentGameIdx] = useState(0);

  const game = spotlightGames[currentGameIdx];
  if (!game) return null;

  const hasRecommendations = game.recommendations.length > 0;

  return (
    <section
      aria-label="Spotlight"
      className={cn("pt-4 pb-10 md:pt-6 md:pb-14", className)}
      {...props}
    >
      <div className="group/spotlight mx-auto grid w-full max-w-[1560px] grid-cols-[minmax(0,1fr)] gap-3 px-4 md:px-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <SpotlightCatalogHero
          spotlightGames={spotlightGames}
          currentGameIdx={currentGameIdx}
        />
        <SpotlightCatalogRail
          spotlightGames={spotlightGames}
          currentGameIdx={currentGameIdx}
          onGameSelect={setCurrentGameIdx}
        />
        {hasRecommendations && (
          <SpotlightCatalogRecommendations
            game={game}
            className="mt-6 md:mt-8 lg:col-span-2"
          />
        )}
      </div>
    </section>
  );
}
