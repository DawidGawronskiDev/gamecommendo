import { Metadata } from "next";

import { getPopularGames } from "@/features/catalog/queries";
import { DesignSection } from "@/features/design/components/design-section";

export const metadata: Metadata = {
  title: "Design | gamecommendo",
  description:
    "The colors, type and controls the shop is built from. Pick a Palette and see it change.",
};

export default async function DesignPage() {
  const games = await getPopularGames();

  return <DesignSection games={games} />;
}
