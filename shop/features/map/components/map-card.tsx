import Image from "next/image";

import { cn } from "@/lib/utils";
import { MapData, MapNode } from "../types";
import { GameScore } from "@/features/game/components/game-score";

type MapCardProps = React.ComponentProps<"div"> & {
  data: MapData;
  node: MapNode;
  isPinned: boolean;
  isInLibrary: boolean;
  isFavourite: boolean;
  onQuickView: () => void;
};

export function MapCard({
  data,
  node,
  isPinned,
  isInLibrary,
  isFavourite,
  onQuickView,
  className,
  ...props
}: MapCardProps) {
  const [id, , , name, cover, year, score, ratingCount, genreMask, neighbours] =
    node;
  const genres = data.genres.filter((_, bit) => genreMask & (1 << bit));

  return (
    <div
      className={cn(
        "absolute z-10 flex w-72 gap-3 bg-popover p-3 text-popover-foreground ring-1 ring-foreground/15",
        !isPinned && "pointer-events-none",
        className,
      )}
      {...props}
    >
      <span
        data-game-id={id}
        className="relative aspect-3/4 w-20 shrink-0 self-start overflow-hidden bg-muted ring-1 ring-(color:--game-ring)"
      >
        {cover && (
          <Image
            src={`${data.coverPrefix}${cover}`}
            alt=""
            fill
            unoptimized
            sizes="5rem"
            className="object-cover"
          />
        )}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <div>
          <p className="line-clamp-2 font-heading text-sm leading-snug font-semibold">
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground tabular-nums">
            {[year, ...genres.slice(0, 2)].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          {score != null && (
            <GameScore rating={score} className="size-7 text-xs" />
          )}
          {ratingCount.toLocaleString("en-US")} ratings
        </div>
        {isFavourite && (
          <p className="text-xs font-semibold text-favourite">A Favourite</p>
        )}
        {isInLibrary && (
          <p className="text-xs font-semibold text-library">In your Library</p>
        )}
        <div>
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Neighbours
          </p>
          <ul className="text-xs leading-relaxed">
            {neighbours.map((neighbour) => (
              <li key={neighbour} className="truncate">
                {data.nodes[neighbour][3]}
              </li>
            ))}
          </ul>
        </div>
        {isPinned && (
          <button
            type="button"
            onClick={onQuickView}
            className="self-start text-xs font-semibold tracking-widest uppercase underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
}
