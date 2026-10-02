import Image from "next/image";

import { igdbImage } from "@/lib/igdb";
import { cn } from "@/lib/utils";
import { SpotlightGame } from "../types";
import { SpotlightCatalogHeroDetails } from "./spotlight-catalog-hero-details";

type SpotlightCatalogHeroScreenshotProps = {
  game: SpotlightGame;
  isCurrent: boolean;
  preload: boolean;
};

function SpotlightCatalogHeroScreenshot({
  game,
  isCurrent,
  preload,
}: SpotlightCatalogHeroScreenshotProps) {
  const screenshot = game.screenshots[0];
  if (!screenshot) return null;

  return (
    <Image
      src={igdbImage(screenshot.url, "1080p")}
      alt=""
      fill
      unoptimized
      preload={preload}
      sizes="(min-width: 1024px) 75vw, 100vw"
      className={cn(
        "-z-20 object-cover transition-opacity ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        isCurrent
          ? "-z-10 opacity-100 duration-700"
          : "opacity-0 delay-700 duration-0",
      )}
    />
  );
}

function SpotlightCatalogHeroScrim() {
  return (
    <>
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-background/80 to-transparent to-70%" />
    </>
  );
}

type SpotlightCatalogHeroProps = React.ComponentProps<"div"> & {
  spotlightGames: SpotlightGame[];
  currentGameIdx: number;
};

export function SpotlightCatalogHero({
  spotlightGames,
  currentGameIdx,
  className,
  ...props
}: SpotlightCatalogHeroProps) {
  const game = spotlightGames[currentGameIdx];

  return (
    <div
      className={cn(
        "relative isolate flex min-h-[30rem] flex-col justify-end overflow-hidden bg-card ring-1 ring-foreground/10 md:min-h-[34rem] lg:min-h-[37rem]",
        className,
      )}
      {...props}
    >
      {spotlightGames.map((spotlightGame, idx) => (
        <SpotlightCatalogHeroScreenshot
          key={spotlightGame.id}
          game={spotlightGame}
          isCurrent={idx === currentGameIdx}
          preload={idx === 0}
        />
      ))}
      <SpotlightCatalogHeroScrim />

      <SpotlightCatalogHeroDetails key={game.id} game={game} />
    </div>
  );
}
