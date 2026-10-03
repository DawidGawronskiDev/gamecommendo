# Game Recommendations Engine

A practice project built around video game data from IGDB: a fake game shop that exposes a catalog through an API, and a notebook that builds intelligent game recommendations the shop can serve.

## Language

### Games

**Game**:
A main video game as described by IGDB (name, summary, genres, themes, keywords, platforms, cover, screenshots). DLCs, expansions, editions and remasters are not Games in this project.
_Avoid_: Title, item

**Popularity**:
How many ratings a Game has received on IGDB from users and critics combined. The project holds the most popular Games only.
_Avoid_: Hype, visits, reviews

**Score**:
A Game's combined IGDB rating from users and critics, from 0 to 100. It says how well a Game was received, not how many people rated it.
_Avoid_: Rating (ambiguous with the number of ratings), review score

**Player Score**:
A Game's IGDB rating from users alone, from 0 to 100. "Player" here means the people who rated the Game on IGDB, not a Member of the shop.
_Avoid_: User score, user rating, audience score

**Critic Score**:
A Game's IGDB rating from critics alone, from 0 to 100. Many Games have none.
_Avoid_: Aggregated rating, press score, review score

**Ingestion**:
Loading Games from IGDB into the project's own database. It is the only place that talks to IGDB; everything else reads the stored Games.
_Avoid_: Sync, import, scrape

### Shop

**Catalog**:
The browsable list of Games the shop presents. The shop is fake: it shows Games like a store would, but nothing is actually sold.
_Avoid_: Store inventory, stock

**Product**:
A Game as it appears in the Catalog. One Game is one Product; there are no per-platform editions.
_Avoid_: SKU, listing, edition

### Appearance

**Palette**:
A named set of colors the shop can be shown in. Anyone, Member or visitor, picks one for their own view; it changes nothing for anyone else. Every Palette works in both Modes.
_Avoid_: Theme (a theme is an IGDB trait of a Game), skin, color scheme

**Mode**:
Whether the shop is shown light or dark. It is chosen separately from the Palette.
_Avoid_: Theme, dark theme

### Members

**Member**:
A person with an account in the shop. Someone without one is a visitor.
_Avoid_: User, customer, player

**Library**:
The Games a Member owns.
_Avoid_: Collection, wishlist, backlog

**Favourite**:
A Game a Member marks as one they love. It says nothing about owning it: a Favourite may or may not be in the Library.
_Avoid_: Like, wishlist, starred, bookmark

**Dismissed**:
A Game a Member has asked not to be recommended. It says nothing about their taste, and the Game can still be found by browsing, on the Map or with a Query.
_Avoid_: Blocked, hidden, disliked, ignored

**Taste**:
What a Member's Library has more of than the Catalog does: the genres, themes, perspectives and game modes that set it apart.
_Avoid_: Profile (that is the Member's page, or a Game Profile), preferences, stats

### Recommendations

**Game Profile**:
The text that represents a Game when judging how close Games are in meaning: its summary together with its genres, themes and keywords.
_Avoid_: Description, document, embedding text

**Recommendation**:
A Game suggested because its Game Profile is close in meaning to what the user is interested in. It starts from a Game ("more like this"), from a Query, from two Games (a Blend), or from a Member's Library ("recommended for you").
_Avoid_: Suggestion, related games, similar games (IGDB's own `similar_games` list is a different thing)

**Blend**:
A Recommendation that starts from two Games and is close in meaning to both of them.
_Avoid_: Mix, mashup, crossover

**Query**:
Free text a user types to describe what they want to play, such as "cozy farming game with co-op", answered with Recommendations.
_Avoid_: Search (searching by Game name is a different Catalog feature), prompt

### Map

**Map**:
A picture of the whole Catalog in which Games with close Game Profiles sit near each other.
_Avoid_: Graph, network, cloud

**Neighbour**:
One of the Games closest in meaning to a given Game on the Map.
_Avoid_: Link, connection, edge
