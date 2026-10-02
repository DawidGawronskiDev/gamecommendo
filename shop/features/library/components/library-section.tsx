import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { Library } from "../types";
import { LibraryClearButton } from "./library-clear-button";
import { LibrarySteamForm } from "./library-steam-form";

type LibrarySectionProps = React.ComponentProps<"section"> & {
  library: Library;
};

export function LibrarySection({
  library,
  className,
  ...props
}: LibrarySectionProps) {
  const gameCount = library.games.length;
  const hasGames = gameCount > 0;

  return (
    <section
      aria-labelledby="library-heading"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="flex flex-col gap-3">
          <h2
            id="library-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-4xl"
          >
            Library
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            The Games you own. Sync them from Steam, or add any Game from its
            page. They carry a <span className="text-library">blue</span>{" "}
            outline across the shop and show in blue on the Map.
          </p>
        </div>
        <LibrarySteamForm
          steamId={library.steamId}
          syncedAt={library.syncedAt}
        />
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
            <LibraryClearButton />
          </div>
        )}
      </div>
      {hasGames ? (
        <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6 xl:grid-cols-8">
          {library.games.map((game) => (
            <li key={game.id} className="min-w-0">
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Your Library is empty. Enter your Steam ID above, or open a Game and
          choose Add to Library.
        </p>
      )}
    </section>
  );
}
