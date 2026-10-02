import { games } from "@/db/schema";
import type { getGamesWithScreenshots } from "./queries";

export type SelectedGame = typeof games.$inferSelect;

export type GameWithScreenshots = Awaited<
  ReturnType<typeof getGamesWithScreenshots>
>[number];
