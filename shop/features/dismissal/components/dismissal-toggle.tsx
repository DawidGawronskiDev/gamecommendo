"use client";

import { Button } from "@/components/ui/button";
import { GameMarkToggle } from "@/features/game/components/game-mark-toggle";
import { GameId } from "@/features/game/types";
import { ArrowCounterClockwiseIcon, ProhibitIcon } from "@phosphor-icons/react";
import { dismissGame, restoreGame } from "../queries";

type DismissalToggleProps = React.ComponentProps<typeof Button> & {
  gameId: GameId;
  isDismissed: boolean;
  isMember: boolean;
};

export function DismissalToggle({
  isDismissed,
  ...props
}: DismissalToggleProps) {
  return (
    <GameMarkToggle
      isMarked={isDismissed}
      labels={{
        add: "Not interested",
        remove: "Dismissed · Restore",
        visitor: "Log in to dismiss",
      }}
      icons={{
        add: <ProhibitIcon />,
        remove: <ArrowCounterClockwiseIcon />,
      }}
      onAdd={dismissGame}
      onRemove={restoreGame}
      {...props}
    />
  );
}
