"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { SpotlightGame } from "../types";

type SpotlightCatalogRailItemCoverProps = {
  game: SpotlightGame;
};

function SpotlightCatalogRailItemCover({
  game,
}: SpotlightCatalogRailItemCoverProps) {
  return (
    <span
      data-game-id={game.id}
      className="relative aspect-3/4 w-full shrink-0 overflow-hidden bg-muted ring-1 ring-(color:--game-ring) lg:w-12"
    >
      {game.coverUrl && (
        <Image
          src={game.coverUrl}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 3rem, 16vw"
          className="object-cover"
        />
      )}
    </span>
  );
}

type SpotlightCatalogRailItemLabelProps = {
  game: SpotlightGame;
  isCurrent: boolean;
};

function SpotlightCatalogRailItemLabel({
  game,
  isCurrent,
}: SpotlightCatalogRailItemLabelProps) {
  return (
    <span className="hidden min-w-0 lg:block">
      <span
        className={cn(
          "line-clamp-2 font-heading text-sm leading-snug font-semibold transition-colors",
          !isCurrent && "group-hover/item:text-primary",
        )}
      >
        {game.name}
      </span>
      <span className="block truncate text-xs text-muted-foreground tabular-nums">
        {[game.firstReleaseDate?.slice(0, 4), game.genres[0]?.name]
          .filter(Boolean)
          .join(" · ")}
      </span>
    </span>
  );
}

type SpotlightCatalogRailItemTimerProps = {
  onTimerEnd: () => void;
};

// The fill is the timer: its end advances the spotlight, so pausing it pauses the rotation.
function SpotlightCatalogRailItemTimer({
  onTimerEnd,
}: SpotlightCatalogRailItemTimerProps) {
  return (
    <span className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-background/60 lg:h-0.5 lg:bg-foreground/10">
      <span
        onAnimationEnd={onTimerEnd}
        className="block size-full animate-in bg-primary duration-[7000ms] ease-linear slide-in-from-left-[100%] group-hover/spotlight:paused group-has-focus-visible/spotlight:paused motion-reduce:animate-none"
      />
    </span>
  );
}

type SpotlightCatalogRailItemProps = {
  game: SpotlightGame;
  isCurrent: boolean;
  onSelect: () => void;
  onTimerEnd: () => void;
};

function SpotlightCatalogRailItem({
  game,
  isCurrent,
  onSelect,
  onTimerEnd,
}: SpotlightCatalogRailItemProps) {
  return (
    <li className="min-w-0">
      <button
        type="button"
        aria-label={game.name}
        aria-current={isCurrent}
        onClick={onSelect}
        className={cn(
          "group/item relative flex size-full items-center gap-3 overflow-hidden text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring lg:p-3",
          isCurrent
            ? "ring-2 ring-primary lg:bg-accent lg:ring-0"
            : "lg:bg-card lg:hover:bg-muted",
        )}
      >
        <SpotlightCatalogRailItemCover game={game} />
        <SpotlightCatalogRailItemLabel game={game} isCurrent={isCurrent} />
        {isCurrent && <SpotlightCatalogRailItemTimer onTimerEnd={onTimerEnd} />}
      </button>
    </li>
  );
}

type SpotlightCatalogRailProps = React.ComponentProps<"ol"> & {
  spotlightGames: SpotlightGame[];
  currentGameIdx: number;
  onGameSelect: (idx: number) => void;
};

export function SpotlightCatalogRail({
  spotlightGames,
  currentGameIdx,
  onGameSelect,
  className,
  ...props
}: SpotlightCatalogRailProps) {
  return (
    <ol
      className={cn(
        "grid grid-cols-6 gap-2 lg:grid-cols-1 lg:grid-rows-6",
        className,
      )}
      {...props}
    >
      {spotlightGames.map((spotlightGame, idx) => (
        <SpotlightCatalogRailItem
          key={spotlightGame.id}
          game={spotlightGame}
          isCurrent={idx === currentGameIdx}
          onSelect={() => onGameSelect(idx)}
          onTimerEnd={() => onGameSelect((idx + 1) % spotlightGames.length)}
        />
      ))}
    </ol>
  );
}
