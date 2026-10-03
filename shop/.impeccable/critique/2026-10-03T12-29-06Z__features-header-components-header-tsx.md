---
target: header responsibility
total_score: 21
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
timestamp: 2026-10-03T12-29-06Z
slug: features-header-components-header-tsx
---
Method: dual-agent (A: design review, B: detector + browser evidence)

Target: `features/header/components/header.tsx`. Focus: header responsibility, meaning which jobs the header carries, whether each belongs there, and how they survive at narrow widths.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 1 | No current-location state on any route; no `aria-current` |
| 2 | Match system / real world | 2 | Magnifier and field shape promise title search; "Blend" is unexplained |
| 3 | User control and freedom | 3 | Solid: sticky, wordmark goes home, Ctrl/Cmd+K toggles |
| 4 | Consistency and standards | 2 | Two focus styles in one row; two theme controls side by side |
| 5 | Error prevention | 3 | Little to get wrong |
| 6 | Recognition rather than recall | 2 | Three unlabelled icons without tooltips; Browse and Map gone on phones |
| 7 | Flexibility and efficiency | 3 | Ctrl K is good; the hint says "Ctrl" on Mac too |
| 8 | Aesthetic and minimalist | 3 | Calm at 1440; trigger text wraps between 640 and about 770px |
| 9 | Error recovery | n/a | The header has no error states of its own |
| 10 | Help and documentation | 2 | Palette examples are good; nothing explains Blend, Map or the icons |
| **Total** | | **21/36** | **Acceptable (58%)** |

## Design Specificity Verdict

**LLM assessment:** half authored, half interchangeable. Authored: the two-tone mono wordmark, the square zero-chroma chrome, and the trigger copy "Describe a Game", which carries the positioning in three words. Interchangeable: the structure is the stock shadcn top bar (logo, links, command-K, theme toggle, user icon). Nothing in the layout says Recommendations are the point. The phone layout is not designed: it is the desktop bar with two links deleted.

**Deterministic scan:** 0 findings, exit 0, across `header.tsx`, `mode-toggle.tsx`, `auth-menu.tsx` and `recommendation-query-command.tsx`. No false positives. The static scan cannot see overflow, target size, active state or wrapping, so the clean result says little here.

**Visual overlays:** none. No browser tool with page injection was available and the live server was never started. The fallback was headless Chrome screenshots and DOM measurement from 1440 down to 320, in dark and light.

## Overall Impression

Well made as an object, under-specified as a navigation system. The header does eight jobs at equal weight and three of them are theming and account utilities. The biggest opportunity is to decide what the header is for, then let Query lead.

## What's Working

- The trigger copy is the positioning: "Describe a Game" teaches meaning-based Query before any click.
- The system is held tight: square corners, hairline, zero chroma, identical on every route, correct in both modes. All text passes AA (lowest 4.74:1, light-mode muted text).
- The accessibility baseline is present: every icon has an accessible name, focus is visible everywhere, tab order matches visual order, and the auth placeholder reserves its 36px slot so nothing shifts.

## Priority Issues

### [P1] The phone header is a truncation and overflows below 386px
- Why: `hidden sm:inline` drops Browse and Map with no menu (`header.tsx:31,43`), leaving the wordmark, "Blend" and four icons. The main journey starts at the Catalog, yet Browse is missing while two theme controls stay. The row's minimum content width is 386px: at 360 and 320 the whole page scrolls sideways, and at 320 the Log in icon is fully off-screen. Login exists nowhere else, since the footer has no auth link.
- Fix: below `sm` keep the wordmark, Query and one menu or account control; move Browse, Blend, Map, Design and Mode into a sheet. Minimum version: drop Palette and Mode from the bar below `sm` and restore the three links.
- Suggested command: /impeccable adapt

### [P1] No current-location state
- Why: the header is pixel-identical on `/`, `/map`, `/design` and `/blend`. The codebase already does this in `auth-profile-tabs.tsx:26`.
- Fix: a small client nav-link using `usePathname`, `aria-current="page"`, Paper text and a 2px Signal White underline. Mark the palette icon on `/design` and the user icon on `/profile`.
- Suggested command: /impeccable polish

### [P2] The responsibility mix does not match "Recommendations are the point"
- Why: three of seven right-side slots are non-product utilities. Palette and Mode are two adjacent theme controls. A Member gets no Library entry; the profile hides behind a 14px icon whose only signed-in signal is fill weight.
- Fix: order as wordmark, links, Query as the dominant element, account. Merge Palette and Mode into one Appearance control or move Mode to `/design`. Show Members a text "Library" link.
- Suggested command: /impeccable distill

### [P2] The Query trigger mis-signals and breaks at mid widths
- Why: a magnifier in a field shape reads as name search, which PRODUCT.md calls a separate feature. On phones it is an anonymous magnifier. It is the only shrinkable item: about 143px at 640, with the label and "CTRL K" each wrapped to two lines; it reaches 18rem only from roughly 770 to 840px. Its boundary ring is 1.24:1.
- Fix: `whitespace-nowrap`, hide the kbd until `md`, `sm:w-56 lg:w-72`; replace the magnifier with a glyph that does not mean search.
- Suggested command: /impeccable adapt, then /impeccable clarify

### [P3] Semantics and small targets
- Why: `<nav>` is unlabelled and holds 3 of 6 destinations. No skip link. Text links are 16px tall with no padding and the wordmark 18px, under the 24px minimum of WCAG 2.5.8. Icon buttons are 36px. Palette and auth links are exposed as `role="button"`. "Toggle theme" exposes no state. A closed dialog leaves an `sr-only` `<h2>Describe a Game</h2>` in the banner. Focus styles differ between links and icon buttons.
- Fix: label the nav, add a skip link, pad links to a 44px hit area, unify the focus style, unmount the dialog header when closed.
- Suggested command: /impeccable audit

## Persona Red Flags

- **Jordan (first-timer):** types a title into what looks like search and gets meaning-matched results with no explanation. "Blend" is opaque. Nothing confirms location after clicking Map. Three glyphs have no labels or tooltips.
- **Casey (phone, one hand):** Browse and Map are reachable only from the footer. Nothing reaches 44px. Palette next to Mode at 12px gaps invites mis-taps. Below 386px Log in is clipped or gone.
- **Sam (keyboard, screen reader):** no `aria-current`, unnamed nav landmark, no skip link (8 tab stops before content on desktop), trigger name "Describe a Game Ctrl K" with no `aria-haspopup`, stray h2 in the banner.
- **Portfolio reviewer:** sees the trigger wrap near 700px and horizontal scroll at 320, no active nav state, the auth icon popping in after hydration, "Ctrl K" on a Mac, and a DESIGN.md Header section that documents one link while the code ships seven items.

## Minor Observations

- At 768 the nav sits flush against the wordmark; the layout is one item from overflow at every breakpoint.
- The 14px palette icon reads as a blob.
- A server-read session would remove the auth pop-in.
- OS light preference is ignored (`enableSystem={false}`); undocumented.
- The signed-in header was checked from code only.

## Questions to Consider

1. If Recommendations are the point, why is the centre of gravity three equal text links, with two of six phone slots spent on colour themes?
2. Is the header for the gamer or the reviewer?
3. Does a phone need header nav at all, or is wordmark plus a full-width "Describe a Game" plus one menu button truer?
