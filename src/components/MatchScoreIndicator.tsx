import { Progress } from "@/components/ui/progress";

export function MatchScoreIndicator({ score }: { score: number }) {
  const percent = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2.5">
      <Progress value={percent} className="w-28" />
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{percent}% match</span>
    </div>
  );
}
