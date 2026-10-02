import Link from "next/link";

import { DismissalButton } from "@/features/dismissal/components/dismissal-button";
import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { PersonalRecommendation } from "../types";

type PersonalRecommendationSectionItemProps = React.ComponentProps<"li"> & {
  recommendation: PersonalRecommendation;
};

function PersonalRecommendationSectionItem({
  recommendation,
  className,
  ...props
}: PersonalRecommendationSectionItemProps) {
  const { game, because, otherReasonCount } = recommendation;
  const hasOtherReasons = otherReasonCount > 0;

  return (
    <li
      className={cn(
        "flex min-w-0 animate-in flex-col gap-2 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      <div className="group/dismiss relative">
        <GameCard game={game} />
        <DismissalButton
          gameId={game.id}
          gameName={game.name}
          className="absolute top-2 right-2 opacity-0 group-focus-within/dismiss:opacity-100 group-hover/dismiss:opacity-100 [@media(hover:none)]:opacity-100"
        />
      </div>
      <p className="line-clamp-3 border-t border-foreground/10 pt-2 text-xs leading-relaxed text-muted-foreground">
        Because you own{" "}
        <span className="text-foreground">{because.join(", ")}</span>
        {hasOtherReasons && (
          <span className="tabular-nums"> and {otherReasonCount} more</span>
        )}
      </p>
    </li>
  );
}

type PersonalRecommendationSectionProps = React.ComponentProps<"section"> & {
  recommendations: PersonalRecommendation[];
  libraryGameCount: number;
};

export function PersonalRecommendationSection({
  recommendations,
  libraryGameCount,
  className,
  ...props
}: PersonalRecommendationSectionProps) {
  const hasLibrary = libraryGameCount > 0;
  const hasRecommendations = recommendations.length > 0;

  if (hasLibrary && !hasRecommendations) return null;

  return (
    <section
      aria-labelledby="personal-recommendations-heading"
      className={cn("pt-2 pb-10 md:pb-14", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 md:px-8">
        <div className="flex flex-col gap-2 border-t border-foreground/10 pt-10 pb-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-14 md:pb-6">
          <h2
            id="personal-recommendations-heading"
            className="scroll-mt-24 font-heading text-2xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-4xl"
          >
            Recommended for you
          </h2>
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-right">
            {hasLibrary ? (
              <>
                Games closest in meaning to the{" "}
                <span className="tabular-nums">
                  {libraryGameCount.toLocaleString("en-US")}
                </span>{" "}
                in your Library. None of them are Games you already own, love or
                dismissed.
              </>
            ) : (
              <>
                Your Library is empty.{" "}
                <Link
                  href="/profile"
                  className="text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Add the Games you own
                </Link>{" "}
                and Recommendations picked for you appear here.
              </>
            )}
          </p>
        </div>
        {hasRecommendations && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-4 lg:grid-cols-6">
            {recommendations.map((recommendation, idx) => (
              <PersonalRecommendationSectionItem
                key={recommendation.game.id}
                recommendation={recommendation}
                style={{ animationDelay: `${idx * 30}ms` }}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
