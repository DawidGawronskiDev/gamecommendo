const STEAM_API = "https://api.steampowered.com";

const steamKey = () => {
  const key = process.env.STEAM_API_KEY;
  if (!key) throw new Error("STEAM_API_KEY is not set");
  return key;
};

const steamFetch = async <Response>(
  path: string,
  params: Record<string, string>,
) => {
  const query = new URLSearchParams({ key: steamKey(), ...params });
  const response = await fetch(`${STEAM_API}/${path}/?${query}`, {
    cache: "no-store",
  });
  // The URL carries the API key, so it must never end up in an error message.
  if (!response.ok) {
    throw new Error(`Steam request to ${path} failed with ${response.status}`);
  }
  return (await response.json()) as Response;
};

// Accepts a 17-digit Steam ID, a profile URL of either kind, or a custom name.
export const resolveSteamId = async (input: string) => {
  const text = input.trim();

  const direct =
    text.match(/steamcommunity\.com\/profiles\/(\d{17})/)?.[1] ??
    text.match(/^\d{17}$/)?.[0];
  if (direct) return direct;

  const customName =
    text.match(/steamcommunity\.com\/id\/([^/?#\s]+)/)?.[1] ??
    text.match(/^[A-Za-z0-9_-]{2,64}$/)?.[0];
  if (!customName) return null;

  const { response } = await steamFetch<{
    response: { success: number; steamid?: string };
  }>("ISteamUser/ResolveVanityURL/v1", { vanityurl: customName });

  return response.success === 1 ? (response.steamid ?? null) : null;
};

// Returns null when Steam hides the games: the profile or its game details are private.
export const getOwnedSteamAppIds = async (steamId: string) => {
  const { response } = await steamFetch<{
    response: { games?: { appid: number }[] };
  }>("IPlayerService/GetOwnedGames/v1", {
    steamid: steamId,
    include_played_free_games: "1",
    format: "json",
  });

  return response.games ? response.games.map((game) => game.appid) : null;
};
