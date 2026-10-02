"use client";

import { Button } from "@/components/ui/button";
import { GameMarkToggle } from "@/features/game/components/game-mark-toggle";
import { GameId } from "@/features/game/types";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import { addToLibrary, removeFromLibrary } from "../queries";

type LibraryToggleProps = React.ComponentProps<typeof Button> & {
  gameId: GameId;
  isInLibrary: boolean;
  isMember: boolean;
};

export function LibraryToggle({ isInLibrary, ...props }: LibraryToggleProps) {
  return (
    <GameMarkToggle
      isMarked={isInLibrary}
      labels={{
        add: "Add to Library",
        remove: "In Library · Remove",
        visitor: "Log in to add to Library",
      }}
      icons={{
        add: <PlusIcon />,
        remove: <CheckIcon className="text-library" />,
      }}
      onAdd={addToLibrary}
      onRemove={removeFromLibrary}
      {...props}
    />
  );
}
