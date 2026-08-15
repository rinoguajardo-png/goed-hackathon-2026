import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Cog,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDemoContext, demoQueryParam } from "@/lib/demo-context";
import { computeReadiness } from "@/lib/matching/readiness";
import { formatFundingRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScoreComponentKey } from "@/types/matching";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ startup?: string; custom?: string }>;
}

const COMPONENT_ICON: Record<ScoreComponentKey, LucideIcon> = {
  technology: Cog,
  industry: Building2,
  funding: DollarSign,
  stageRelevance: TrendingUp,
  eligibility: ShieldCheck,
  strategic: Sparkles,
};

export default async function OpportunityDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const { index, profile, matching } = getDemoContext(sp);
  const qp = demoQueryParam({ index, profile });

  const result = matching.results.find((r) => r.opportunity.sourceId === id);
  if (!result) notFound();

  const readiness = computeReadiness(profile, result.opportunity);
  const topComponents = [...result.components].sort((a, b) => b.score - a.score).slice(0, 2);

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg flex flex-col gap-lg">
      <div>
        <Link
          href={`/?${qp}`}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span className="font-label-caps text-label-caps">Back to Map</span>
        </Link>
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
          {result.opportunity.name}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{result.opportunity.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-md border-t-4 border-tertiary-fixed-dim transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
            <h2 className="font-heading text-headline-md text-primary mb-sm flex items-center gap-2">
              <CheckCircle2 className="text-tertiary-fixed-dim size-6" />
              Opportunity Match
            </h2>
            <div className="mb-lg">
              <div className="flex justify-between items-end mb-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Overall Match Score</span>
                <span className="font-heading text-data-display text-primary">{Math.round(result.overallScore * 100)}%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div className="bg-tertiary-fixed-dim h-2 rounded-full" style={{ width: `${result.overallScore * 100}%` }} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-heading text-headline-sm text-on-surface mb-2">Why you match</h3>
              {topComponents.map((c) => {
                const Icon = COMPONENT_ICON[c.key];
                return (
                  <div key={c.key} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                    <Icon className="text-secondary size-5 mt-1 shrink-0" />
                    <div>
                      <span className="block font-body-sm text-body-sm font-bold text-on-surface capitalize">
                        {c.key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{c.explanation}</span>
                    </div>
                  </div>
                );
              })}
              {result.potentialConcerns.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-error-container rounded-lg border border-error/20">
                  <AlertTriangle className="text-error size-5 mt-1 shrink-0" />
                  <div>
                    <span className="block font-body-sm text-body-sm font-bold text-on-error-container">Potential Concerns</span>
                    <span className="font-body-sm text-body-sm text-on-error-container">{result.potentialConcerns[0]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-md transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
            <h3 className="font-heading text-headline-sm text-on-surface mb-4">Relevant Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[...result.opportunity.industries, ...result.opportunity.technologyAreas].slice(0, 6).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps rounded-full capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-md">
            <h3 className="font-heading text-headline-sm text-on-surface mb-4">What to verify next</h3>
            <ul className="flex flex-col gap-2 mb-4">
              {result.whatToVerify.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <AlertTriangle className="text-secondary size-4 mt-0.5 shrink-0" />
                  <span className="font-body-sm text-body-sm text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-heading text-headline-sm text-on-surface mb-2">Next steps</h3>
            <ul className="flex flex-col gap-2">
              {result.nextSteps.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="text-tertiary-fixed-dim size-4 mt-0.5 shrink-0" />
                  <span className="font-body-sm text-body-sm text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.historicalEvidence.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-md">
              <h3 className="font-heading text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <Landmark className="size-5 text-secondary" />
                Who else has received this money?
              </h3>
              <ul className="flex flex-col gap-3">
                {result.historicalEvidence.map((award) => (
                  <li key={award.sourceId} className="p-3 bg-surface-container-low rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-body-sm text-body-sm font-bold text-on-surface">{award.recipientName}</span>
                      {award.amount != null && (
                        <span className="font-label-caps text-label-caps text-secondary shrink-0">
                          {formatFundingRange(award.amount, null)}
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {award.awardTitle} — {award.agency} ({award.year}, {award.state})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-md h-full transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-headline-md text-primary flex items-center gap-2">
                <TrendingUp className="text-secondary size-6" />
                Company Readiness
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Current Readiness:</span>
                <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full font-label-caps text-label-caps">
                  {readiness.overallScore}%
                </span>
              </div>
            </div>

            <div className="flex-grow relative border-l-2 border-surface-variant ml-4 mb-lg space-y-8 py-4">
              {readiness.steps.map((step) => (
                <div key={step.id} className="relative pl-8">
                  <div
                    className={cn(
                      "absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-surface-container-lowest",
                      step.status === "complete" && "bg-tertiary-fixed-dim",
                      step.status === "current" && "bg-secondary animate-pulse",
                      step.status === "pending" && "bg-surface-container-high"
                    )}
                  />
                  <h4
                    className={cn(
                      "font-body-md text-body-md font-bold mb-1",
                      step.status === "current" ? "text-secondary" : step.status === "complete" ? "text-on-surface" : "text-on-surface-variant"
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{step.description}</p>
                  {step.ctaLabel && (
                    <Link
                      href={`/support?${qp}#${step.id}`}
                      className="inline-block bg-surface-container-high hover:bg-surface-variant text-on-surface px-4 py-2 rounded-lg font-label-caps text-label-caps transition-colors border border-outline-variant"
                    >
                      {step.ctaLabel}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <Link
              href={`/support?${qp}`}
              className="w-full bg-primary hover:bg-primary-container text-primary-foreground font-body-md text-body-md font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto min-h-[48px]"
            >
              Improve Readiness
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
