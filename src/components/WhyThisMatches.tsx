import { Sparkles } from "lucide-react";

export function WhyThisMatches({ explanation }: { explanation: string }) {
  return (
    <div>
      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        Why this matches
      </h4>
      <p className="mt-1.5 text-sm text-foreground/90">{explanation}</p>
    </div>
  );
}
