import { Metadata } from "next";

import { getSession } from "@/features/auth/queries";
import { getDismissedGameIds } from "@/features/dismissal/queries";
import { getFavouriteGameIds } from "@/features/favourite/queries";
import { getLibraryGameIds } from "@/features/library/queries";
import { MapView } from "@/features/map/components/map-view";

export const metadata: Metadata = {
  title: "Map | gamecommendo",
  description:
    "Every Game in the Catalog placed by the meaning of its Game Profile, joined to its closest Games.",
};

export default async function MapPage() {
  const [session, libraryGameIds, favouriteGameIds, dismissedGameIds] =
    await Promise.all([
      getSession(),
      getLibraryGameIds(),
      getFavouriteGameIds(),
      getDismissedGameIds(),
    ]);

  return (
    <MapView
      libraryGameIds={libraryGameIds}
      favouriteGameIds={favouriteGameIds}
      dismissedGameIds={dismissedGameIds}
      isMember={session !== null}
    />
  );
}
