import type { FitClassification } from "@/types/matching";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<FitClassification, string> = {
  "likely-fit": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "potential-fit-verify-eligibility": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "adjacent-opportunity": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "probably-not-a-fit": "bg-muted text-muted-foreground",
};

const LABELS: Record<FitClassification, string> = {
  "likely-fit": "Likely Fit",
  "potential-fit-verify-eligibility": "Potential Fit — Verify Eligibility",
  "adjacent-opportunity": "Adjacent Opportunity",
  "probably-not-a-fit": "Probably Not a Fit",
};

export function FitClassificationBadge({ classification }: { classification: FitClassification }) {
  return <Badge className={cn("border-0", STYLES[classification])}>{LABELS[classification]}</Badge>;
}
