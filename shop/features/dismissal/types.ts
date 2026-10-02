import type { getDismissedGames } from "./queries";

export type DismissedGame = Awaited<
  ReturnType<typeof getDismissedGames>
>[number];
