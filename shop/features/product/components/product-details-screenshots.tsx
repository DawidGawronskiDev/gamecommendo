import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { igdbImage } from "@/lib/igdb";
import { cn } from "@/lib/utils";
import { ProductForDetail } from "../types";

type ProductDetailsScreenshotsProps = React.ComponentProps<typeof Carousel> & {
  game: ProductForDetail;
};

export function ProductDetailsScreenshots({
  game,
  className,
  ...props
}: ProductDetailsScreenshotsProps) {
  return (
    <Carousel
      opts={{ align: "start" }}
      aria-label="Screenshots"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-xl leading-tight font-extrabold uppercase md:text-2xl">
          Screenshots
        </h2>
        <div className="flex gap-1.5">
          <CarouselPrevious className="static! my-0!" />
          <CarouselNext className="static! my-0!" />
        </div>
      </div>
      <CarouselContent className="-ml-3 md:-ml-4">
        {game.screenshots.map((screenshot, idx) => (
          <CarouselItem
            key={screenshot.id}
            className="basis-[85%] pl-3 sm:basis-1/2 md:pl-4 lg:basis-1/3"
          >
            <div className="relative aspect-video overflow-hidden bg-muted ring-1 ring-foreground/10 ring-inset">
              <Image
                src={igdbImage(screenshot.url, "720p")}
                alt={`${game.name} screenshot ${idx + 1}`}
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
