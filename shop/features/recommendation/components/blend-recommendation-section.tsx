"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameScore } from "@/features/game/components/game-score";
import { GameForCard, GameId, GameWithGenres } from "@/features/game/types";
import { igdbImage } from "@/lib/igdb";
import { cn } from "@/lib/utils";
import {
  ArrowUpRightIcon,
  DiceFiveIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Recommendation } from "../types";
import { BlendRecommendationPicker } from "./blend-recommendation-picker";

type BlendSide = "a" | "b";

const sharedGenres = (blend: Recommendation, pick: GameWithGenres) =>
  blend.genres
    .filter((genre) => pick.genres.some((other) => other.id === genre.id))
    .map((genre) => genre.name);

const BLEND_WIDTH =
  "mx-auto w-[min(100%,calc((100dvh-23rem)*0.75))] min-w-52 lg:w-full";

type BlendRecommendationSectionPickProps = React.ComponentProps<"div"> & {
  game: GameWithGenres | null;
  label: string;
  onChoose: () => void;
};

function BlendRecommendationSectionPick({
  game,
  label,
  onChoose,
  className,
  ...props
}: BlendRecommendationSectionPickProps) {
  if (!game) {
    return (
      <div className={cn("min-w-0", className)} {...props}>
        <button
          type="button"
          onClick={onChoose}
          className="flex w-full items-center gap-3 bg-card p-3 text-left text-muted-foreground ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:aspect-3/4 lg:flex-col lg:justify-center lg:text-center"
        >
          <PlusIcon className="size-5 shrink-0 lg:size-6" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            {label}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 lg:flex-col lg:items-stretch",
        className,
      )}
      {...props}
    >
      <Link
        href={`/games/${game.id}`}
        aria-label={game.name}
        data-game-id={game.id}
        className="relative block aspect-3/4 w-14 shrink-0 overflow-hidden bg-muted ring-1 ring-(color:--game-ring) outline-none transition-shadow hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-ring lg:w-full"
      >
        {game.coverUrl && (
          <Image
            src={game.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 14rem, 3.5rem"
            className="object-cover"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <div className="min-w-0">
          <p className="line-clamp-2 font-heading text-sm leading-snug font-semibold">
            {game.name}
          </p>
          <p className="hidden truncate text-xs text-muted-foreground tabular-nums lg:block">
            {[game.firstReleaseDate?.slice(0, 4), game.genres[0]?.name]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <Button variant="outline" size="xs" onClick={onChoose}>
          Change
        </Button>
      </div>
    </div>
  );
}

type BlendRecommendationSectionResultProps = {
  blend: Recommendation;
  first: GameWithGenres;
  second: GameWithGenres;
  seenCount: number;
  blendCount: number;
  onRoll: () => void;
};

function BlendRecommendationSectionResult({
  blend,
  first,
  second,
  seenCount,
  blendCount,
  onRoll,
}: BlendRecommendationSectionResultProps) {
  const year = blend.firstReleaseDate?.slice(0, 4);
  const canRoll = blendCount > 1;
  const shared = [
    { game: first, genres: sharedGenres(blend, first) },
    { game: second, genres: sharedGenres(blend, second) },
  ].filter((item) => item.genres.length > 0);

  return (
    <div className={cn("flex flex-col gap-4", BLEND_WIDTH)}>
      <div className="relative isolate aspect-3/4 overflow-hidden bg-muted ring-2 ring-primary">
        {blend.coverUrl && (
          <Image
            key={blend.id}
            src={igdbImage(blend.coverUrl, "cover_big")}
            alt=""
            fill
            unoptimized
            preload
            sizes="(min-width: 1024px) 30rem, 100vw"
            className="-z-10 animate-in object-cover duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fade-in motion-reduce:animate-none"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-linear-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
          <div
            key={blend.id}
            className="flex min-w-0 animate-in flex-col gap-2 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
          >
            <div className="flex flex-wrap gap-1.5">
              {year && <Badge className="font-bold tabular-nums">{year}</Badge>}
              {blend.genres.slice(0, 2).map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <h2 className="font-heading text-xl leading-[0.95] font-extrabold tracking-tighter text-balance uppercase md:text-3xl">
              <Link
                href={`/games/${blend.id}`}
                className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {blend.name}
              </Link>
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <p
              role="status"
              className="text-xs text-foreground/85 tabular-nums"
            >
              {seenCount} of {blendCount}
            </p>
            <Button
              size="lg"
              onClick={onRoll}
              disabled={!canRoll}
              className="gap-2 px-4"
            >
              <DiceFiveIcon
                style={{ rotate: `${seenCount * 180}deg` }}
                className="size-4 transition-[rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              />
              Roll
            </Button>
          </div>
        </div>
      </div>
      <div key={blend.id} className="flex flex-col gap-3">
        {blend.totalRating != null && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground tabular-nums">
            <GameScore rating={blend.totalRating} className="size-9 text-sm" />
            {blend.totalRatingCount != null &&
              `${blend.totalRatingCount.toLocaleString("en-US")} ratings`}
          </div>
        )}
        {blend.summary && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/85">
            {blend.summary}
          </p>
        )}
        {shared.length > 0 && (
          <dl className="flex flex-col gap-1 border-t border-foreground/10 pt-3 text-sm">
            {shared.map(({ game, genres }) => (
              <div key={game.id} className="flex flex-wrap gap-x-2">
                <dt className="text-muted-foreground">
                  Shares with {game.name}:
                </dt>
                <dd>{genres.join(", ")}</dd>
              </div>
            ))}
          </dl>
        )}
        <Button
          variant="outline"
          className="self-start"
          render={<Link href={`/games/${blend.id}`} />}
          nativeButton={false}
        >
          View Game
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  );
}

type BlendRecommendationSectionPlaceholderProps = {
  children: React.ReactNode;
};

function BlendRecommendationSectionPlaceholder({
  children,
}: BlendRecommendationSectionPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex aspect-3/4 flex-col items-center justify-center gap-4 bg-card px-6 text-center ring-1 ring-foreground/10",
        BLEND_WIDTH,
      )}
    >
      <DiceFiveIcon className="size-8 text-muted-foreground" />
      <p className="max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

type BlendRecommendationSectionLeanProps = {
  first: GameWithGenres;
  second: GameWithGenres;
  value: number;
  onValueChange: (value: number) => void;
};

function BlendRecommendationSectionLean({
  first,
  second,
  value,
  onValueChange,
}: BlendRecommendationSectionLeanProps) {
  const closer = value === 50 ? null : value < 50 ? first : second;
  const description = closer
    ? `${Math.abs(value - 50) * 2}% toward ${closer.name}`
    : "Evenly between both";

  return (
    <div className={cn("flex flex-col gap-1.5", BLEND_WIDTH)}>
      <input
        type="range"
        min={0}
        max={100}
        step={10}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        aria-label="Which Game the Blend leans toward"
        aria-valuetext={description}
        className="h-4 w-full cursor-pointer appearance-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-foreground/30 [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-foreground/30 [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary"
      />
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            value < 50 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {first.name}
        </span>
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {description.replace(/ toward .*/, "")}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-right",
            value > 50 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {second.name}
        </span>
      </div>
    </div>
  );
}

type BlendRecommendationSectionBlendProps = {
  blends: Recommendation[];
  first: GameWithGenres;
  second: GameWithGenres;
};

function BlendRecommendationSectionBlend({
  blends,
  first,
  second,
}: BlendRecommendationSectionBlendProps) {
  const [shown, setShown] = useState([0]);

  const blend = blends[shown[shown.length - 1]];

  const handleRoll = () => {
    const unseen = blends
      .map((_, index) => index)
      .filter((index) => !shown.includes(index));
    const pool = unseen.length
      ? unseen
      : blends
          .map((_, index) => index)
          .filter((index) => index !== shown[shown.length - 1]);
    const next = pool[Math.floor(Math.random() * pool.length)];

    setShown(unseen.length ? [...shown, next] : [next]);
  };

  if (!blend) {
    return (
      <BlendRecommendationSectionPlaceholder>
        No Game was found between these two. Change one of them and try again.
      </BlendRecommendationSectionPlaceholder>
    );
  }

  return (
    <BlendRecommendationSectionResult
      blend={blend}
      first={first}
      second={second}
      seenCount={shown.length}
      blendCount={blends.length}
      onRoll={handleRoll}
    />
  );
}

type BlendRecommendationSectionProps = React.ComponentProps<"section"> & {
  first: GameWithGenres | null;
  second: GameWithGenres | null;
  blends: Recommendation[];
  lean: number;
  suggestions: GameForCard[];
};

export function BlendRecommendationSection({
  first,
  second,
  blends,
  lean,
  suggestions,
  className,
  ...props
}: BlendRecommendationSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [pickingSide, setPickingSide] = useState<BlendSide | null>(null);
  const [position, setPosition] = useState(lean);
  const navigate = (next: { a?: GameId; b?: GameId; lean?: number }) => {
    const values = { a: first?.id, b: second?.id, lean: position, ...next };
    const params = new URLSearchParams();
    if (values.a) params.set("a", String(values.a));
    if (values.b) params.set("b", String(values.b));
    if (values.lean !== 50) params.set("lean", String(values.lean));

    startTransition(() => {
      router.replace(`${pathname}?${params}`, { scroll: false });
    });
  };

  const handleGameSelect = (gameId: GameId) => {
    setPickingSide(null);
    navigate({ [pickingSide ?? "a"]: gameId });
  };

  const handleLeanChange = (value: number) => {
    setPosition(value);
    navigate({ lean: value });
  };

  return (
    <section
      aria-labelledby="blend-heading"
      aria-busy={isPending}
      className={cn("pt-8 pb-10 md:pt-12 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 pb-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-8">
          <h1
            id="blend-heading"
            className="font-heading text-3xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-5xl"
          >
            Blend
          </h1>
          <p className="hidden max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:block md:text-right">
            Choose two Games. The one in the middle is the Recommendation that
            sits between them in meaning. Slide to lean it toward one of them,
            roll for another.
          </p>
        </div>
        <div
          className={cn(
            "grid grid-cols-2 items-start gap-x-3 gap-y-5 transition-opacity lg:grid-cols-[minmax(0,14rem)_minmax(13rem,min(30rem,calc((100dvh-18rem)*0.75)))_minmax(0,14rem)] lg:justify-center lg:gap-x-12",
            isPending && "opacity-50",
          )}
        >
          <BlendRecommendationSectionPick
            game={first}
            label="Choose the first Game"
            onChoose={() => setPickingSide("a")}
            className="lg:mt-16"
          />
          <div className="order-last col-span-2 min-w-0 lg:order-none lg:col-span-1 lg:self-start">
            {first && second ? (
              <div className="flex flex-col gap-4">
                <BlendRecommendationSectionLean
                  first={first}
                  second={second}
                  value={position}
                  onValueChange={handleLeanChange}
                />
                <BlendRecommendationSectionBlend
                  key={lean}
                  blends={blends}
                  first={first}
                  second={second}
                />
              </div>
            ) : (
              <BlendRecommendationSectionPlaceholder>
                Choose two Games and the Recommendation between them appears
                here.
              </BlendRecommendationSectionPlaceholder>
            )}
          </div>
          <BlendRecommendationSectionPick
            game={second}
            label="Choose the second Game"
            onChoose={() => setPickingSide("b")}
            className="lg:mt-16"
          />
        </div>
      </div>
      <BlendRecommendationPicker
        key={pickingSide}
        open={pickingSide !== null}
        suggestions={suggestions}
        excludedGameId={(pickingSide === "a" ? second?.id : first?.id) ?? null}
        onGameSelect={handleGameSelect}
        onClose={() => setPickingSide(null)}
      />
    </section>
  );
}
