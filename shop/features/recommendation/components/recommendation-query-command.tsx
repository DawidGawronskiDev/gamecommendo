"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GameCommandItem } from "@/features/game/components/game-command-item";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { queryGames } from "../queries";
import { Recommendation } from "../types";

const EXAMPLE_QUERIES = [
  "cozy farming game with co-op",
  "dark fantasy with punishing combat",
  "space exploration and trading",
];

type RecommendationQueryStatus = "idle" | "loading" | "done" | "error";

type RecommendationQueryCommandTriggerProps = React.ComponentProps<"button">;

function RecommendationQueryCommandTrigger({
  className,
  ...props
}: RecommendationQueryCommandTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 items-center gap-2 bg-card px-3 text-sm text-muted-foreground ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-72",
        className,
      )}
      {...props}
    >
      <MagnifyingGlassIcon className="size-4 shrink-0" />
      <span className="sr-only sm:hidden">Describe a Game</span>
      <span className="hidden sm:inline">Describe a Game</span>
      <kbd className="ml-auto hidden font-heading text-[0.625rem] font-semibold tracking-widest uppercase sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}

type RecommendationQueryCommandExamplesProps = {
  onExampleSelect: (query: string) => void;
};

function RecommendationQueryCommandExamples({
  onExampleSelect,
}: RecommendationQueryCommandExamplesProps) {
  return (
    <CommandGroup heading="Try">
      {EXAMPLE_QUERIES.map((query) => (
        <CommandItem
          key={query}
          value={query}
          onSelect={() => onExampleSelect(query)}
        >
          {query}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

type RecommendationQueryCommandResultsProps = {
  games: Recommendation[];
  isStale: boolean;
  onGameSelect: (game: Recommendation) => void;
};

function RecommendationQueryCommandResults({
  games,
  isStale,
  onGameSelect,
}: RecommendationQueryCommandResultsProps) {
  return (
    <CommandGroup
      heading="Closest by meaning"
      className={cn("transition-opacity", isStale && "opacity-50")}
    >
      {games.map((game) => (
        <GameCommandItem
          key={game.id}
          game={game}
          onSelect={() => onGameSelect(game)}
        />
      ))}
    </CommandGroup>
  );
}

type RecommendationQueryCommandMessageProps = React.ComponentProps<"p">;

function RecommendationQueryCommandMessage({
  className,
  ...props
}: RecommendationQueryCommandMessageProps) {
  return (
    <p
      role="status"
      className={cn("px-4.5 py-6 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function RecommendationQueryCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RecommendationQueryStatus>("idle");
  const [games, setGames] = useState<Recommendation[]>([]);
  const requestRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
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
        const results = await queryGames(value);
        if (request !== requestRef.current) return;
        setGames(results);
        setStatus("done");
      } catch {
        if (request !== requestRef.current) return;
        setGames([]);
        setStatus("error");
      }
    }, 300);
  };

  const handleGameSelect = (game: Recommendation) => {
    setOpen(false);
    router.push(`/games/${game.id}`);
  };

  const hasGames = games.length > 0;

  return (
    <>
      <RecommendationQueryCommandTrigger onClick={() => setOpen(true)} />
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Describe a Game"
        description="Describe a Game and get the ten closest by meaning."
        className="sm:max-w-xl!"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={handleQueryChange}
            placeholder="Describe a Game…"
          />
          <CommandList className="max-h-[min(28rem,60vh)]!">
            {status === "idle" && (
              <RecommendationQueryCommandExamples
                onExampleSelect={handleQueryChange}
              />
            )}
            {hasGames && (
              <RecommendationQueryCommandResults
                games={games}
                isStale={status === "loading"}
                onGameSelect={handleGameSelect}
              />
            )}
            {status === "loading" && !hasGames && (
              <RecommendationQueryCommandMessage>
                Matching by meaning…
              </RecommendationQueryCommandMessage>
            )}
            {status === "done" && !hasGames && (
              <RecommendationQueryCommandMessage>
                No Games match that. Try describing it differently.
              </RecommendationQueryCommandMessage>
            )}
            {status === "error" && (
              <RecommendationQueryCommandMessage>
                Recommendations are unavailable right now. Try again in a
                moment.
              </RecommendationQueryCommandMessage>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
