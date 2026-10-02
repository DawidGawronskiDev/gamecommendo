"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { GameId } from "@/features/game/types";
import { cn } from "@/lib/utils";
import { XIcon } from "@phosphor-icons/react";
import { dismissGame } from "../queries";

type DismissalButtonProps = React.ComponentProps<"button"> & {
  gameId: GameId;
  gameName: string;
};

export function DismissalButton({
  gameId,
  gameName,
  className,
  ...props
}: DismissalButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await dismissGame(gameId);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      aria-label={`Not interested in ${gameName}`}
      title="Not interested"
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "grid size-8 place-items-center bg-background text-foreground ring-1 ring-foreground/15 outline-none transition-[opacity,background-color] hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <XIcon className="size-4" />
    </button>
  );
}
