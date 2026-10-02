import type { getFavourites } from "./queries";

export type Favourite = Awaited<ReturnType<typeof getFavourites>>[number];
