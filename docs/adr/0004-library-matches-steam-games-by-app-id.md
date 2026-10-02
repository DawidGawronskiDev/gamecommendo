# The Library matches Steam games by app id, not by name

A Member's Steam games are matched to Games through Steam app ids that Ingestion stores from IGDB's external games (`game_steam_apps`), and a Steam game with no matching id is dropped. We considered matching by name, which needed no Ingestion change, and rejected it: names differ between Steam and IGDB (editions, subtitles, punctuation), about a hundred Games share a name, and a wrong Game in a Library is worse than a missing one.

## Consequences

- Only Games that IGDB links to Steam can be imported: about 80% of the PC Games in the Catalog. The rest can be added to a Library by hand.
- One Game can have several Steam app ids (re-releases, regional versions), so the link is its own table rather than a column on `games`.
- A Steam sync only adds Games; it never removes any. Removing is done by hand, and a later sync restores a Steam Game that was removed.
- Any Steam ID is accepted without proof of ownership. Proving it would need Steam sign-in, which is out of scope.
