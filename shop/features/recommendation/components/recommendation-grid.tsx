import { GameCard } from "@/features/game/components/game-card";
import { cn } from "@/lib/utils";
import { Recommendation } from "../types";

type RecommendationGridProps = React.ComponentProps<"ul"> & {
  recommendations: Recommendation[];
};

export function RecommendationGrid({
  recommendations,
  className,
  ...props
}: RecommendationGridProps) {
  return (
    <ul className={cn("grid gap-x-3 gap-y-5 md:gap-x-4", className)} {...props}>
      {recommendations.map((recommendation, idx) => (
        <li
          key={recommendation.id}
          style={{ animationDelay: `${idx * 50}ms` }}
          className="min-w-0 animate-in duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
        >
          <GameCard game={recommendation} />
        </li>
      ))}
    </ul>
  );
}
