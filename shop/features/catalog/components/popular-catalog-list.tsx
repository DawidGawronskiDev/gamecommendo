import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PopularGame } from "../types";
import { GameScore } from "@/features/game/components/game-score";

type PopularCatalogListRowPartProps = {
  game: PopularGame;
};

function PopularCatalogListRowCover({ game }: PopularCatalogListRowPartProps) {
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

function PopularCatalogListRowLabel({ game }: PopularCatalogListRowPartProps) {
  return (
    <span className="min-w-0 flex-1">
      <span className="line-clamp-2 font-heading text-sm leading-snug font-semibold transition-colors group-hover/row:text-primary sm:line-clamp-1">
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

function PopularCatalogListRowPopularity({
  game,
}: PopularCatalogListRowPartProps) {
  return (
    <span className="flex shrink-0 flex-col items-end">
      <span className="text-sm leading-snug font-semibold tabular-nums">
        {(game.totalRatingCount ?? 0).toLocaleString("en-US")}
      </span>
      <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
        ratings
      </span>
    </span>
  );
}

type PopularCatalogListRowProps = {
  game: PopularGame;
  rank: number;
};

function PopularCatalogListRow({ game, rank }: PopularCatalogListRowProps) {
  const isPodium = rank <= 3;

  return (
    <li className="border-b border-foreground/10">
      <Link
        href={`/games/${game.id}`}
        className="group/row flex items-center gap-3 py-3 outline-none transition-colors hover:bg-card focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring sm:gap-4 sm:px-3"
      >
        <span
          className={cn(
            "w-[2ch] shrink-0 font-heading text-xl leading-none font-extrabold tabular-nums sm:text-2xl",
            isPodium ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {String(rank).padStart(2, "0")}
        </span>
        <PopularCatalogListRowCover game={game} />
        <PopularCatalogListRowLabel game={game} />
        <PopularCatalogListRowPopularity game={game} />
        {game.totalRating != null && (
          <GameScore rating={game.totalRating} className="size-8 text-sm" />
        )}
      </Link>
    </li>
  );
}

type PopularCatalogListProps = React.ComponentProps<"ol"> & {
  popularGames: PopularGame[];
};

export function PopularCatalogList({
  popularGames,
  className,
  ...props
}: PopularCatalogListProps) {
  return (
    <ol className={cn("border-t border-foreground/10", className)} {...props}>
      {popularGames.map((game, idx) => (
        <PopularCatalogListRow key={game.id} game={game} rank={idx + 1} />
      ))}
    </ol>
  );
}
