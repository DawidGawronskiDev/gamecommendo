"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { PlatformWithPopularGames } from "../types";
import { GameCard } from "@/features/game/components/game-card";

type PlatformCatalogSectionRailProps = {
  platforms: PlatformWithPopularGames[];
  currentPlatformId: PlatformWithPopularGames["id"];
  onPlatformSelect: (platformId: PlatformWithPopularGames["id"]) => void;
};

function PlatformCatalogSectionRail({
  platforms,
  currentPlatformId,
  onPlatformSelect,
}: PlatformCatalogSectionRailProps) {
  return (
    <div
      role="group"
      aria-label="Platform"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:py-0"
    >
      {platforms.map((platform) => (
        <button
          key={platform.id}
          type="button"
          aria-pressed={platform.id === currentPlatformId}
          onClick={() => onPlatformSelect(platform.id)}
          className="group/platform flex shrink-0 items-baseline justify-between gap-4 bg-card px-3 py-2.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          <span className="font-heading text-sm leading-snug font-semibold whitespace-nowrap lg:whitespace-normal">
            {platform.name}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums group-aria-pressed/platform:text-primary-foreground/70">
            {platform.gameCount.toLocaleString("en-US")}
          </span>
        </button>
      ))}
    </div>
  );
}

type PlatformCatalogSectionGridProps = {
  platform: PlatformWithPopularGames;
};

function PlatformCatalogSectionGrid({
  platform,
}: PlatformCatalogSectionGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 xl:grid-cols-6">
      {platform.games.map((game, idx) => (
        <li
          key={game.id}
          style={{ animationDelay: `${idx * 30}ms` }}
          className="min-w-0 animate-in duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
        >
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}

type PlatformCatalogSectionProps = React.ComponentProps<"section"> & {
  platforms: PlatformWithPopularGames[];
};

export function PlatformCatalogSection({
  platforms,
  className,
  ...props
}: PlatformCatalogSectionProps) {
  const [currentPlatformId, setCurrentPlatformId] = useState(platforms[0]?.id);

  const platform = platforms.find(
    (platform) => platform.id === currentPlatformId,
  );
  if (!platform) return null;

  return (
    <section
      aria-labelledby="platform-games-heading"
      className={cn("pt-12 pb-10 md:pt-16 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-4 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-5">
          <h2
            id="platform-games-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            By platform
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            The twelve platforms holding the most Games in the Catalog, each
            with its count and its most popular Games.
          </p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <PlatformCatalogSectionRail
            platforms={platforms}
            currentPlatformId={platform.id}
            onPlatformSelect={setCurrentPlatformId}
          />
          <PlatformCatalogSectionGrid key={platform.id} platform={platform} />
        </div>
      </div>
    </section>
  );
}
