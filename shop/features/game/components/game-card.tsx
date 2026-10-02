import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { GameForCard } from "../types";

type GameCardProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  game: GameForCard;
};

export function GameCard({ game, className, ...props }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.id}`}
      className={cn("group/card flex flex-col gap-2 outline-none", className)}
      {...props}
    >
      <span
        data-game-id={game.id}
        className="relative block aspect-3/4 overflow-hidden bg-muted ring-1 ring-(color:--game-ring) transition-shadow group-hover/card:ring-2 group-hover/card:ring-primary group-focus-visible/card:ring-2 group-focus-visible/card:ring-primary"
      >
        {game.coverUrl && (
          <Image
            src={game.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 13vw, (min-width: 640px) 16vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105 motion-reduce:transition-none"
          />
        )}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="line-clamp-2 font-heading text-sm leading-snug font-semibold">
          {game.name}
        </span>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {[game.firstReleaseDate?.slice(0, 4), game.genres?.[0]?.name]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
    </Link>
  );
}
