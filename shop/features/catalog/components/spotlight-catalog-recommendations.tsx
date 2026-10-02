import { RecommendationGrid } from "@/features/recommendation/components/recommendation-grid";
import { cn } from "@/lib/utils";
import { SpotlightGame } from "../types";

function SpotlightCatalogRecommendationsIntro() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-heading text-xl leading-tight font-extrabold text-balance uppercase md:text-2xl">
        Recommendations
      </h3>
      <p className="max-w-[45ch] text-sm leading-relaxed text-muted-foreground">
        Recommendations matched by meaning: each Game&apos;s summary, genres,
        themes and keywords. Not sales, not what other people bought.
      </p>
    </div>
  );
}

type SpotlightCatalogRecommendationsProps = React.ComponentProps<"div"> & {
  game: SpotlightGame;
};

export function SpotlightCatalogRecommendations({
  game,
  className,
  ...props
}: SpotlightCatalogRecommendationsProps) {
  return (
    <div
      className={cn(
        "grid gap-x-10 gap-y-5 lg:grid-cols-[16rem_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <SpotlightCatalogRecommendationsIntro />
      <RecommendationGrid
        key={game.id}
        recommendations={game.recommendations}
        className="grid-cols-3 sm:grid-cols-6"
      />
    </div>
  );
}
