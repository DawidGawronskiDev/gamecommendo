import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { igdbImage } from "@/lib/igdb";
import { cn } from "@/lib/utils";
import { ProductForDetail } from "../types";
import { GameScore } from "@/features/game/components/game-score";

type ProductDetailsStagePartProps = {
  game: ProductForDetail;
};

function ProductDetailsStageBackdrop({ game }: ProductDetailsStagePartProps) {
  const screenshot = game.screenshots[0];

  return (
    <>
      {screenshot && (
        <Image
          src={igdbImage(screenshot.url, "1080p")}
          alt=""
          fill
          unoptimized
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/65 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-background/80 to-transparent to-70%" />
    </>
  );
}

function ProductDetailsStageCover({ game }: ProductDetailsStagePartProps) {
  if (!game.coverUrl) return null;

  return (
    <span
      data-game-id={game.id}
      className="relative hidden aspect-3/4 w-36 shrink-0 overflow-hidden bg-muted ring-1 ring-(color:--game-ring) sm:block lg:w-44"
    >
      <Image
        src={igdbImage(game.coverUrl, "cover_big")}
        alt=""
        fill
        unoptimized
        sizes="11rem"
        className="object-cover"
      />
    </span>
  );
}

function ProductDetailsStageBadges({ game }: ProductDetailsStagePartProps) {
  const year = game.firstReleaseDate?.slice(0, 4);

  return (
    <div className="flex flex-wrap gap-1.5">
      {year && <Badge className="font-bold tabular-nums">{year}</Badge>}
      {game.genres.slice(0, 4).map((genre) => (
        <Badge key={genre.id} variant="outline" className="font-semibold">
          {genre.name}
        </Badge>
      ))}
    </div>
  );
}

function ProductDetailsStageTitle({ game }: ProductDetailsStagePartProps) {
  const hasLongName = game.name.length > 26;

  return (
    <h1
      className={cn(
        "max-w-[20ch] font-heading font-extrabold tracking-tighter text-balance uppercase",
        hasLongName
          ? "text-[clamp(1.6rem,3.4vw,3.25rem)] leading-[0.96]"
          : "text-[clamp(2.1rem,4.8vw,4.75rem)] leading-[0.92]",
      )}
    >
      {game.name}
    </h1>
  );
}

function ProductDetailsStageScore({ game }: ProductDetailsStagePartProps) {
  if (game.totalRating == null) return null;

  return (
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground tabular-nums">
      <GameScore rating={game.totalRating} className="size-10 text-base" />
      {game.totalRatingCount != null &&
        `${game.totalRatingCount.toLocaleString("en-US")} ratings`}
    </div>
  );
}

type ProductDetailsStageProps = React.ComponentProps<"div"> & {
  game: ProductForDetail;
};

export function ProductDetailsStage({
  game,
  className,
  ...props
}: ProductDetailsStageProps) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden bg-card ring-1 ring-foreground/10 md:min-h-[32rem]",
        className,
      )}
      {...props}
    >
      <ProductDetailsStageBackdrop game={game} />
      <div className="flex items-end gap-6 p-5 md:gap-8 md:p-10">
        <ProductDetailsStageCover game={game} />
        <div className="flex min-w-0 flex-col items-start gap-4 md:gap-5">
          <ProductDetailsStageBadges game={game} />
          <ProductDetailsStageTitle game={game} />
          <ProductDetailsStageScore game={game} />
        </div>
      </div>
    </div>
  );
}
