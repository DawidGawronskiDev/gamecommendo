"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { igdbImage } from "@/lib/igdb";
import {
  ArrowUpRightIcon,
  CalendarBlankIcon,
  GameControllerIcon,
} from "@phosphor-icons/react";
import { getProductById } from "../queries";
import { GameId } from "@/features/game/types";
import { ProductForDetail } from "../types";
import { GameScore } from "@/features/game/components/game-score";

const formatReleaseDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const joinNames = (items: { name: string }[]) =>
  items.map((item) => item.name).join(", ");

type ProductQuickViewPartProps = {
  game: ProductForDetail;
};

function ProductQuickViewImages({ game }: ProductQuickViewPartProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const hasScreenshots = game.screenshots.length > 0;

  if (!hasScreenshots) {
    return (
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {game.coverUrl && (
          <Image
            src={igdbImage(game.coverUrl, "cover_big")}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 768px) 32rem, 100vw"
            className="object-contain"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Carousel setApi={setApi} aria-label="Screenshots" className="group">
        <CarouselContent className="ml-0!">
          {game.screenshots.map((screenshot, idx) => (
            <CarouselItem key={screenshot.id} className="pl-0!">
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <Image
                  src={igdbImage(screenshot.url, "720p")}
                  alt={`${game.name} screenshot ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 32rem, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3! bg-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-0!" />
        <CarouselNext className="right-3! bg-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-0!" />
      </Carousel>
      <div className="flex gap-2 overflow-x-auto p-0.5 [scrollbar-width:none]">
        {game.screenshots.map((screenshot, idx) => (
          <button
            key={screenshot.id}
            type="button"
            aria-label={`Show screenshot ${idx + 1}`}
            aria-current={idx === current}
            onClick={() => api?.scrollTo(idx)}
            className="relative aspect-video w-20 shrink-0 overflow-hidden bg-muted opacity-60 ring-1 ring-foreground/10 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring aria-current:opacity-100 aria-current:ring-2 aria-current:ring-primary"
          >
            <Image
              src={igdbImage(screenshot.url, "screenshot_med")}
              alt=""
              fill
              unoptimized
              sizes="5rem"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductQuickViewFacts({ game }: ProductQuickViewPartProps) {
  const hasPlatforms = game.platforms.length > 0;

  if (!game.firstReleaseDate && !hasPlatforms) return null;

  return (
    <ul className="flex flex-col gap-2 border-y border-foreground/10 py-4">
      {game.firstReleaseDate && (
        <li className="flex items-start gap-2.5">
          <CalendarBlankIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="tabular-nums">
            Released {formatReleaseDate(game.firstReleaseDate)}
          </span>
        </li>
      )}
      {hasPlatforms && (
        <li className="flex items-start gap-2.5">
          <GameControllerIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>{joinNames(game.platforms)}</span>
        </li>
      )}
    </ul>
  );
}

type ProductQuickViewSectionsProps = {
  game: ProductForDetail;
  onGameSelect: (gameId: GameId, name: string) => void;
};

function ProductQuickViewSections({
  game,
  onGameSelect,
}: ProductQuickViewSectionsProps) {
  const details = [
    { label: "Genres", value: joinNames(game.genres) },
    { label: "Themes", value: joinNames(game.themes) },
    { label: "Game modes", value: joinNames(game.gameModes) },
    { label: "Perspectives", value: joinNames(game.playerPerspectives) },
  ].filter((detail) => detail.value);
  const hasDetails = details.length > 0;
  const hasRecommendations = game.recommendations.length > 0;

  return (
    <Accordion
      multiple
      defaultValue={["summary"]}
      className="border-y border-foreground/10"
    >
      {game.summary && (
        <AccordionItem value="summary">
          <AccordionTrigger className="tracking-widest uppercase hover:no-underline">
            Summary
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-relaxed text-pretty text-foreground/85">
              {game.summary}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}
      {game.storyline && (
        <AccordionItem value="storyline">
          <AccordionTrigger className="tracking-widest uppercase hover:no-underline">
            Storyline
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-relaxed text-pretty whitespace-pre-line text-foreground/85">
              {game.storyline}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}
      {hasDetails && (
        <AccordionItem value="details">
          <AccordionTrigger className="tracking-widest uppercase hover:no-underline">
            Details
          </AccordionTrigger>
          <AccordionContent>
            <dl className="flex flex-col gap-2">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"
                >
                  <dt className="pt-0.5 text-[0.625rem] leading-normal font-semibold tracking-widest text-muted-foreground uppercase">
                    {detail.label}
                  </dt>
                  <dd className="leading-relaxed">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      )}
      {hasRecommendations && (
        <AccordionItem value="recommendations">
          <AccordionTrigger className="tracking-widest uppercase hover:no-underline">
            Recommendations
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col">
              {game.recommendations.slice(0, 6).map((recommendation) => (
                <li key={recommendation.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onGameSelect(recommendation.id, recommendation.name)
                    }
                    className="flex w-full items-baseline justify-between gap-4 py-1.5 text-left outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate font-heading font-semibold">
                      {recommendation.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {recommendation.firstReleaseDate?.slice(0, 4)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

function ProductQuickViewSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading Game"
      className="flex flex-col gap-4"
    >
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

type ProductQuickViewBodyProps = {
  gameId: GameId;
  actions?: React.ReactNode;
  name: string;
  onGameSelect: (gameId: GameId, name: string) => void;
};

function ProductQuickViewBody({
  gameId,
  actions,
  name,
  onGameSelect,
}: ProductQuickViewBodyProps) {
  const [game, setGame] = useState<ProductForDetail | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    getProductById(gameId)
      .then((result) => {
        if (isCancelled) return;
        if (result) setGame(result);
        else setHasFailed(true);
      })
      .catch(() => {
        if (!isCancelled) setHasFailed(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [gameId]);

  const year = game?.firstReleaseDate?.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:h-[min(44rem,calc(100dvh-2.5rem))] md:grid-cols-2">
      <div className="flex flex-col justify-center overflow-hidden bg-card p-5 md:p-8">
        {game ? (
          <ProductQuickViewImages game={game} />
        ) : (
          <Skeleton className="aspect-4/3 w-full" />
        )}
      </div>
      <div className="flex flex-col gap-6 p-5 md:overflow-y-auto md:p-8">
        <div className="flex flex-col gap-3 pr-10">
          {game && (
            <div className="flex flex-wrap gap-1.5">
              {year && <Badge className="font-bold tabular-nums">{year}</Badge>}
              {game.genres.slice(0, 3).map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
          <DialogTitle className="text-2xl leading-[0.95] font-extrabold tracking-tighter text-balance md:text-3xl">
            {name}
          </DialogTitle>
        </div>
        {hasFailed && (
          <p role="status" className="text-muted-foreground">
            This Game could not be loaded. Open its page to try again.
          </p>
        )}
        {!game && !hasFailed && <ProductQuickViewSkeleton />}
        {game && (
          <>
            {game.totalRating != null && (
              <div className="flex items-center gap-2.5 text-muted-foreground tabular-nums">
                <GameScore
                  rating={game.totalRating}
                  className="size-10 text-base"
                />
                {game.totalRatingCount != null &&
                  `${game.totalRatingCount.toLocaleString("en-US")} ratings`}
              </div>
            )}
            <ProductQuickViewFacts game={game} />
          </>
        )}
        <div className="flex flex-col gap-2.5">
          <Button
            size="lg"
            className="w-full"
            render={<Link href={`/games/${gameId}`} />}
            nativeButton={false}
          >
            View Game
          </Button>
          {actions}
          {game?.url && (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              render={<a href={game.url} target="_blank" rel="noreferrer" />}
              nativeButton={false}
            >
              View on IGDB
              <ArrowUpRightIcon />
            </Button>
          )}
        </div>
        {game && (
          <ProductQuickViewSections game={game} onGameSelect={onGameSelect} />
        )}
      </div>
    </div>
  );
}

type ProductQuickViewProps = {
  game: { id: GameId; name: string } | null;
  actions?: React.ReactNode;
  onGameSelect: (gameId: GameId, name: string) => void;
  onClose: () => void;
};

export function ProductQuickView({
  game,
  actions,
  onGameSelect,
  onClose,
}: ProductQuickViewProps) {
  return (
    <Dialog
      open={game !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0! overflow-y-auto p-0! sm:max-w-5xl! md:overflow-hidden">
        {game && (
          <ProductQuickViewBody
            key={game.id}
            gameId={game.id}
            actions={actions}
            name={game.name}
            onGameSelect={onGameSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
