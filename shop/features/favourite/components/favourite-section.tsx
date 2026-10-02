import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { Favourite } from "../types";
import { FavouriteClearButton } from "./favourite-clear-button";

type FavouriteSectionProps = React.ComponentProps<"section"> & {
  favourites: Favourite[];
};

export function FavouriteSection({
  favourites,
  className,
  ...props
}: FavouriteSectionProps) {
  const gameCount = favourites.length;
  const hasGames = gameCount > 0;

  return (
    <section
      aria-labelledby="favourite-heading"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <h2
          id="favourite-heading"
          className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-4xl"
        >
          Favourites
        </h2>
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          The Games you love, whether you own them or not. They carry a{" "}
          <span className="text-favourite">pink</span> outline across the shop
          and show in pink on the Map.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-5">
        <p role="status" className="text-sm text-muted-foreground tabular-nums">
          {gameCount.toLocaleString("en-US")}{" "}
          {gameCount === 1 ? "Game" : "Games"}
        </p>
        {hasGames && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/map" />}
              nativeButton={false}
            >
              See on the Map
            </Button>
            <FavouriteClearButton />
          </div>
        )}
      </div>
      {hasGames ? (
        <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6 xl:grid-cols-8">
          {favourites.map((game) => (
            <li key={game.id} className="min-w-0">
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          No Favourites yet. Open a Game and choose Add to Favourites.
        </p>
      )}
    </section>
  );
}
