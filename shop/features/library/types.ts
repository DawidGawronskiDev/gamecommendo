import type { getLibrary, syncSteamLibrary } from "./queries";

export type Library = Awaited<ReturnType<typeof getLibrary>>;

export type SteamSyncResult = Awaited<ReturnType<typeof syncSteamLibrary>>;
