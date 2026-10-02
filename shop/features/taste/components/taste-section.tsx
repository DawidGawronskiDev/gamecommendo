import Link from "next/link";

import { cn } from "@/lib/utils";
import { Taste, TasteDimension, TasteResult } from "../types";

const percent = (share: number) => `${Math.round(share * 100)}%`;

type TasteSectionDimensionProps = {
  dimension: TasteDimension;
};

function TasteSectionDimension({ dimension }: TasteSectionDimensionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
        {dimension.name}
      </h3>
      <ul className="flex flex-col">
        {dimension.items.map((item) => {
          const label = (
            <span className="truncate font-heading text-sm font-semibold">
              {item.name}
            </span>
          );

          return (
            <li
              key={item.name}
              className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_2.5rem] items-center gap-3 border-b border-foreground/10 py-2.5"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex min-w-0 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              ) : (
                label
              )}
              <span
                role="img"
                aria-label={`${percent(item.share)} of your Library, ${percent(item.catalogShare)} of the Catalog`}
                className="relative h-1.5 bg-foreground/10"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: percent(item.share) }}
                />
                <span
                  className="absolute -inset-y-1 w-px bg-muted-foreground"
                  style={{ left: percent(item.catalogShare) }}
                />
              </span>
              <span className="text-right text-sm text-muted-foreground tabular-nums">
                {percent(item.share)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type TasteSectionSummaryProps = {
  taste: Taste;
};

function TasteSectionSummary({ taste }: TasteSectionSummaryProps) {
  const hasDistinctive = taste.distinctive.length > 0;
  const hasFavouriteGenres = taste.favouriteGenres.length > 0;
  const popularityRatio = taste.popularity.library / taste.popularity.catalog;

  return (
    <dl className="grid gap-x-10 gap-y-5 border-y border-foreground/10 py-5 text-sm leading-relaxed md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          More than usual
        </dt>
        <dd>
          {hasDistinctive
            ? taste.distinctive.map((item, idx) => (
                <span key={item.name}>
                  {idx > 0 && ", "}
                  {item.name}{" "}
                  <span className="text-muted-foreground tabular-nums">
                    {item.lift.toFixed(1)}×
                  </span>
                </span>
              ))
            : "Nothing stands out: your Library is close to the Catalog as a whole."}
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Score and Popularity
        </dt>
        <dd className="tabular-nums">
          Average Score {Math.round(taste.score.library)}{" "}
          <span className="text-muted-foreground">
            (Catalog {Math.round(taste.score.catalog)})
          </span>
          . Your Games have {popularityRatio.toFixed(1)}× the ratings of an
          average Game.
        </dd>
      </div>
      {hasFavouriteGenres && (
        <div className="flex flex-col gap-1">
          <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Your Favourites lean
          </dt>
          <dd>{taste.favouriteGenres.join(", ")}</dd>
        </div>
      )}
    </dl>
  );
}

type TasteSectionProps = React.ComponentProps<"section"> & {
  result: TasteResult;
};

export function TasteSection({
  result,
  className,
  ...props
}: TasteSectionProps) {
  const { taste, gameCount, minGameCount } = result;

  return (
    <section
      aria-labelledby="taste-heading"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <h2
          id="taste-heading"
          className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-4xl"
        >
          Taste
        </h2>
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          {taste ? (
            <>
              What the{" "}
              <span className="tabular-nums">
                {gameCount.toLocaleString("en-US")}
              </span>{" "}
              Games in your Library have in common. Each bar is the share of
              your Library; the mark on it is the share across the whole
              Catalog, so a bar reaching past its mark is something you have
              more of than usual.
            </>
          ) : (
            <>
              Add at least {minGameCount} Games to your Library to see your
              Taste. You have <span className="tabular-nums">{gameCount}</span>.{" "}
              <Link
                href="/profile"
                className="text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Go to your Library
              </Link>
            </>
          )}
        </p>
      </div>
      {taste && (
        <>
          <TasteSectionSummary taste={taste} />
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {taste.dimensions.map((dimension) => (
              <TasteSectionDimension
                key={dimension.name}
                dimension={dimension}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
