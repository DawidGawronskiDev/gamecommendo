import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SpotlightGame } from "../types";
import { GameScore } from "@/features/game/components/game-score";

type SpotlightCatalogHeroDetailsPartProps = {
  game: SpotlightGame;
};

function SpotlightCatalogHeroDetailsBadges({
  game,
}: SpotlightCatalogHeroDetailsPartProps) {
  const year = game.firstReleaseDate?.slice(0, 4);

  return (
    <div className="flex flex-wrap gap-1.5">
      {year && <Badge className="font-bold tabular-nums">{year}</Badge>}
      {game.genres.slice(0, 4).map((genre) => (
        <Badge
          key={genre.id}
          variant="outline"
          className="border-foreground/25 bg-background/50 font-semibold"
        >
          {genre.name}
        </Badge>
      ))}
    </div>
  );
}

function SpotlightCatalogHeroDetailsTitle({
  game,
}: SpotlightCatalogHeroDetailsPartProps) {
  const hasLongName = game.name.length > 26;

  return (
    <h2
      className={cn(
        "max-w-[18ch] font-heading font-extrabold tracking-tighter text-balance uppercase",
        hasLongName
          ? "text-[clamp(1.6rem,3.4vw,3.25rem)] leading-[0.96]"
          : "text-[clamp(2.1rem,4.8vw,4.75rem)] leading-[0.92]",
      )}
    >
      {game.name}
    </h2>
  );
}

function SpotlightCatalogHeroDetailsScore({
  game,
}: SpotlightCatalogHeroDetailsPartProps) {
  if (game.totalRating == null) return null;

  return (
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground tabular-nums">
      <GameScore rating={game.totalRating} className="size-10 text-base" />
      {game.totalRatingCount != null &&
        `${game.totalRatingCount.toLocaleString("en-US")} ratings`}
    </div>
  );
}

type SpotlightCatalogHeroDetailsProps = React.ComponentProps<"div"> & {
  game: SpotlightGame;
};

export function SpotlightCatalogHeroDetails({
  game,
  className,
  ...props
}: SpotlightCatalogHeroDetailsProps) {
  return (
    <div
      className={cn(
        "flex animate-in flex-col items-start gap-4 p-5 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fade-in slide-in-from-bottom-3 motion-reduce:animate-none md:gap-5 md:p-10",
        className,
      )}
      {...props}
    >
      <SpotlightCatalogHeroDetailsBadges game={game} />
      <SpotlightCatalogHeroDetailsTitle game={game} />

      {game.summary && (
        <p className="line-clamp-3 max-w-[60ch] text-sm leading-relaxed text-foreground/85 md:text-base">
          {game.summary}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button
          className="h-11 gap-2 px-5 text-base font-bold"
          render={<Link href={`/games/${game.id}`} />}
          nativeButton={false}
        >
          View Game
          <ArrowUpRightIcon />
        </Button>
        <SpotlightCatalogHeroDetailsScore game={game} />
      </div>
    </div>
  );
}
