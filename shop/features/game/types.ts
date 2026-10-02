import type { games } from "@/db/schema";
import type { getGamesByIds } from "./queries";

export type GameId = (typeof games.$inferSelect)["id"];

export type GameForCard = Pick<
  typeof games.$inferSelect,
  "id" | "name" | "coverUrl" | "firstReleaseDate"
> & {
  genres?: { name: string }[];
};

export type GameWithGenres = Awaited<ReturnType<typeof getGamesByIds>>[number];
