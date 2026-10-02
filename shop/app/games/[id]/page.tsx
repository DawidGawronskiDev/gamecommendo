import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSession } from "@/features/auth/queries";
import { DismissalToggle } from "@/features/dismissal/components/dismissal-toggle";
import { getDismissedGameIds } from "@/features/dismissal/queries";
import { FavouriteToggle } from "@/features/favourite/components/favourite-toggle";
import { getFavouriteGameIds } from "@/features/favourite/queries";
import { LibraryToggle } from "@/features/library/components/library-toggle";
import { getLibraryGameIds } from "@/features/library/queries";
import { ProductDetails } from "@/features/product/components/product-details";
import { getProductById } from "@/features/product/queries";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

const getGame = cache(async (id: string) => {
  const gameId = Number(id);
  if (!Number.isInteger(gameId)) return null;

  return getProductById(gameId);
});

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { id } = await params;
  const game = await getGame(id);

  if (!game) {
    return { title: "Game not found | gamecommendo" };
  }

  return {
    title: `${game.name} | gamecommendo`,
    description: game.summary?.slice(0, 160),
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = await getGame(id);

  if (!game) {
    notFound();
  }

  const [session, libraryGameIds, favouriteGameIds, dismissedGameIds] =
    await Promise.all([
      getSession(),
      getLibraryGameIds(),
      getFavouriteGameIds(),
      getDismissedGameIds(),
    ]);
  const isMember = session !== null;

  return (
    <ProductDetails
      game={game}
      actions={
        <>
          <FavouriteToggle
            gameId={game.id}
            isFavourite={favouriteGameIds.includes(game.id)}
            isMember={isMember}
          />
          <LibraryToggle
            gameId={game.id}
            isInLibrary={libraryGameIds.includes(game.id)}
            isMember={isMember}
          />
          <DismissalToggle
            gameId={game.id}
            isDismissed={dismissedGameIds.includes(game.id)}
            isMember={isMember}
          />
        </>
      }
    />
  );
}
