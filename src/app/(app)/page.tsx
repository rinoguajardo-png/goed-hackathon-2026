import Link from "next/link";
import { TrendingUp, DollarSign, Landmark, CalendarClock, Sparkles, ChevronRight, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { getDemoContext, demoQueryParam } from "@/lib/demo-context";
import { computeReadiness } from "@/lib/matching/readiness";
import { StartupSwitcher } from "@/components/StartupSwitcher";
import { formatFundingRange, formatDeadline, formatMoney, daysUntil } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ startup?: string; custom?: string }>;
}

export default async function OpportunityMapPage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { index, profile, matching } = getDemoContext(params);
  const qp = demoQueryParam({ index, profile });

  const highPotential = matching.results.filter(
    (r) => r.classification === "likely-fit" || r.classification === "potential-fit-verify-eligibility"
  );
  const totalFunding = highPotential.reduce((sum, r) => sum + (r.opportunity.funding.max ?? 0), 0);
  const agencyCount = new Set(highPotential.map((r) => r.opportunity.agency).filter(Boolean)).size;
  const deadlineSoonCount = matching.results.filter((r) => {
    const d = daysUntil(r.opportunity.deadline);
    return d != null && d >= 0 && d <= 30;
  }).length;

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg flex flex-col gap-lg">
      <section className="flex flex-col gap-sm">
        <div className="inline-flex w-fit items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full">
          <MapPin className="size-3.5" />
          <span className="font-label-caps text-label-caps">Utah-Only Experience</span>
        </div>
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary">
          Your Government Opportunity Map
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Discover and evaluate targeted government contracts and grants aligned with{" "}
          <strong className="text-on-surface">{profile.companyDescription ?? profile.companyName}</strong>. Opportunities
          are ranked by potential and operational readiness.
        </p>
        <StartupSwitcher activeIndex={index} />
      </section>

      {!matching.hasStrongMatch ? (
        <section className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-lg flex flex-col items-center text-center gap-sm">
          <AlertTriangle className="text-error size-8" />
          <h2 className="font-heading text-headline-md text-primary">No strong federal opportunity right now</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[36rem]">{matching.summary}</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
            <KpiCard label="High-Potential" value={String(highPotential.length)} sub="Matched opportunities" icon={TrendingUp} iconClass="text-tertiary-container" />
            <KpiCard label="Total Funding" value={formatMoney(totalFunding)} sub="Available pool" icon={DollarSign} iconClass="text-primary" />
            <KpiCard label="Agencies" value={String(agencyCount)} sub="Sponsoring entities" icon={Landmark} iconClass="text-secondary" />
            <KpiCard label="Deadlines" value={String(deadlineSoonCount)} sub="Within 30 days" icon={CalendarClock} iconClass="text-error" />
          </section>

          <section className="flex flex-col gap-md">
            <h2 className="font-heading text-headline-md text-primary flex items-center gap-sm">
              <Sparkles className="size-6" />
              High Potential Matches
            </h2>

            {highPotential.map((result, i) => {
              const readiness = computeReadiness(profile, result.opportunity);
              const isTop = i === 0;
              const passedChecks = result.eligibilityChecks.filter((c) => c.passed === true);
              const gaps = readiness.steps.filter((s) => s.status !== "complete" && s.id !== "ready-to-apply");

              if (!isTop) {
                return (
                  <Link
                    key={result.opportunity.sourceId}
                    href={`/opportunity/${result.opportunity.sourceId}?${qp}`}
                    className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] overflow-hidden border-t-2 border-surface-variant opacity-90 hover:opacity-100 transition-all p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md"
                  >
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-caps text-label-caps text-secondary uppercase">
                        {result.opportunity.opportunityType} • Agency: {result.opportunity.agency ?? result.opportunity.source}
                      </span>
                      <h4 className="font-heading text-headline-sm text-primary">{result.opportunity.name}</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {formatDeadline(result.opportunity.deadline)} • {formatFundingRange(result.opportunity.funding.min, result.opportunity.funding.max)}
                      </span>
                    </div>
                    <div className="flex items-center gap-md">
                      <ScoreStat label="Match" value={result.overallScore} />
                      <ScoreStat label="Readiness" value={readiness.overallScore / 100} />
                      <ChevronRight className="text-secondary size-5" />
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={result.opportunity.sourceId}
                  className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] overflow-hidden border-t-2 border-tertiary-fixed-dim relative"
                >
                  <div className="absolute top-md right-md bg-surface-container px-3 py-1 rounded-full flex items-center gap-xs">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                      {formatDeadline(result.opportunity.deadline)}
                    </span>
                  </div>
                  <div className="p-md md:p-lg flex flex-col md:flex-row gap-lg md:gap-xl">
                    <div className="flex-1 flex flex-col gap-md">
                      <div className="flex flex-col gap-xs pt-8 md:pt-0">
                        <span className="font-label-caps text-label-caps text-secondary uppercase">
                          {result.opportunity.opportunityType} • Agency: {result.opportunity.agency ?? result.opportunity.source}
                        </span>
                        <h3 className="font-heading text-headline-md text-primary">{result.opportunity.name}</h3>
                        <div className="flex flex-wrap items-center gap-sm mt-2">
                          {result.opportunity.industries.slice(0, 2).map((tag) => (
                            <span key={tag} className="bg-surface-variant text-on-surface-variant font-label-caps text-label-caps px-2 py-1 rounded capitalize">
                              {tag}
                            </span>
                          ))}
                          <span className="bg-surface-variant text-on-surface-variant font-label-caps text-label-caps px-2 py-1 rounded">
                            {formatFundingRange(result.opportunity.funding.min, result.opportunity.funding.max)}
                          </span>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">{result.opportunity.description}</p>
                      <div className="flex flex-col sm:flex-row gap-sm mt-auto pt-4 border-t border-surface-container">
                        <Link
                          href={`/opportunity/${result.opportunity.sourceId}?${qp}`}
                          className="bg-primary hover:bg-primary-container text-primary-foreground font-label-caps text-label-caps px-6 py-3 rounded-lg h-12 flex items-center justify-center transition-colors"
                        >
                          View Opportunity
                        </Link>
                        <Link
                          href={`/support?${qp}`}
                          className="border border-secondary text-secondary hover:bg-surface-container-low font-label-caps text-label-caps px-6 py-3 rounded-lg h-12 flex items-center justify-center transition-colors"
                        >
                          Improve Readiness
                        </Link>
                      </div>
                    </div>
                    <div className="md:w-80 flex flex-col gap-md bg-surface-container-low rounded-lg p-md">
                      <div className="flex items-center justify-between">
                        <span className="font-body-md text-body-md font-bold text-primary">Match Score</span>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-data-display text-tertiary-container">
                            {Math.round(result.overallScore * 100)}%
                          </span>
                          <CheckCircle2 className="text-tertiary-fixed-dim size-5" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-body-md text-body-md font-bold text-primary">Readiness Score</span>
                          <span className={cn("font-heading text-headline-sm font-bold", readiness.overallScore >= 80 ? "text-tertiary-container" : "text-error")}>
                            {readiness.overallScore}%
                          </span>
                        </div>
                        <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", readiness.overallScore >= 80 ? "bg-tertiary-fixed-dim" : "bg-[#f59e0b]")}
                            style={{ width: `${readiness.overallScore}%` }}
                          />
                        </div>
                      </div>
                      <hr className="border-surface-variant/50 my-2" />
                      <div className="flex flex-col gap-sm">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Why this matches</span>
                        <ul className="flex flex-col gap-2">
                          {passedChecks.slice(0, 2).map((c) => (
                            <li key={c.rule} className="flex items-start gap-2">
                              <CheckCircle2 className="text-tertiary-fixed-dim size-4 mt-0.5 shrink-0" />
                              <span className="font-body-sm text-body-sm text-on-surface">{c.rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {gaps.length > 0 && (
                        <div className="flex flex-col gap-sm mt-2">
                          <span className="font-label-caps text-label-caps text-on-surface-variant">Readiness gaps</span>
                          <ul className="flex flex-col gap-2">
                            {gaps.slice(0, 2).map((g) => (
                              <li key={g.id} className="flex items-start gap-2">
                                <AlertTriangle className="text-error size-4 mt-0.5 shrink-0" />
                                <span className="font-body-sm text-body-sm text-on-surface">{g.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof TrendingUp;
  iconClass: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-md rounded-xl shadow-[var(--shadow-card)] flex flex-col gap-xs hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
        <Icon className={cn("size-5", iconClass)} />
      </div>
      <div className="font-heading text-data-display text-primary">{value}</div>
      <div className="font-body-sm text-body-sm text-on-surface-variant">{sub}</div>
    </div>
  );
}

function ScoreStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-end">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <span className="font-heading text-headline-sm text-primary">{Math.round(value * 100)}%</span>
    </div>
  );
}
