"use client";

import { useRef, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { GameCommandItem } from "@/features/game/components/game-command-item";
import { searchGamesByName } from "@/features/game/queries";
import { GameForCard, GameId, GameWithGenres } from "@/features/game/types";
import { cn } from "@/lib/utils";

const NAME_DELAY = 250;

type BlendRecommendationPickerStatus = "idle" | "loading" | "done" | "error";

type BlendRecommendationPickerProps = {
  open: boolean;
  suggestions: GameForCard[];
  excludedGameId: GameId | null;
  onGameSelect: (gameId: GameId) => void;
  onClose: () => void;
};

export function BlendRecommendationPicker({
  open,
  suggestions,
  excludedGameId,
  onGameSelect,
  onClose,
}: BlendRecommendationPickerProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<BlendRecommendationPickerStatus>("idle");
  const [games, setGames] = useState<GameWithGenres[]>([]);
  const requestRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleNameChange = (value: string) => {
    setName(value);
    clearTimeout(timerRef.current);
    const request = ++requestRef.current;

    if (value.trim().length < 2) {
      setStatus("idle");
      setGames([]);
      return;
    }

    setStatus("loading");
    timerRef.current = setTimeout(async () => {
      try {
        const results = await searchGamesByName(value);
        if (request !== requestRef.current) return;
        setGames(results);
        setStatus("done");
      } catch {
        if (request !== requestRef.current) return;
        setGames([]);
        setStatus("error");
      }
    }, NAME_DELAY);
  };

  const isIdle = status === "idle";
  const listed = (isIdle ? suggestions : games).filter(
    (game) => game.id !== excludedGameId,
  );
  const hasListed = listed.length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title="Choose a Game"
      description="Search the Catalog by name and choose a Game to blend."
      className="sm:max-w-xl!"
    >
      <Command shouldFilter={false}>
        <CommandInput
          value={name}
          onValueChange={handleNameChange}
          placeholder="Search by name…"
        />
        <CommandList className="max-h-[min(28rem,60vh)]!">
          {hasListed && (
            <CommandGroup
              heading={isIdle ? "Most popular" : "Games"}
              className={cn(
                "transition-opacity",
                status === "loading" && "opacity-50",
              )}
            >
              {listed.map((game) => (
                <GameCommandItem
                  key={game.id}
                  game={game}
                  onSelect={() => onGameSelect(game.id)}
                />
              ))}
            </CommandGroup>
          )}
          {status === "loading" && !hasListed && (
            <p
              role="status"
              className="px-4.5 py-6 text-sm text-muted-foreground"
            >
              Searching…
            </p>
          )}
          {status === "done" && !hasListed && (
            <p
              role="status"
              className="px-4.5 py-6 text-sm text-muted-foreground"
            >
              No Game by that name. Check the spelling or try fewer letters.
            </p>
          )}
          {status === "error" && (
            <p
              role="status"
              className="px-4.5 py-6 text-sm text-muted-foreground"
            >
              Search is unavailable right now. Try again in a moment.
            </p>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
