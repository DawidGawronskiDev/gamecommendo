"use client";

import { Button } from "@/components/ui/button";
import { GameMarkToggle } from "@/features/game/components/game-mark-toggle";
import { GameId } from "@/features/game/types";
import { HeartIcon } from "@phosphor-icons/react";
import { addToFavourites, removeFromFavourites } from "../queries";

type FavouriteToggleProps = React.ComponentProps<typeof Button> & {
  gameId: GameId;
  isFavourite: boolean;
  isMember: boolean;
};

export function FavouriteToggle({
  isFavourite,
  ...props
}: FavouriteToggleProps) {
  return (
    <GameMarkToggle
      isMarked={isFavourite}
      labels={{
        add: "Add to Favourites",
        remove: "Favourite · Remove",
        visitor: "Log in to add to Favourites",
      }}
      icons={{
        add: <HeartIcon />,
        remove: <HeartIcon weight="fill" className="text-favourite" />,
      }}
      onAdd={addToFavourites}
      onRemove={removeFromFavourites}
      {...props}
    />
  );
}
