import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { DismissedGame } from "../types";
import { DismissalRestoreButton } from "./dismissal-restore-button";

type DismissalSectionProps = React.ComponentProps<"section"> & {
  dismissedGames: DismissedGame[];
};

export function DismissalSection({
  dismissedGames,
  className,
  ...props
}: DismissalSectionProps) {
  const gameCount = dismissedGames.length;
  const hasGames = gameCount > 0;

  return (
    <section
      aria-labelledby="dismissal-heading"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <h2
          id="dismissal-heading"
          className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-4xl"
        >
          Dismissed
        </h2>
        <p className="max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
          Games you marked as not interested. They are left out of every
          Recommendation, and nothing else: you can still find them by browsing,
          on the Map or by describing them. Restore one to have it recommended
          again.
        </p>
      </div>
      <p
        role="status"
        className="border-t border-foreground/10 pt-5 text-sm text-muted-foreground tabular-nums"
      >
        {gameCount.toLocaleString("en-US")} {gameCount === 1 ? "Game" : "Games"}
      </p>
      {hasGames ? (
        <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6 xl:grid-cols-8">
          {dismissedGames.map((game) => (
            <li key={game.id} className="flex min-w-0 flex-col gap-2">
              <GameCard game={game} />
              <DismissalRestoreButton gameId={game.id} className="self-start" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Nothing dismissed. Use the cross on a Game under Recommended for you,
          or Not interested on its page.
        </p>
      )}
    </section>
  );
}
