"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GameId } from "@/features/game/types";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { restoreGame } from "../queries";

type DismissalRestoreButtonProps = React.ComponentProps<typeof Button> & {
  gameId: GameId;
};

export function DismissalRestoreButton({
  gameId,
  ...props
}: DismissalRestoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await restoreGame(gameId);
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="xs"
      disabled={isPending}
      onClick={handleClick}
      {...props}
    >
      <ArrowCounterClockwiseIcon />
      Restore
    </Button>
  );
}
