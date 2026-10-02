import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { catalogPageHref } from "../data";
import { CatalogFilterOptions, CatalogFilters, CatalogPage } from "../types";
import { BrowseCatalogFilters } from "./browse-catalog-filters";

type BrowseCatalogResultsProps = {
  catalogPage: CatalogPage;
};

function BrowseCatalogResults({ catalogPage }: BrowseCatalogResultsProps) {
  const hasGames = catalogPage.games.length > 0;

  if (!hasGames) {
    return (
      <div className="flex flex-col items-start gap-4 border-y border-foreground/10 py-12">
        <p className="font-heading text-xl leading-tight font-extrabold uppercase md:text-2xl">
          No Games match these filters
        </p>
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Loosen a filter or clear them all. To find a Game by what it is like
          rather than by name, describe it in the header instead.
        </p>
        <Button
          variant="outline"
          render={<Link href="/browse" />}
          nativeButton={false}
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:gap-x-4 lg:grid-cols-4 xl:grid-cols-6">
      {catalogPage.games.map((game) => (
        <li key={game.id} className="min-w-0">
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}

type BrowseCatalogPaginationProps = {
  filters: CatalogFilters;
  pageCount: number;
};

function BrowseCatalogPagination({
  filters,
  pageCount,
}: BrowseCatalogPaginationProps) {
  const hasPrevious = filters.page > 1;
  const hasNext = filters.page < pageCount;

  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Catalog pages"
      className="flex items-center justify-between gap-4 border-t border-foreground/10 pt-5"
    >
      <Button
        variant="outline"
        disabled={!hasPrevious}
        render={
          hasPrevious ? (
            <Link href={catalogPageHref(filters, filters.page - 1)} />
          ) : undefined
        }
        nativeButton={!hasPrevious}
      >
        <CaretLeftIcon />
        Previous
      </Button>
      <p className="text-sm text-muted-foreground tabular-nums">
        Page {filters.page.toLocaleString("en-US")} of{" "}
        {pageCount.toLocaleString("en-US")}
      </p>
      <Button
        variant="outline"
        disabled={!hasNext}
        render={
          hasNext ? (
            <Link href={catalogPageHref(filters, filters.page + 1)} />
          ) : undefined
        }
        nativeButton={!hasNext}
      >
        Next
        <CaretRightIcon />
      </Button>
    </nav>
  );
}

type BrowseCatalogSectionProps = React.ComponentProps<"section"> & {
  filters: CatalogFilters;
  filterOptions: CatalogFilterOptions;
  catalogPage: CatalogPage;
};

export function BrowseCatalogSection({
  filters,
  filterOptions,
  catalogPage,
  className,
  ...props
}: BrowseCatalogSectionProps) {
  return (
    <section
      aria-labelledby="browse-catalog-heading"
      className={cn("pt-8 pb-10 md:pt-12 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-8">
          <h1
            id="browse-catalog-heading"
            className="font-heading text-3xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-5xl"
          >
            Catalog
          </h1>
          <p
            role="status"
            className="text-sm text-muted-foreground tabular-nums"
          >
            {catalogPage.gameCount.toLocaleString("en-US")}{" "}
            {catalogPage.gameCount === 1 ? "Game" : "Games"}
          </p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <BrowseCatalogFilters
            filters={filters}
            filterOptions={filterOptions}
            className="lg:sticky lg:top-20 lg:self-start"
          />
          <div className="flex min-w-0 flex-col gap-8">
            <BrowseCatalogResults catalogPage={catalogPage} />
            <BrowseCatalogPagination
              filters={filters}
              pageCount={catalogPage.pageCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
