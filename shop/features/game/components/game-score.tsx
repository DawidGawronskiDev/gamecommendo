import { cn } from "@/lib/utils";

type GameScoreProps = React.ComponentProps<"span"> & {
  rating: number;
};

const scoreTone = (score: number) =>
  score >= 85 ? "bg-primary" : score >= 70 ? "bg-chart-2" : "bg-chart-3";

export function GameScore({ rating, className, ...props }: GameScoreProps) {
  const score = Math.round(rating);

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center font-bold text-primary-foreground tabular-nums",
        scoreTone(score),
        className,
      )}
      {...props}
    >
      {score}
    </span>
  );
}
