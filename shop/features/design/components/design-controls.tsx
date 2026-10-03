"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CATALOG_SORTS } from "@/features/catalog/data";
import { PopularGame } from "@/features/catalog/types";
import { ArrowUpRightIcon, HeartIcon } from "@phosphor-icons/react";
import { DesignSpecimen } from "./design-specimen";

type DesignControlsProps = {
  game?: PopularGame;
};

const toYear = (game: PopularGame) => game.firstReleaseDate?.slice(0, 4);

export function DesignControls({ game }: DesignControlsProps) {
  return (
    <>
      <DesignSpecimen name="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>View Game</Button>
          <Button variant="outline">
            View on IGDB
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="secondary">Add to Library</Button>
          <Button variant="ghost">Not interested</Button>
          <Button variant="destructive">Clear Library</Button>
          <Button variant="link">Browse all</Button>
          <Button disabled>Unavailable</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Add to Favourites"
                />
              }
            >
              <HeartIcon />
            </TooltipTrigger>
            <TooltipContent>Add to Favourites</TooltipContent>
          </Tooltip>
        </div>
      </DesignSpecimen>

      <DesignSpecimen name="Badges">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="font-bold tabular-nums">
            {(game && toYear(game)) ?? "2013"}
          </Badge>
          {(game?.genres ?? []).slice(0, 3).map((genre) => (
            <Badge key={genre.id} variant="outline">
              {genre.name}
            </Badge>
          ))}
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Removed</Badge>
        </div>
      </DesignSpecimen>

      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        <DesignSpecimen name="Field">
          <Input
            aria-label="Game name"
            placeholder="Game name"
            className="max-w-sm"
          />
        </DesignSpecimen>
        <DesignSpecimen name="Select">
          <Select items={CATALOG_SORTS} defaultValue={CATALOG_SORTS[0].value}>
            <SelectTrigger aria-label="Sort Games" className="w-full max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CATALOG_SORTS.map((sort) => (
                  <SelectItem key={sort.value} value={sort.value}>
                    {sort.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </DesignSpecimen>
        <DesignSpecimen name="Tabs">
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="favourites">Favourites</TabsTrigger>
              <TabsTrigger value="taste">Taste</TabsTrigger>
            </TabsList>
            <TabsContent
              value="library"
              className="text-sm text-muted-foreground"
            >
              The Games a Member owns.
            </TabsContent>
            <TabsContent
              value="favourites"
              className="text-sm text-muted-foreground"
            >
              The Games a Member loves, owned or not.
            </TabsContent>
            <TabsContent
              value="taste"
              className="text-sm text-muted-foreground"
            >
              What a Library has more of than the Catalog does.
            </TabsContent>
          </Tabs>
        </DesignSpecimen>
        <DesignSpecimen name="Dialog">
          <Dialog>
            <DialogTrigger
              render={<Button variant="outline" className="w-fit" />}
            >
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nothing here is for sale</DialogTitle>
                <DialogDescription>
                  gamecommendo is a fake game shop. No prices, no cart, no
                  checkout.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </DesignSpecimen>
      </div>

      {game && (
        <DesignSpecimen name="Accordion">
          <Accordion defaultValue={["summary"]} className="max-w-[68ch]">
            <AccordionItem value="summary">
              <AccordionTrigger>Summary</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {game.summary}
              </AccordionContent>
            </AccordionItem>
            {game.storyline && (
              <AccordionItem value="storyline">
                <AccordionTrigger>Storyline</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {game.storyline}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </DesignSpecimen>
      )}
    </>
  );
}
