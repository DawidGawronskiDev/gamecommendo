import { cn } from "@/lib/utils";
import { CATALOG_SCORE_GAP_FLOOR } from "../data";
import { ScoreGapGames } from "../types";
import { ScoreGapCatalogList } from "./score-gap-catalog-list";

type ScoreGapCatalogSectionProps = React.ComponentProps<"section"> & {
  scoreGapGames: ScoreGapGames;
};

export function ScoreGapCatalogSection({
  scoreGapGames,
  className,
  ...props
}: ScoreGapCatalogSectionProps) {
  const { playersHigher, criticsHigher } = scoreGapGames;
  const hasGames = playersHigher.length > 0 || criticsHigher.length > 0;

  if (!hasGames) return null;

  return (
    <section
      aria-labelledby="score-gap-games-heading"
      className={cn("pt-12 pb-10 md:pt-16 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-6">
          <h2
            id="score-gap-games-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            Players vs critics
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            Where the Player Score and the Critic Score sit furthest apart. Only
            Games with at least {CATALOG_SCORE_GAP_FLOOR.playerRatings} player
            ratings and {CATALOG_SCORE_GAP_FLOOR.criticReviews} critic reviews
            on IGDB.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 pb-6 text-[0.625rem] leading-none font-semibold tracking-widest uppercase">
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 bg-foreground" />
            Player Score
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 border-2 border-foreground bg-background"
            />
            Critic Score
          </li>
        </ul>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {playersHigher.length > 0 && (
            <ScoreGapCatalogList
              name="Players rate higher"
              games={playersHigher}
            />
          )}
          {criticsHigher.length > 0 && (
            <ScoreGapCatalogList
              name="Critics rate higher"
              games={criticsHigher}
            />
          )}
        </div>
      </div>
    </section>
  );
}
