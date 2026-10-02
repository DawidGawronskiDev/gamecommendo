"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GameId } from "../types";

type GameMarkToggleProps = React.ComponentProps<typeof Button> & {
  gameId: GameId;
  isMarked: boolean;
  isMember: boolean;
  labels: { add: string; remove: string; visitor: string };
  icons: { add: React.ReactNode; remove: React.ReactNode };
  onAdd: (gameId: GameId) => Promise<void>;
  onRemove: (gameId: GameId) => Promise<void>;
};

export function GameMarkToggle({
  gameId,
  isMarked,
  isMember,
  labels,
  icons,
  onAdd,
  onRemove,
  ...props
}: GameMarkToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!isMember) {
    return (
      <Button
        variant="outline"
        render={<Link href="/login" />}
        nativeButton={false}
        {...props}
      >
        {icons.add}
        {labels.visitor}
      </Button>
    );
  }

  const handleClick = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        await (isMarked ? onRemove(gameId) : onAdd(gameId));
        router.refresh();
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        aria-pressed={isMarked}
        disabled={isPending}
        onClick={handleClick}
        {...props}
      >
        {isMarked ? icons.remove : icons.add}
        {isMarked ? labels.remove : labels.add}
      </Button>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </>
  );
}
