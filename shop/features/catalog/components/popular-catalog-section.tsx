import { cn } from "@/lib/utils";
import { PopularGame } from "../types";
import { PopularCatalogList } from "./popular-catalog-list";

type PopularCatalogSectionProps = React.ComponentProps<"section"> & {
  popularGames: PopularGame[];
};

export function PopularCatalogSection({
  popularGames,
  className,
  ...props
}: PopularCatalogSectionProps) {
  const hasPopularGames = popularGames.length > 0;

  if (!hasPopularGames) return null;

  return (
    <section
      aria-labelledby="popular-games-heading"
      className={cn("pt-12 pb-10 md:pt-16 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-6">
          <h2
            id="popular-games-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            Most popular
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            Ranked by Popularity: the number of IGDB ratings from players and
            critics combined.
          </p>
        </div>
        <PopularCatalogList popularGames={popularGames} />
      </div>
    </section>
  );
}
