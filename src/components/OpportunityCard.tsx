import { AlertTriangle, CalendarClock, CircleHelp, DollarSign, ExternalLink, ListChecks } from "lucide-react";
import type { GovernmentOpportunity } from "@/types/government-opportunity";
import type { FitClassification } from "@/types/matching";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FitClassificationBadge } from "./FitClassificationBadge";
import { MatchScoreIndicator } from "./MatchScoreIndicator";
import { WhyThisMatches } from "./WhyThisMatches";
import { BulletList } from "./BulletList";

export interface OpportunityCardProps {
  opportunity: GovernmentOpportunity;
  /** Match-related fields are optional so this card can render an
   * opportunity on its own (e.g. a raw source-adapter preview) before the
   * matching engine exists, and the full result once it does. */
  score?: number;
  classification?: FitClassification;
  explanation?: string;
  potentialConcerns?: string[];
  whatToVerify?: string[];
  nextSteps?: string[];
}

export function OpportunityCard({
  opportunity,
  score,
  classification,
  explanation,
  potentialConcerns = [],
  whatToVerify = [],
  nextSteps = [],
}: OpportunityCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {opportunity.source} · {opportunity.agency ?? "Agency unknown"}
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-foreground">
              {opportunity.sourceUrl ? (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  {opportunity.name}
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                </a>
              ) : (
                opportunity.name
              )}
            </h3>
          </div>
          {classification && <FitClassificationBadge classification={classification} />}
        </div>

        {typeof score === "number" && (
          <div className="mt-1">
            <MatchScoreIndicator score={score} />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {opportunity.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{opportunity.description}</p>
        )}

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {opportunity.deadline && (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" />
              Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          )}
          {(opportunity.funding.min || opportunity.funding.max) && (
            <span className="inline-flex items-center gap-1">
              <DollarSign className="size-3.5" />
              {opportunity.funding.min ? `$${opportunity.funding.min.toLocaleString()}` : "?"} –{" "}
              {opportunity.funding.max ? `$${opportunity.funding.max.toLocaleString()}` : "?"}
            </span>
          )}
        </div>

        {explanation && (
          <>
            <Separator />
            <div className="space-y-3">
              <WhyThisMatches explanation={explanation} />
              <BulletList
                title="Potential concerns"
                items={potentialConcerns}
                emptyLabel="None flagged"
                icon={AlertTriangle}
                iconClassName="text-amber-600"
              />
              <BulletList
                title="What to verify"
                items={whatToVerify}
                emptyLabel="Nothing outstanding"
                icon={CircleHelp}
                iconClassName="text-blue-600"
              />
              <BulletList
                title="Next steps"
                items={nextSteps}
                emptyLabel="None yet"
                icon={ListChecks}
                iconClassName="text-emerald-600"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
