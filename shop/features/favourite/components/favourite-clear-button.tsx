"use client";

import { ConfirmButton } from "@/components/confirm-button";
import { clearFavourites } from "../queries";

export function FavouriteClearButton() {
  return (
    <ConfirmButton
      title="Clear your Favourites?"
      description="Every Game is removed from your Favourites. Your Library is kept. This cannot be undone."
      confirmLabel="Clear Favourites"
      action={clearFavourites}
    >
      Clear Favourites
    </ConfirmButton>
  );
}
