---
name: gamecommendo
description: A fake game shop whose first screen already recommends.
colors:
  background: "oklch(0.145 0 0)"
  card: "oklch(0.205 0 0)"
  muted: "oklch(0.269 0 0)"
  accent: "oklch(0.269 0 0)"
  foreground: "oklch(0.985 0 0)"
  muted-foreground: "oklch(0.708 0 0)"
  primary: "oklch(0.922 0 0)"
  primary-foreground: "oklch(0.205 0 0)"
  score-good: "oklch(0.556 0 0)"
  score-mixed: "oklch(0.439 0 0)"
  border: "oklch(1 0 0 / 10%)"
  ring: "oklch(0.556 0 0)"
  library: "oklch(0.7 0.16 250)"
  favourite: "oklch(0.7 0.28 350)"
typography:
  display:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "clamp(2.1rem, 4.8vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0"
spacing:
  gutter: "1rem"
  gutter-md: "2rem"
  gap: "0.75rem"
  section: "2.5rem"
  section-md: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "oklch(0.922 0 0 / 80%)"
  badge:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  score:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.none}"
    size: "2.5rem"
  score-good:
    backgroundColor: "{colors.score-good}"
    textColor: "{colors.primary-foreground}"
  score-mixed:
    backgroundColor: "{colors.score-mixed}"
    textColor: "{colors.primary-foreground}"
  rail-item:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  rail-item-current:
    backgroundColor: "{colors.accent}"
  game-cover:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.none}"
---

# Design System: gamecommendo

## Overview

**Creative North Star: "The Spec Sheet"**

gamecommendo reads like a technical data sheet for Games. Titles are set in uppercase monospace, every edge is square, and the chrome is pure grayscale with no hue of its own. The interface states facts (year, genres, score, rating count) and gets out of the way; the only color on the page comes from IGDB screenshots and cover art. That describes the Neutral Palette, which is the default and the one this document specifies. Anyone can pick another Palette for their own view; doing so is their choice, not the shop's.

The system is dark only. Someone browses it in the evening on a monitor, so the ground is near-black and the artwork sits on it like a lit panel. Density is moderate: one large stage, a compact rail beside it, a strip of covers below.

What makes it more than a sheet is the first screen. The spotlight Game and the Games closest to it in meaning share one stage, so the product's mechanism is shown before any scrolling.

**Key Characteristics:**

- Neutral grayscale chrome with zero chroma; artwork carries all color. Other Palettes are opt-in.
- Uppercase JetBrains Mono for titles, Space Grotesk for everything read.
- Square corners everywhere (0 radius).
- Flat surfaces separated by lightness steps and 1px hairlines, never shadows.
- Wide-tracked uppercase micro-labels for badges and buttons.

## Colors

A single neutral ramp from near-black to near-white. All tokens live as shadcn CSS variables in `app/globals.css` under `.dark`; the `dark` class is set on `<html>`. Components use only the semantic utilities.

The other Palettes (Green, Orange, Purple, Amber) are `[data-palette]` blocks in the same file, each with a light and a dark variant. A Palette redefines the shadcn color tokens only: never fonts, radius or shadows, and never `library`, `favourite`, `destructive` or the `score-*` tokens, which carry meaning and stay the same in every Palette. A Palette whose primary sits close to Library Blue or Favourite Pink is left out rather than those two being moved.

### Primary

- **Signal White** (`primary`): the one primary action, the active rail outline on small screens, the spotlight timer fill, hover state of Game names and cover outlines, and the text selection ground.

### Neutral

- **Carbon** (`background`): the page.
- **Raised Carbon** (`card`): the spotlight stage ground and resting rail items.
- **Graphite** (`muted`, `accent`): cover placeholders, hovered rail items, the active rail item.
- **Paper** (`foreground`): titles and body text.
- **Ash** (`muted-foreground`): meta lines, rating counts, secondary copy.
- **Signal White** (`score-great`): scores of 85 and above, with `score-foreground` text.
- **Mid Gray** (`score-good`): scores from 70 to 84.
- **Dark Gray** (`score-mixed`): scores below 70.
- **Hairline** (`border`): 10% white, used as rings at `foreground/10`. Game covers take theirs from `--game-ring`, which defaults to the same hairline.

