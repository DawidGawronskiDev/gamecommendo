import { cn } from "@/lib/utils";

type GameScoreProps = React.ComponentProps<"span"> & {
  rating: number;
};

const scoreTone = (score: number) =>
  score >= 85
    ? "bg-score-great"
    : score >= 70
      ? "bg-score-good"
      : "bg-score-mixed";

export function GameScore({ rating, className, ...props }: GameScoreProps) {
  const score = Math.round(rating);

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center font-bold text-score-foreground tabular-nums",
        scoreTone(score),
        className,
      )}
      {...props}
    >
      {score}
    </span>
  );
}
