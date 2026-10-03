import { PopularGame } from "@/features/catalog/types";
import { GameCard } from "@/features/game/components/game-card";
import { GameScore } from "@/features/game/components/game-score";
import { cn } from "@/lib/utils";
import {
  DESIGN_FIXED_TOKENS,
  DESIGN_PALETTE_TOKENS,
  DESIGN_SCORE_TIERS,
  DESIGN_SECTIONS,
} from "../data";
import { DesignControls } from "./design-controls";
import { DesignPaletteBar } from "./design-palette-bar";
import { DesignSpecimen } from "./design-specimen";
import { DesignTokenList } from "./design-token-list";

type DesignSectionProps = React.ComponentProps<"div"> & {
  games: PopularGame[];
};

type DesignBlockProps = React.ComponentProps<"section"> & {
  section: (typeof DESIGN_SECTIONS)[number];
  description: string;
};

function DesignBlock({
  section,
  description,
  className,
  children,
  ...props
}: DesignBlockProps) {
  return (
    <section
      aria-labelledby={section.id}
      className={cn(
        "grid gap-x-16 gap-y-8 border-t border-foreground/10 py-12 md:py-16 lg:grid-cols-[16rem_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <h2
          id={section.id}
          className="scroll-mt-40 font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-4xl"
        >
          {section.name}
        </h2>
        <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-12">{children}</div>
    </section>
  );
}

const toYear = (game: PopularGame) => game.firstReleaseDate?.slice(0, 4);

export function DesignSection({
  games,
  className,
  ...props
}: DesignSectionProps) {
  const [colors, meaning, type, controls, pieces] = DESIGN_SECTIONS;
  const [game] = games;
  const hasGames = games.length > 0;
  const marks = [
    {
      name: "Plain",
      ring: "[&_[data-game-id]]:[--game-ring:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
    },
    {
      name: "In Library",
      ring: "[&_[data-game-id]]:[--game-ring:var(--library)]",
    },
    {
      name: "Favourite",
      ring: "[&_[data-game-id]]:[--game-ring:var(--favourite)]",
    },
  ];

  return (
    <div className={cn("pb-16 md:pb-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-6 px-4 pt-12 pb-10 md:px-8 md:pt-20 md:pb-14">
        <h1 className="font-heading text-[clamp(2.1rem,4.8vw,4.75rem)] leading-[0.92] font-extrabold tracking-tighter text-balance uppercase">
          Design
        </h1>
        <p className="max-w-[60ch] leading-relaxed text-muted-foreground md:text-lg">
          Every color, letter and control the shop is built from. Pick a Palette
          and the whole shop changes with it, this page first.
        </p>
        <nav aria-label="Design sections">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {DESIGN_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {section.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <DesignPaletteBar />

      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <DesignBlock
          section={colors}
          description="What a Palette changes. Values are read from the page as you look at it, in the current Palette and Mode."
          className="border-t-0"
        >
          <DesignTokenList tokens={DESIGN_PALETTE_TOKENS} />
        </DesignBlock>

        <DesignBlock
          section={meaning}
          description="What no Palette changes. These colors say something about a Game, so they stay put."
        >
          <DesignTokenList tokens={DESIGN_FIXED_TOKENS} />
          <DesignSpecimen name="Score tiers" note="brighter is better">
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {DESIGN_SCORE_TIERS.map((tier) => (
                <li key={tier.rating} className="flex items-center gap-3">
                  <GameScore rating={tier.rating} className="size-10 text-sm" />
                  <span className="text-sm text-muted-foreground">
                    {tier.label}
                  </span>
                </li>
              ))}
            </ul>
          </DesignSpecimen>
        </DesignBlock>

        <DesignBlock
          section={type}
          description="JetBrains Mono, uppercase, for titles. Space Grotesk for everything read."
        >
          <DesignSpecimen
            name="Display"
            note="JetBrains Mono 800, 2.1 to 4.75rem"
          >
            <p className="font-heading text-[clamp(2.1rem,4.8vw,4.75rem)] leading-[0.92] font-extrabold tracking-tighter text-balance uppercase">
              {game?.name ?? "gamecommendo"}
            </p>
          </DesignSpecimen>
          <DesignSpecimen name="Headline" note="JetBrains Mono 800, 1.5rem">
            <p className="font-heading text-2xl leading-tight font-extrabold uppercase">
              Most popular
            </p>
          </DesignSpecimen>
          <DesignSpecimen name="Title" note="JetBrains Mono 600, 0.875rem">
            <p className="font-heading text-sm leading-snug font-semibold">
              {games[1]?.name ?? "How Recommendations work"}
            </p>
          </DesignSpecimen>
          <DesignSpecimen name="Body" note="Space Grotesk 400, 1rem">
            <p className="line-clamp-4 max-w-[68ch] leading-relaxed">
              {game?.summary ??
                "gamecommendo is a fake game shop. No prices, no cart, no checkout. It exists to show Recommendations matched by meaning."}
            </p>
          </DesignSpecimen>
          <DesignSpecimen name="Label" note="Space Grotesk 600, 0.625rem">
            <p className="text-[0.625rem] leading-none font-semibold tracking-widest uppercase">
              Highlight genre
            </p>
          </DesignSpecimen>
        </DesignBlock>

        <DesignBlock
          section={controls}
          description="The working parts. Everything here responds: hover, focus, open, type."
        >
          <DesignControls game={game} />
        </DesignBlock>

        {hasGames && (
          <DesignBlock
            section={pieces}
            description="Real Games from the Catalog, wearing the marks. The rings are specimens: they say nothing about what you own."
          >
            <DesignSpecimen name="Game marks" note="the ring is the mark">
              <ul className="grid max-w-2xl grid-cols-3 gap-4 md:gap-6">
                {marks.map((mark, idx) => {
                  const markGame = games[idx] ?? game;

                  return (
                    <li
                      key={mark.name}
                      className={cn("flex flex-col gap-3", mark.ring)}
                    >
                      <span className="text-[0.625rem] leading-none font-semibold tracking-widest text-muted-foreground uppercase">
                        {mark.name}
                      </span>
                      <GameCard game={markGame} />
                    </li>
                  );
                })}
              </ul>
            </DesignSpecimen>
            <DesignSpecimen name="Game facts" note="as IGDB has them">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                {game.totalRating && (
                  <GameScore
                    rating={game.totalRating}
                    className="size-10 text-sm"
                  />
                )}
                <span className="font-heading text-sm leading-snug font-semibold">
                  {game.name}
                </span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {[
                    toYear(game),
                    game.totalRatingCount &&
                      `${game.totalRatingCount.toLocaleString("en-US")} ratings`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            </DesignSpecimen>
          </DesignBlock>
        )}
      </div>
    </div>
  );
}
