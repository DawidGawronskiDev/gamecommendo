"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GenreWithPopularGames } from "../types";
import { GameCard } from "@/features/game/components/game-card";

type GenreCatalogSectionTogglesProps = {
  genres: GenreWithPopularGames[];
  currentGenreId: GenreWithPopularGames["id"];
  onGenreSelect: (genreId: GenreWithPopularGames["id"]) => void;
};

function GenreCatalogSectionToggles({
  genres,
  currentGenreId,
  onGenreSelect,
}: GenreCatalogSectionTogglesProps) {
  return (
    <div
      role="group"
      aria-label="Genre"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {genres.map((genre) => {
        const isCurrent = genre.id === currentGenreId;

        return (
          <Button
            key={genre.id}
            size="sm"
            variant={isCurrent ? "default" : "outline"}
            aria-pressed={isCurrent}
            onClick={() => onGenreSelect(genre.id)}
            className="shrink-0"
          >
            {genre.name}
          </Button>
        );
      })}
    </div>
  );
}

type GenreCatalogSectionGridProps = {
  genre: GenreWithPopularGames;
};

function GenreCatalogSectionGrid({ genre }: GenreCatalogSectionGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6">
      {genre.games.map((game, idx) => (
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

type GenreCatalogSectionProps = React.ComponentProps<"section"> & {
  genres: GenreWithPopularGames[];
};

export function GenreCatalogSection({
  genres,
  className,
  ...props
}: GenreCatalogSectionProps) {
  const [currentGenreId, setCurrentGenreId] = useState(genres[0]?.id);

  const genre = genres.find((genre) => genre.id === currentGenreId);
  if (!genre) return null;

  return (
    <section
      aria-labelledby="genre-games-heading"
      className={cn("pt-12 pb-10 md:pt-16 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-4 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-5">
          <h2
            id="genre-games-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            By genre
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            The most popular Games in each genre. Pick one to switch.
          </p>
        </div>
        <GenreCatalogSectionToggles
          genres={genres}
          currentGenreId={genre.id}
          onGenreSelect={setCurrentGenreId}
        />
        <div className="pt-6 md:pt-8">
          <GenreCatalogSectionGrid key={genre.id} genre={genre} />
        </div>
      </div>
    </section>
  );
}
