import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ScoreGapGame } from "../types";

type ScoreGapCatalogListRowPartProps = {
  game: ScoreGapGame;
};

function ScoreGapCatalogListRowCover({
  game,
}: ScoreGapCatalogListRowPartProps) {
  return (
    <span
      data-game-id={game.id}
      className="relative aspect-3/4 w-10 shrink-0 overflow-hidden bg-muted ring-1 ring-(color:--game-ring) transition-shadow group-hover/row:ring-2 group-hover/row:ring-primary sm:w-12"
    >
      {game.coverUrl && (
        <Image
          src={game.coverUrl}
          alt=""
          fill
          unoptimized
          sizes="3rem"
          className="object-cover"
        />
      )}
    </span>
  );
}

function ScoreGapCatalogListRowLabel({
  game,
}: ScoreGapCatalogListRowPartProps) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-heading text-sm leading-snug font-semibold transition-colors group-hover/row:text-primary">
        {game.name}
      </span>
      <span className="truncate text-xs text-muted-foreground tabular-nums">
        {[
          game.firstReleaseDate?.slice(0, 4),
          `${(game.playerRatingCount ?? 0).toLocaleString("en-US")} player ratings`,
          `${(game.criticReviewCount ?? 0).toLocaleString("en-US")} critic reviews`,
        ]
          .filter(Boolean)
          .join(" · ")}
      </span>
    </span>
  );
}

// A 0 to 100 line. The filled mark is the Player Score, the hollow one the
// Critic Score, and the bar between them is the gap.
function ScoreGapCatalogListRowTrack({
  game,
}: ScoreGapCatalogListRowPartProps) {
  const low = Math.min(game.playerScore, game.criticScore);
  const high = Math.max(game.playerScore, game.criticScore);

  return (
    <span className="relative mx-7 block h-4">
      <span className="sr-only">
        Player Score {game.playerScore}, Critic Score {game.criticScore}
      </span>
      <span aria-hidden>
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/15" />
        <span
          style={{ left: `${low}%`, width: `${high - low}%` }}
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-foreground transition-colors group-hover/row:bg-primary"
        />
        <span
          style={{ left: `${game.playerScore}%` }}
          className="absolute top-1/2 size-2.5 -translate-1/2 bg-foreground transition-colors group-hover/row:bg-primary"
        />
        <span
          style={{ left: `${game.criticScore}%` }}
          className="absolute top-1/2 size-2.5 -translate-1/2 border-2 border-foreground bg-background transition-colors group-hover/row:border-primary"
        />
        <span
          style={{ right: `calc(${100 - low}% + 0.75rem)` }}
          className="absolute top-1/2 -translate-y-1/2 font-heading text-xs leading-none font-semibold tabular-nums"
        >
          {low}
        </span>
        <span
          style={{ left: `calc(${high}% + 0.75rem)` }}
          className="absolute top-1/2 -translate-y-1/2 font-heading text-xs leading-none font-semibold tabular-nums"
        >
          {high}
        </span>
      </span>
    </span>
  );
}

type ScoreGapCatalogListRowProps = {
  game: ScoreGapGame;
  rank: number;
};

function ScoreGapCatalogListRow({ game, rank }: ScoreGapCatalogListRowProps) {
  return (
    <li className="border-b border-foreground/10">
      <Link
        href={`/games/${game.id}`}
        className="group/row flex items-center gap-3 py-3 outline-none transition-colors hover:bg-card focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring sm:gap-4 sm:px-3"
      >
        <span className="w-[2ch] shrink-0 font-heading text-base leading-none font-extrabold text-muted-foreground tabular-nums">
          {String(rank).padStart(2, "0")}
        </span>
        <ScoreGapCatalogListRowCover game={game} />
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <ScoreGapCatalogListRowLabel game={game} />
          <ScoreGapCatalogListRowTrack game={game} />
        </span>
      </Link>
    </li>
  );
}

type ScoreGapCatalogListProps = React.ComponentProps<"div"> & {
  name: string;
  games: ScoreGapGame[];
};

export function ScoreGapCatalogList({
  name,
  games,
  className,
  ...props
}: ScoreGapCatalogListProps) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)} {...props}>
      <h3 className="pb-3 font-heading text-base leading-tight font-extrabold uppercase">
        {name}
      </h3>
      <ol className="border-t border-foreground/10">
        {games.map((game, idx) => (
          <ScoreGapCatalogListRow key={game.id} game={game} rank={idx + 1} />
        ))}
      </ol>
    </div>
  );
}
