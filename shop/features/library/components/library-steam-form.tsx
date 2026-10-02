"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowsClockwiseIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@phosphor-icons/react";
import { syncSteamLibrary } from "../queries";
import { SteamSyncResult } from "../types";

const formatSyncedAt = (date: Date) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const describeResult = ({
  ownedCount,
  matchedCount,
  addedCount,
}: SteamSyncResult) =>
  `Steam reported ${ownedCount.toLocaleString("en-US")} games. ${matchedCount.toLocaleString("en-US")} are in the Catalog, ${addedCount.toLocaleString("en-US")} new to your Library.`;

type LibrarySteamFormProps = React.ComponentProps<"form"> & {
  steamId: string | null;
  syncedAt: Date | null;
};

export function LibrarySteamForm({
  steamId,
  syncedAt,
  className,
  ...props
}: LibrarySteamFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SteamSyncResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(steamId === null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const steamInput = String(new FormData(event.currentTarget).get("steam"));

    setResult(null);
    setMessage(null);
    startTransition(async () => {
      try {
        setResult(await syncSteamLibrary(steamInput));
        router.refresh();
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="steam"
          className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
        >
          Steam ID
        </label>
        <div className="flex items-end gap-3">
          <Input
            key={steamId}
            id="steam"
            name="steam"
            type={isVisible ? "text" : "password"}
            data-1p-ignore
            data-lpignore="true"
            defaultValue={steamId ?? ""}
            placeholder="76561198000000000"
            autoComplete="off"
            spellCheck={false}
            required
            maxLength={200}
            aria-describedby="steam-hint"
            className="tabular-nums"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isVisible ? "Hide Steam ID" : "Show Steam ID"}
            aria-pressed={isVisible}
            aria-controls="steam"
            onClick={() => setIsVisible(!isVisible)}
            className="shrink-0"
          >
            {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </Button>
          <Button type="submit" disabled={isPending} className="shrink-0">
            <ArrowsClockwiseIcon
              className={cn(
                isPending && "animate-spin motion-reduce:animate-none",
              )}
            />
            {isPending ? "Syncing…" : "Sync"}
          </Button>
        </div>
        <p
          id="steam-hint"
          className="text-xs leading-relaxed text-muted-foreground"
        >
          The 17-digit ID, your profile link, or your custom name. Game details
          must be public in Steam. Syncing only adds Games, it never removes
          any.
        </p>
      </div>
      {result && (
        <p role="status" className="text-sm leading-relaxed">
          {describeResult(result)}
        </p>
      )}
      {message && (
        <p role="alert" className="text-sm leading-relaxed text-destructive">
          {message}
        </p>
      )}
      {syncedAt && !result && !message && (
        <p className="text-xs text-muted-foreground tabular-nums">
          Last synced {formatSyncedAt(syncedAt)}
        </p>
      )}
    </form>
  );
}
