"use client";

import { ConfirmButton } from "@/components/confirm-button";
import { clearLibrary } from "../queries";

export function LibraryClearButton() {
  return (
    <ConfirmButton
      title="Clear your Library?"
      description="Every Game is removed from your Library. Your Favourites are kept. You can sync from Steam again afterwards."
      confirmLabel="Clear Library"
      action={clearLibrary}
    >
      Clear Library
    </ConfirmButton>
  );
}