### Tertiary

- **Library Blue** (`library`): marks an owned Game. Dark theme `oklch(0.7 0.16 250)`, light theme `oklch(0.52 0.19 256)`.
- **Favourite Pink** (`favourite`): marks a loved Game. A hot, saturated pink, deliberately far from the error red. Dark theme `oklch(0.7 0.28 350)`, light theme `oklch(0.6 0.27 352)`.

### Named Rules

**The Art Is The Color Rule.** No surface, label or state gets a hue. If a region needs color, it gets a screenshot or a cover. The only exceptions are the two Member marks, Library Blue and Favourite Pink.

**The Blue Means Yours Rule.** Library Blue (`library`) marks a Game in the signed-in Member's Library and nothing else: the hairline around its cover, its point on the Map, the check on the Library button. It is never used for links, focus, emphasis or decoration.

**The Pink Means Loved Rule.** Favourite Pink (`favourite`) marks a Game the signed-in Member has made a Favourite and nothing else. When a Game is both owned and a Favourite, pink wins: one ring carries one fact, and loving a Game is the stronger one. Errors keep red (`destructive`); pink is never used for them.

**The Brightness Is Rank Rule.** Lighter means more important: the primary action, the active item and the best score are the brightest things in the chrome. Score tiers step down in lightness, not in hue.

## Typography

**Display Font:** JetBrains Mono (with monospace fallback), exposed as `font-heading`
**Body Font:** Space Grotesk (with sans-serif fallback), exposed as `font-sans`

**Character:** A monospace voice for anything that names a Game, paired with a geometric sans for reading. The pairing feels like a catalogue printout annotated by hand.

### Hierarchy

- **Display** (800, `clamp(2.1rem, 4.8vw, 4.75rem)`, 0.92): the spotlight Game title. Uppercase, tight tracking (-0.05em), balanced wrapping, capped at 18ch. Names longer than 26 characters step down to `clamp(1.6rem, 3.4vw, 3.25rem)` at 0.96.
- **Headline** (800, 1.25rem rising to 1.5rem, 1.25): the "More like {Game}" heading. Uppercase; the lead-in words are set in Ash.
- **Title** (600, 0.875rem, 1.375): Game names in the rail and on Recommendation cards, clamped to two lines.
- **Body** (400, 0.875rem rising to 1rem, 1.625): summaries and explanatory copy. Measure capped at 60ch on the stage and 45ch beside the Recommendations.
- **Label** (600, 0.625rem, 0.1em tracking, uppercase): badges. Buttons use the same treatment at 0.75rem; the spotlight action overrides to bold 1rem.
- **Meta** (400, 0.75rem, Ash): `year · genre` lines and rating counts.

### Named Rules

**The Tabular Rule.** Every number a visitor compares (scores, rating counts, years) uses `tabular-nums`.

**The Mono Names Rule.** Anything that is a Game's name is set in JetBrains Mono. Anything that describes it is set in Space Grotesk.

## Layout

- One container: centered, `max-w-[1560px]`, with a 1rem gutter rising to 2rem at `md`.
- The spotlight is a two-column grid from `lg` up: a fluid stage and a fixed 17rem rail, 0.75rem apart. The Recommendations row spans both columns beneath, itself split into a 16rem intro column and a fluid cover strip.
- The stage has a minimum height of 30rem, 34rem at `md` and 37rem at `lg`; content is pinned bottom-left with 1.25rem padding rising to 2.5rem.
- Below `lg` the rail becomes a row of six covers under the stage with names hidden, and the Recommendations intro stacks above its covers.
- Recommendation covers run three per row on small screens and six from `sm` up.
- Portrait covers are always 3:4. Screenshots always fill their frame with `object-cover`.
- Section rhythm is 1rem top and 2.5rem bottom, rising to 1.5rem and 3.5rem at `md`.
- The home page stacks five sections: spotlight, most popular, by genre, by platform, by decade. Each later section opens with one header row (uppercase heading left, one explanatory line right from `md`) and uses 3rem top and 2.5rem bottom padding, rising to 4rem and 3.5rem.
- Cover grids run 3 across on small screens, 4 from `sm`, 6 from `lg` (or `xl` when a rail sits beside them).
- A sticky header (3.5rem tall, hairline bottom) and a footer frame every page.
- The Game page is a single column of blocks 3rem apart (4rem from `md`): stage, then summary beside a 26rem spec table from `lg`, then screenshots, then Recommendations.
- The map page is a full-bleed canvas the height of the viewport minus the header (75dvh on small screens), with its panel and controls laid over it.

