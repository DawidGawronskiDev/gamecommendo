"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { CursorTextIcon } from "@phosphor-icons/react";
import { queryGames } from "../queries";
import { Recommendation } from "../types";

const EXAMPLE_QUERIES = [
  "cozy farming game with co-op",
  "dark fantasy with punishing combat",
  "space exploration and trading",
];

type RecommendationQueryStatus = "idle" | "loading" | "done" | "error";

type RecommendationQueryCommandTriggerProps = React.ComponentProps<"button">;

const subscribeToPlatform = () => () => {};
const getIsApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

function RecommendationQueryCommandTrigger({
  className,
  ...props
}: RecommendationQueryCommandTriggerProps) {
  const isApple = useSyncExternalStore(
    subscribeToPlatform,
    getIsApple,
    () => false,
  );

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      className={cn(
        "flex h-11 min-w-0 items-center gap-2 bg-card px-2.5 text-xs text-muted-foreground sm:px-3 sm:text-sm ring-1 ring-foreground/50 outline-none transition-colors hover:bg-muted hover:text-foreground hover:ring-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <CursorTextIcon className="hidden size-4 shrink-0 sm:block" />
      <span className="truncate">Describe a Game</span>
      <kbd
        aria-hidden
        className="ml-auto hidden font-heading text-[0.625rem] font-semibold tracking-widest whitespace-nowrap uppercase lg:inline"
      >
        {isApple ? "⌘ K" : "Ctrl K"}
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

type RecommendationQueryCommandProps = {
  className?: string;
};

export function RecommendationQueryCommand({
  className,
}: RecommendationQueryCommandProps) {
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
      <RecommendationQueryCommandTrigger
        aria-expanded={open}
        className={className}
        onClick={() => setOpen(true)}
      />
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
