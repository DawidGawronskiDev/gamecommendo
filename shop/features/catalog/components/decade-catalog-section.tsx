"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { DecadeWithPopularGames } from "../types";
import { GameCard } from "@/features/game/components/game-card";

type DecadeCatalogSectionTimelineProps = {
  decades: DecadeWithPopularGames[];
  currentDecade: DecadeWithPopularGames["decade"];
  onDecadeSelect: (decade: DecadeWithPopularGames["decade"]) => void;
};

function DecadeCatalogSectionTimeline({
  decades,
  currentDecade,
  onDecadeSelect,
}: DecadeCatalogSectionTimelineProps) {
  return (
    <div
      role="group"
      aria-label="Decade"
      className="-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0"
    >
      <div className="flex min-w-full border-t border-foreground/10">
        {decades.map(({ decade, gameCount }) => (
          <button
            key={decade}
            type="button"
            aria-pressed={decade === currentDecade}
            onClick={() => onDecadeSelect(decade)}
            className="-mt-px flex shrink-0 grow basis-0 flex-col items-start gap-1.5 border-t-2 border-transparent pt-3 pr-6 pb-1 text-left text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:text-foreground"
          >
            <span className="font-heading text-3xl leading-none font-extrabold tracking-tighter tabular-nums md:text-5xl">
              {decade}s
            </span>
            <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
              {gameCount.toLocaleString("en-US")}{" "}
              {gameCount === 1 ? "Game" : "Games"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

type DecadeCatalogSectionGridProps = {
  decade: DecadeWithPopularGames;
};

function DecadeCatalogSectionGrid({ decade }: DecadeCatalogSectionGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6">
      {decade.games.map((game, idx) => (
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

type DecadeCatalogSectionProps = React.ComponentProps<"section"> & {
  decades: DecadeWithPopularGames[];
};

const largestDecade = (decades: DecadeWithPopularGames[]) =>
  decades.reduce<DecadeWithPopularGames | undefined>(
    (largest, decade) =>
      !largest || decade.gameCount > largest.gameCount ? decade : largest,
    undefined,
  )?.decade;

export function DecadeCatalogSection({
  decades,
  className,
  ...props
}: DecadeCatalogSectionProps) {
  const [currentDecade, setCurrentDecade] = useState(() =>
    largestDecade(decades),
  );

  const decade = decades.find((decade) => decade.decade === currentDecade);
  if (!decade) return null;

  return (
    <section
      aria-labelledby="decade-games-heading"
      className={cn("pt-12 pb-10 md:pt-16 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-6">
          <h2
            id="decade-games-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            By decade
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            The Catalog split by the decade each Game first released. Pick one
            for its most popular Games.
          </p>
        </div>
        <DecadeCatalogSectionTimeline
          decades={decades}
          currentDecade={decade.decade}
          onDecadeSelect={setCurrentDecade}
        />
        <div className="pt-6 md:pt-8">
          <DecadeCatalogSectionGrid key={decade.decade} decade={decade} />
        </div>
      </div>
    </section>
  );
}
