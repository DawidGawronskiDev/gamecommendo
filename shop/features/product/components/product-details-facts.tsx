import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ProductForDetail } from "../types";

const formatReleaseDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const formatRating = (rating: number | null, count: number | null) => {
  if (rating == null) return null;

  return [
    Math.round(rating),
    count != null && `${count.toLocaleString("en-US")} ratings`,
  ]
    .filter(Boolean)
    .join(" · ");
};

const joinNames = (items: { name: string }[]) =>
  items.map((item) => item.name).join(", ") || null;

type ProductDetailsFactsRowProps = {
  label: string;
  value: string | null;
};

function ProductDetailsFactsRow({ label, value }: ProductDetailsFactsRowProps) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-foreground/10 py-3">
      <dt className="pt-0.5 text-[0.625rem] leading-normal font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed tabular-nums">{value}</dd>
    </div>
  );
}

type ProductDetailsFactsProps = React.ComponentProps<"div"> & {
  game: ProductForDetail;
  actions?: React.ReactNode;
};

export function ProductDetailsFacts({
  game,
  actions,
  className,
  ...props
}: ProductDetailsFactsProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      <dl className="border-t border-foreground/10">
        <ProductDetailsFactsRow
          label="Released"
          value={
            game.firstReleaseDate && formatReleaseDate(game.firstReleaseDate)
          }
        />
        <ProductDetailsFactsRow label="Genres" value={joinNames(game.genres)} />
        <ProductDetailsFactsRow label="Themes" value={joinNames(game.themes)} />
        <ProductDetailsFactsRow
          label="Platforms"
          value={joinNames(game.platforms)}
        />
        <ProductDetailsFactsRow
          label="Game modes"
          value={joinNames(game.gameModes)}
        />
        <ProductDetailsFactsRow
          label="Perspectives"
          value={joinNames(game.playerPerspectives)}
        />
        <ProductDetailsFactsRow
          label="Players"
          value={formatRating(game.rating, game.ratingCount)}
        />
        <ProductDetailsFactsRow
          label="Critics"
          value={formatRating(
            game.aggregatedRating,
            game.aggregatedRatingCount,
          )}
        />
        <ProductDetailsFactsRow
          label="Keywords"
          value={joinNames(game.keywords.slice(0, 12))}
        />
      </dl>
      <div className="flex flex-wrap gap-2">
        {actions}
        <Button
          variant="outline"
          render={<Link href={`/map?game=${game.id}`} />}
          nativeButton={false}
        >
          Show on map
        </Button>
        <Button
          variant="outline"
          render={<Link href={`/blend?a=${game.id}`} />}
          nativeButton={false}
        >
          Blend with another
        </Button>
        {game.url && (
          <Button
            variant="outline"
            render={<a href={game.url} target="_blank" rel="noreferrer" />}
            nativeButton={false}
          >
            View on IGDB
            <ArrowUpRightIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