## Elevation & Depth

Surfaces in the page are flat. Depth comes from three lightness steps (Carbon, Raised Carbon, Graphite) and 1px hairline rings at `foreground/10`.

Only layers that float above the page carry a shadow: dialogs (Query palette, Game quick view) and the select popup keep the shadcn default (`shadow-md`) with a hairline ring, and dialogs dim the page behind a 20% black backdrop with a slight blur.

Over imagery, legibility comes from two scrims rather than panels: one gradient rising from the page ground at the bottom, one fading from 80% ground on the left to transparent at 70% width.

### Named Rules

**The No Shadow Rule.** Nothing in the page flow casts a shadow. A surface that needs to stand apart gets a lighter step or a hairline. Shadows belong only to dialogs and popups.

## Shapes

Every corner is square. The shadcn primitives are restyled to `rounded-none` and feature components add no radius. A radius scale derived from `--radius` exists in `globals.css` but nothing uses it.

Frames are 1px rings at `foreground/10`; interactive emphasis thickens the ring to 2px in Signal White. Images are clipped by their frame with `overflow-hidden`.

## Components

All primitives are shadcn on base-ui, restyled through `className`; no custom classes exist in `globals.css`.

### Buttons

Blunt and typographic: a filled bar with wide-tracked uppercase text.

- **Shape:** square (0 radius), transparent 1px border.
- **Primary:** Signal White ground, Carbon-gray text. Default height 2.5rem; the spotlight action is 2.75rem with 1.25rem side padding, bold 1rem text and a trailing arrow icon.
- **Hover / Focus:** ground drops to 80% opacity on hover; focus shows a 2px ring at `ring/30`; pressing nudges the button down 1px.
- **Links as buttons:** rendered with `render={<Link />}` and `nativeButton={false}`.

### Chips

- **Style:** `Badge` is text only by default: no ground, no border, no padding, 0.625rem uppercase semibold at 0.1em tracking.
- **Variants in use:** the release year in default Paper, bold with tabular figures; up to four genres in the outline variant, which asks for a half-transparent Carbon ground over imagery.

### Cards / Containers

- **Corner Style:** square.
- **Background:** Raised Carbon for the stage, Graphite for empty cover frames.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px ring at `foreground/10` on the stage and on Recommendation covers.
- **Recommendation card:** a link holding a 3:4 cover, then the Game name and a `year · genre` meta line. Hover and keyboard focus thicken the cover ring to 2px Signal White and scale the art to 105% over 500ms.

### Score

A square box, 2.5rem a side, holding the rounded IGDB total rating in bold 1rem, followed by the rating count in Ash. Ground steps by tier: Signal White at 85 and above, Mid Gray from 70 to 84, Dark Gray below 70.

### Spotlight

The signature component, built from a stage, a rail and a Recommendations strip.

