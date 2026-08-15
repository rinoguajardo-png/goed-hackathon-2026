import Link from "next/link";
import { CheckCircle2, CircleDashed, Radar, Activity, CalendarClock, ArrowRight } from "lucide-react";
import { getDemoContext, demoQueryParam } from "@/lib/demo-context";
import { computeReadiness, readinessGaps } from "@/lib/matching/readiness";
import { DownloadPackageButton } from "@/components/DownloadPackageButton";
import { formatDeadline } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ startup?: string; custom?: string }>;
}

export default async function ReadyPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { index, profile, matching } = getDemoContext(sp);
  const qp = demoQueryParam({ index, profile });

  const top = matching.results[0];
  const readiness = top ? computeReadiness(profile, top.opportunity) : null;
  const complete = readiness?.overallScore === 100;
  const gaps = readiness ? readinessGaps(readiness) : [];

  const nextBest = matching.results[1];

  const packageContent = top
    ? [
        `UT Opportunity Navigator — Readiness Package`,
        `Company: ${profile.companyName}`,
        `Opportunity: ${top.opportunity.name} (${top.opportunity.agency ?? top.opportunity.source})`,
        `Match Score: ${Math.round(top.overallScore * 100)}%`,
        `Readiness Score: ${readiness?.overallScore ?? 0}%`,
        ``,
        `Readiness checklist:`,
        ...(readiness?.steps.map((s) => `- [${s.status === "complete" ? "x" : " "}] ${s.title} — ${s.description}`) ?? []),
        ``,
        `Next steps:`,
        ...top.nextSteps.map((s) => `- ${s}`),
      ].join("\n")
    : "No matched opportunity yet.";

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-2 text-tertiary-fixed-dim">
          {complete ? <CheckCircle2 className="size-5" /> : <CircleDashed className="size-5" />}
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Status: {complete ? "Ready" : "In Progress"}
          </span>
        </div>
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary">Application Readiness</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {top
            ? complete
              ? `You're ready to pursue ${top.opportunity.name}. Your readiness package is complete.`
              : `Working toward ${top.opportunity.name}. ${readiness?.overallScore ?? 0}% of your readiness package is complete.`
            : "Describe your company on the Intake tab to generate a readiness package."}
        </p>
      </div>

      {top && readiness && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-md shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col gap-md border border-outline-variant/30">
            <div className="flex items-center justify-between border-b border-surface-variant pb-sm">
              <h3 className="font-heading text-headline-md text-primary-container">Readiness Package</h3>
              <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-caps text-label-caps flex items-center gap-1">
                <CheckCircle2 className="size-4" />
                {readiness.overallScore}% COMPLETE
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              {readiness.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-md p-sm bg-surface rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {step.status === "complete" ? (
                      <CheckCircle2 className="text-tertiary-fixed-dim size-6" />
                    ) : (
                      <CircleDashed className={cn("size-6", step.status === "current" ? "text-secondary" : "text-outline-variant")} />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h4 className="font-body-md text-body-md font-bold text-on-surface">{step.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-sm flex flex-col sm:flex-row justify-end gap-sm">
              {gaps.length > 0 && (
                <Link
                  href={`/support?${qp}`}
                  className="border border-secondary text-secondary hover:bg-surface-container-low font-body-md text-body-md font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Get Utah Support for Open Gaps
                  <ArrowRight className="size-[18px]" />
                </Link>
              )}
              <DownloadPackageButton fileName={`${profile.companyName ?? "company"}-readiness-package.txt`} content={packageContent} />
            </div>
          </section>

          <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-md shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col gap-md border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-surface-variant pb-sm z-10">
              <h3 className="font-heading text-headline-sm text-primary-container flex items-center gap-2">
                <Radar className="text-secondary size-5" />
                Monitoring
              </h3>
              <div className="w-10 h-6 bg-secondary rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-sm z-10 flex-grow">
              <div className="bg-surface-container-low p-sm rounded-lg flex items-center gap-3">
                <Activity className="text-secondary size-5" />
                <div>
                  <p className="font-body-md text-body-md font-bold text-on-surface">Status: Active</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Scanning federal databases...</p>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                We&apos;ll keep comparing new federal opportunities against your profile and email you when a high-confidence
                match appears.
              </p>
              {nextBest && (
                <div className="mt-auto pt-4">
                  <p className="font-label-caps text-label-caps text-outline mb-2">NEXT BEST MATCH</p>
                  <div className="bg-surface rounded-lg p-3 border-l-4 border-secondary shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-body-sm text-body-sm font-bold text-on-surface line-clamp-1">{nextBest.opportunity.name}</span>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed text-xs px-2 py-0.5 rounded font-bold shrink-0">
                        {Math.round(nextBest.overallScore * 100)}% Match
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      {nextBest.opportunity.agency ?? nextBest.opportunity.source}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-error text-xs font-bold">
                      <CalendarClock className="size-3.5" />
                      {formatDeadline(nextBest.opportunity.deadline)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
