import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthAccount } from "@/features/auth/components/auth-account";
import { AuthProfileTabs } from "@/features/auth/components/auth-profile-tabs";
import { getSession } from "@/features/auth/queries";
import { DismissalSection } from "@/features/dismissal/components/dismissal-section";
import { getDismissedGames } from "@/features/dismissal/queries";
import { FavouriteSection } from "@/features/favourite/components/favourite-section";
import { getFavourites } from "@/features/favourite/queries";
import { LibrarySection } from "@/features/library/components/library-section";
import { getLibrary } from "@/features/library/queries";
import { TasteSection } from "@/features/taste/components/taste-section";
import { getTaste } from "@/features/taste/queries";

export const metadata: Metadata = {
  title: "Profile | gamecommendo",
};

type ProfilePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [{ show }, library, favourites, dismissedGames] = await Promise.all([
    searchParams,
    getLibrary(),
    getFavourites(),
    getDismissedGames(),
  ]);
  const isShowingFavourites = show === "favourites";
  const isShowingTaste = show === "taste";
  const isShowingDismissed = show === "dismissed";
  const tasteResult = isShowingTaste ? await getTaste() : null;

  return (
    <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-10 px-4 pt-8 pb-10 md:gap-12 md:px-8 md:pt-12 md:pb-14">
      <AuthAccount name={session.user.name} email={session.user.email} />
      <AuthProfileTabs
        tabs={[
          {
            name: "Library",
            href: "/profile",
            count: library.games.length,
            isCurrent:
              !isShowingFavourites && !isShowingTaste && !isShowingDismissed,
          },
          {
            name: "Favourites",
            href: "/profile?show=favourites",
            count: favourites.length,
            isCurrent: isShowingFavourites,
          },
          {
            name: "Dismissed",
            href: "/profile?show=dismissed",
            count: dismissedGames.length,
            isCurrent: isShowingDismissed,
          },
          {
            name: "Taste",
            href: "/profile?show=taste",
            isCurrent: isShowingTaste,
          },
        ]}
      />
      {tasteResult ? (
        <TasteSection result={tasteResult} />
      ) : isShowingDismissed ? (
        <DismissalSection dismissedGames={dismissedGames} />
      ) : isShowingFavourites ? (
        <FavouriteSection favourites={favourites} />
      ) : (
        <LibrarySection library={library} />
      )}
    </div>
  );
}
