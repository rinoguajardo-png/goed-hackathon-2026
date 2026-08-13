import type { GovernmentOpportunity } from "@/types/government-opportunity";
import type { FitClassification } from "@/types/matching";
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
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {opportunity.source} · {opportunity.agency ?? "Agency unknown"}
          </p>
          <h3 className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {opportunity.sourceUrl ? (
              <a href={opportunity.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline">
                {opportunity.name}
              </a>
            ) : (
              opportunity.name
            )}
          </h3>
        </div>
        {classification && <FitClassificationBadge classification={classification} />}
      </div>

      {typeof score === "number" && (
        <div className="mt-2">
          <MatchScoreIndicator score={score} />
        </div>
      )}

      {opportunity.description && (
        <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{opportunity.description}</p>
      )}

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
        {opportunity.deadline && <div>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</div>}
        {(opportunity.funding.min || opportunity.funding.max) && (
          <div>
            Funding: {opportunity.funding.min ? `$${opportunity.funding.min.toLocaleString()}` : "?"} –{" "}
            {opportunity.funding.max ? `$${opportunity.funding.max.toLocaleString()}` : "?"}
          </div>
        )}
      </dl>

      {explanation && (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          <WhyThisMatches explanation={explanation} />
          <BulletList title="Potential concerns" items={potentialConcerns} emptyLabel="None flagged" />
          <BulletList title="What to verify" items={whatToVerify} emptyLabel="Nothing outstanding" />
          <BulletList title="Next steps" items={nextSteps} emptyLabel="None yet" />
        </div>
      )}
    </div>
  );
}
