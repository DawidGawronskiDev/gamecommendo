# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both primary:

- **Gamers** looking for something to play. They arrive with a game they already like, or a loose idea of what they want, and need to find Games close to it.
- **Portfolio reviewers** (recruiters, engineers) evaluating the project. They skim the shop and judge the quality of the Recommendations and of the build.

The project is intended to be production quality, not a throwaway demo.

## Product Purpose

A fake game shop built on IGDB data. It presents a Catalog of the most popular Games and suggests Recommendations based on how close Games are in meaning.

The main journey is: browse the Catalog, open a Product, follow "more like this" Recommendations to further Products.

Success means a visitor reaches a Game they did not know and that genuinely fits what they started from.

## Positioning

Recommendations come from the meaning of each Game Profile (summary together with genres, themes and keywords), not from IGDB's own `similar_games` list and not from sales or co-purchase data.

## Operating Context

- Game data is loaded from IGDB by a separate Ingestion step, which is the only part of the project that talks to IGDB and which owns the Game schema (see `../docs/adr/0002-ingestion-owns-game-schema.md`). The shop only reads stored Games.
- The shop queries Chroma directly for Recommendations (see `../docs/adr/0001-shop-queries-chroma-directly.md`).
- Domain language is defined in `../CONTEXT.md` and is binding: Game, Popularity, Ingestion, Catalog, Product, Game Profile, Recommendation, Query.

## Capabilities and Constraints

- Catalog: a browsable list of Games. One Game is one Product; there are no per-platform editions. DLCs, expansions, editions and remasters are not Games.
- Product page: one Game with its details and "more like this" Recommendations.
- The Catalog holds the most popular Games only (Popularity = number of IGDB ratings from users and critics combined).
- Nothing is sold. There are no prices, no cart and no checkout.
- A visitor can register and become a Member. A Member has a Library: the Games they own, imported from Steam by Steam ID or added by hand from a Game's page. Library Games are marked across the shop and on the Map. A Member can also mark any Game as a Favourite, owned or not; Favourites are marked the same way in a different color and listed on the profile. A Member with a Library also gets Recommendations picked from it on the home page, each with the owned Games that caused it. A Member can dismiss a Game ("Not interested") so it is left out of every Recommendation, and restore it from the profile. The profile also shows their Taste: what their Library has more of than the Catalog does.
- Available per Game: name, summary, storyline, cover, screenshots, first release date, ratings and rating counts, genres, themes, keywords, platforms, game modes, player perspectives.
- Recommendations can also start from a Query (free text such as "cozy farming game with co-op"). This is secondary to the browse journey; where and how it appears in the shop is undecided.
- Searching the Catalog by Game name is a distinct feature from Query; whether the shop offers it is undecided.

## Evidence on Hand

- Real Game data from IGDB in the project database, including cover and screenshot URLs.
- No testimonials, customers, usage numbers, press or pricing exist. Future work must not invent them.
- No product name, logo or brand assets have been defined.

## Product Principles

1. Recommendations are the point; the Catalog exists to lead visitors into them.
2. Be honest that it is a fake shop: never imply a Game can be bought here.
3. Show real IGDB data as it is; do not pad Products with invented content.
4. Use the project's domain language consistently in the interface and the code.
5. Hold production standards even though nothing is sold.
