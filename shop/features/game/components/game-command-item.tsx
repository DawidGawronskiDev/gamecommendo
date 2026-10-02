import Image from "next/image";

import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { GameForCard } from "../types";

type GameCommandItemProps = React.ComponentProps<typeof CommandItem> & {
  game: GameForCard;
};

export function GameCommandItem({
  game,
  className,
  ...props
}: GameCommandItemProps) {
  return (
    <CommandItem
      value={String(game.id)}
      className={cn("gap-3", className)}
      {...props}
    >
      <span
        data-game-id={game.id}
        className="relative aspect-3/4 w-8 shrink-0 overflow-hidden bg-muted ring-1 ring-(color:--game-ring)"
      >
        {game.coverUrl && (
          <Image
            src={game.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="2rem"
            className="object-cover"
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-heading text-sm leading-snug font-semibold">
          {game.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground tabular-nums">
          {[game.firstReleaseDate?.slice(0, 4), game.genres?.[0]?.name]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
    </CommandItem>
  );
}
