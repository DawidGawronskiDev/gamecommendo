import { RecommendationGrid } from "@/features/recommendation/components/recommendation-grid";
import { cn } from "@/lib/utils";
import { ProductForDetail } from "../types";
import { ProductDetailsFacts } from "./product-details-facts";
import { ProductDetailsScreenshots } from "./product-details-screenshots";
import { ProductDetailsStage } from "./product-details-stage";

type ProductDetailsAboutProps = {
  game: ProductForDetail;
};

function ProductDetailsAbout({ game }: ProductDetailsAboutProps) {
  return (
    <div className="flex flex-col gap-8">
      {game.summary && (
        <p className="max-w-[65ch] text-base leading-relaxed text-pretty md:text-lg">
          {game.summary}
        </p>
      )}
      {game.storyline && (
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-xl leading-tight font-extrabold uppercase md:text-2xl">
            Storyline
          </h2>
          <p className="max-w-[65ch] text-sm leading-relaxed text-pretty whitespace-pre-line text-foreground/85 md:text-base">
            {game.storyline}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductDetailsRecommendations({ game }: ProductDetailsAboutProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl">
          Recommendations
        </h2>
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
          Recommendations matched by meaning: each Game&apos;s summary, genres,
          themes and keywords. Not sales, not what other people bought.
        </p>
      </div>
      <RecommendationGrid
        recommendations={game.recommendations}
        className="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
      />
    </div>
  );
}

type ProductDetailsProps = React.ComponentProps<"article"> & {
  game: ProductForDetail;
  actions?: React.ReactNode;
};

export function ProductDetails({
  game,
  actions,
  className,
  ...props
}: ProductDetailsProps) {
  const hasScreenshots = game.screenshots.length > 0;
  const hasRecommendations = game.recommendations.length > 0;

  return (
    <article
      className={cn("pt-4 pb-10 md:pt-6 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-12 px-4 md:gap-16 md:px-8">
        <div className="flex flex-col gap-8 md:gap-10">
          <ProductDetailsStage game={game} />
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <ProductDetailsAbout game={game} />
            <ProductDetailsFacts game={game} actions={actions} />
          </div>
        </div>
        {hasScreenshots && <ProductDetailsScreenshots game={game} />}
        {hasRecommendations && <ProductDetailsRecommendations game={game} />}
      </div>
    </article>
  );
}