- **Stage:** all six screenshots stay mounted. The active one fades in on top over 700ms; the outgoing one stays opaque beneath until the fade ends, then hides instantly. Title, badges, summary, action and score re-enter together on every change, fading up 0.75rem over 500ms.
- **Rail:** six buttons. From `lg` up each is a 3rem cover with name and meta on Raised Carbon; the active one sits on Graphite. Below `lg` each is a bare cover and the active one takes a 2px Signal White ring.
- **Timer:** the active rail item carries a thin bar along its bottom edge (2px on large screens, 4px on small) that fills left to right over 7 seconds, linear. The fill's `animationend` advances the spotlight, so the bar is the clock.
- **Pausing:** hovering anywhere over the spotlight, or keyboard focus inside it, pauses the fill and with it the rotation.
- **Recommendations:** six covers for the active Game, re-entering with a 50ms stagger on every change.
- **Easing:** entrances and fades use `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Reduced motion:** entrances, fades and the timer are disabled; the spotlight then changes only when a rail item is chosen.

### Game card

The shared unit for any grid of Games: a 3:4 cover with a hairline ring, the Game name in JetBrains Mono (two lines max) and a `year · genre` meta line in Ash. Hover and keyboard focus thicken the ring to 2px Signal White and scale the art to 105% over 500ms.

### Header

Sticky bar on Carbon with a hairline bottom, 3.5rem tall. Its job is to lead into Recommendations, so the Query trigger is the brightest and widest thing in it.

- **Wordmark** at left in JetBrains Mono, uppercase, extrabold: `game` in Paper, `commendo` in Ash.
- **Links** from `md`, directly after the wordmark: Browse, Blend, Map in label style at 0.75rem, Ash. Each link is the full height of the bar. The current one turns Paper and sits a 2px Signal White mark on the hairline, and carries `aria-current="page"`.
- **Query trigger** at right; see Query palette.
- **Design** from `md`: a palette icon with a tooltip, marked the same way on `/design`.
- **Account** from `md`: a text link in the same style, "Log in" for a visitor and "Library" for a Member. The session is read on the server, so it never pops in.
- **Below `md`** the bar is the wordmark, the Query trigger filling the space between, and a 2.75rem menu button. The menu is a sheet from the right edge (20rem, full height) listing Browse, Blend, Map, Design and the account link as 3.5rem ruled rows in JetBrains Mono; the current row is Paper with a small Signal White square at its right.
- **Mode** is not in the header. It is switched on the Design page, beside the Palette.
- A "Skip to content" link is the first focusable element and jumps to `<main id="main">`.
- Every target is at least 2.75rem in both directions, and all of them share one focus style: a 2px `ring`.

### Query palette

- **Trigger:** looks like a field (Raised Carbon, 2.75rem tall, a ring at `foreground/50` so its edge clears 3:1 in both Modes). A text-cursor icon, never a magnifier, because this is not name search; "Describe a Game"; and from `lg` a shortcut hint, `⌘ K` on Apple devices and `Ctrl K` elsewhere. 14rem wide from `md`, 20rem from `lg`, 24rem from `xl`; below `md` it fills the bar and keeps its words.
- **Dialog:** shadcn `Command` in a dialog, opened by the trigger or Ctrl/Cmd+K. Before typing it lists three example descriptions. Results are the ten closest Games: small cover, name, `year · genre`.
- **States:** "Matching by meaning…" while loading, previous results dim to 50%; plain sentences for no matches and for failure.

### Popularity chart

A ruled list of the ten most popular Games, one link per row: two-digit rank in JetBrains Mono (Paper for ranks 1 to 3, Ash after), small cover, name and meta, rating count with a "ratings" label, score box. Rows are separated by hairlines and take Raised Carbon on hover.

### Players vs critics

Directly under the popular list. Two ruled lists of ten side by side from `lg`, stacked below: "Players rate higher" and "Critics rate higher", ranked by the gap between Player Score and Critic Score. A row is the rank in Ash JetBrains Mono, a small cover, the name, a meta line (year, player rating count, critic review count), and under them a track: a hairline from 0 to 100 with a filled 10px square at the Player Score, a hollow one at the Critic Score, a 2px Paper bar between them, and each number printed outside its mark. The two marks differ by shape, never by color; a legend above the lists names them once. Marks and bar take `primary` on row hover. Only Games with at least 100 player ratings and 5 critic reviews are compared, and the section says so.

### Toggles

Three sections switch their grid by one choice, each with its own control:

- **Genre:** a row of small shadcn buttons, filled Signal White when active and outlined otherwise. Wraps from `md`, scrolls sideways below.
- **Platform:** a 17rem vertical rail from `lg`: platform name in JetBrains Mono with its Game count at right, on Raised Carbon; the active row is filled Signal White. Becomes a sideways-scrolling row below `lg`.
- **Decade:** a timeline. One hairline axis with decades as large JetBrains Mono numerals and a Game count under each; the active decade is Paper with a 2px Signal White segment on the axis, the rest Ash.

All three mark the active choice with `aria-pressed`, and the grid replays its staggered entrance (30ms steps) on every switch.

### Game page

- **Stage:** full-width screenshot under the same two scrims as the spotlight, with the cover at left from `sm`, year and genre badges, the name as `h1` at display scale, and the score.
- **Spec table:** a ruled definition list. Labels in label style on an 8rem column, values in body text; rows with no value are omitted.
- **Screenshots:** shadcn carousel, three across from `lg`, two from `sm`, one with a peek below; previous and next buttons sit in the heading row.

### Map

A canvas scatter of every Game placed by meaning. Points are Paper at four opacity steps and grow with Popularity; hairline lines join each Game to its three Neighbours; the most popular Games in view are labelled in 11px JetBrains Mono. Density follows zoom, and Neighbour lines and labels drop out while the view is moving. A panel at top left (Carbon, hairline ring) holds the title, a short explanation, counts and a genre select; zoom and reset buttons sit bottom right. Hover shows a small card with cover, score and its three Neighbours.

### Game quick view

The map's detail dialog, up to 64rem wide and 44rem tall. Left column on Raised Carbon: a 4:3 screenshot carousel with a thumbnail strip, the current thumbnail ringed in Signal White. Right column, scrolling: badges, name, score, a ruled block with release date and platforms, two stacked full-width buttons (filled "View Game", outlined "View on IGDB"), then an accordion of Summary, Storyline, Details and Recommendations. Stacks to one column on small screens.

### Recommended for you

A home section shown only to a signed-in Member, directly under the spotlight and separated from it by a hairline. Same header row as the other home sections; twelve Game cards, six across from `lg`, three from `sm`, two below. Under each card a hairline and one Ash line gives the reason: "Because you own" followed by up to two Game names in Paper and "and N more". A Member with an empty Library sees only the header row, with a link to the profile in place of the explanation.

### Blend

Two picks left and right of one larger card, the Blend, framed in a 2px Signal White ring. The Game's badges and name sit bottom-left on the cover over a fade to the page ground; the Roll button and "3 of 12" counter sit bottom-right on the same cover, so the Game and the dice are always on screen together. The card's size is derived from the viewport height. Above it, as wide as the card, a slider leans the Blend toward one pick: a hairline track, a square Signal White thumb, eleven stops, the two Game names at its ends (the one being leaned toward in Paper, the other in Ash) and the amount between them. On small screens the picks collapse to compact rows above the slider.

### Member marks

A Game in the Member's Library keeps every component it appears in and changes one thing: the 1px hairline around its cover turns Library Blue. A Favourite turns it Favourite Pink instead, and pink wins when both are true. Hover and focus still thicken the ring to 2px Signal White. Every cover element carries `data-game-id` and reads its ring colour from `--game-ring`; the layout sets that variable to `--library` for the Member's Games, so no component needs to know about the Library. On the Map, Library Games are drawn as Library Blue points at full opacity, following the same density rule as every other Game, with one legend line per mark in the panel; Favourites are drawn the same way in Favourite Pink, on top.

Both marks are set from the Product page and the Map's quick view with two outline buttons side by side: a heart ("Add to Favourites" / "Favourite · Remove", the heart filled pink when set) and a plus or check ("Add to Library" / "In Library · Remove", the check blue when set).

### Profile

The Member's name at display scale with their email and a Log out button, then the Library: a short explanation beside the Steam ID field and Sync button, a ruled row with the Game count, "See on the Map" and "Clear Library", and the Games as a cover grid (3 across, rising to 8). Above it two small buttons switch between Library and Favourites, each with its count; the filled one is current and the choice lives in the URL. Clearing either opens a confirm dialog with a red-tinted destructive button. The header links to it as "Library".

### Dismissing

A Dismissed Game carries no mark: no ring colour, no dimming, an ordinary point on the Map. It is a filter, not a statement, so the two Member marks stay the only colour. Under Recommended for you each card gets a 2rem square button with a cross in its cover's top-right corner, on Carbon with a hairline ring; it appears on hover and keyboard focus, and is always visible on touch screens. The Product page and the Map's quick view add a third outline button, "Not interested" / "Dismissed · Restore". The profile's Dismissed view lists the Games as cover cards, each with a small Restore button beneath.

### Taste

The third profile view, beside Library and Favourites. A ruled summary row first: what the Library has more of than usual (names in Paper, each followed by its multiple in Ash), then average Score and Popularity against the Catalog. Below it, one block per dimension (genres, themes, perspectives, game modes, decades), three across from `xl`, two from `md`. Each block is a ruled list: the name in JetBrains Mono, a bar, the percentage. The bar is a 6px track at `foreground/10` with a Signal White fill for the share of the Library and a 1px Ash mark, slightly taller than the track, at the share across the Catalog. Genres and decades link to Browse; the rest are plain text. Under ten Library Games the view is a single sentence instead.

### Footer

Hairline top, then a large uppercase statement ("Nothing here is for sale") with one supporting line, two columns of text links, a ruled row of small Ash notes, and the wordmark set across the full container width in JetBrains Mono. The wordmark's letters rise in one by one (40ms steps, 700ms) the first time it scrolls into view.

### Design page

`/design` shows the system and is where a Palette is picked; a palette icon in the header and a footer link lead to it. A display-scale title, one line and anchor links open the page. Under them the Palette picker sits in a ruled bar: a radio group of 3rem square swatches with the palette icon and a one-line note at left. After the swatches, past a hairline, a square of the same size switches the Mode: a moon or sun for the current Mode, with "Dark" or "Light" as its micro-label. Each swatch is drawn in its own Palette: "Aa" in that Palette's `foreground` on its `background`, over a band of its `primary`, with the name as a micro-label beneath. The chosen swatch takes a 2px Paper outline at 2px offset and its label turns Paper; swatches lift 2px on hover. Once scrolled past, the bar sticks under the header in a compact form: 2.5rem swatches, no labels, no note, and the Mode square only from `sm`.

Five ruled sections follow, each a 16rem column holding the headline and a short description, with the specimens beside it from `lg`. Colors and Meaning are ruled lists of tokens: a 2.75rem chip, the token name in JetBrains Mono, its role in Ash, and its live value as hex at right. Colors lists what a Palette redefines; Meaning lists what none does, with the three Score tiers shown as bare boxes. Type sets each role in real shop copy. Controls holds the working primitives. Games shows three real Games with the ring forced to plain, Library Blue and Favourite Pink, labelled as specimens.

## Do's and Don'ts

### Do:

- **Do** keep the chrome at zero chroma; reach for a lighter or darker neutral step when something must stand out.
- **Do** set Game names in JetBrains Mono and descriptive text in Space Grotesk.
- **Do** keep every corner square.
- **Do** use `tabular-nums` on scores, counts and years.
- **Do** restyle a shadcn primitive with utilities before writing a new element.
- **Do** animate only `opacity` and `transform`, with `cubic-bezier(0.16, 1, 0.3, 1)` for entrances.
- **Do** give every animation a `motion-reduce` fallback.

### Don't:

- **Don't** introduce another accent hue or tint a surface; artwork and the two Member marks are the only color. Library Blue only ever means "in your Library"; Favourite Pink only ever means "a Favourite".
- **Don't** add shadows to anything in the page flow; only dialogs and popups float.
- **Don't** use the radius scale; nothing in the system is rounded.
- **Don't** add classes or keyframes to `globals.css`; only its variables and imports change.
- **Don't** animate `clip-path` or layout properties on full-bleed imagery; the screenshot change is a crossfade.
- **Don't** put a second filled Signal White button in the same view.
