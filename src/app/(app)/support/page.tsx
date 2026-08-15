import Link from "next/link";
import { MapPin, AlertTriangle, ShieldAlert, Compass, ExternalLink, ArrowRight } from "lucide-react";
import { getDemoContext, demoQueryParam } from "@/lib/demo-context";
import { computeReadiness, readinessGaps } from "@/lib/matching/readiness";
import { utahResourceForGap } from "@/fixtures/utah-resources";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ startup?: string; custom?: string; opportunity?: string }>;
}

export default async function SupportPage({ searchParams }: PageProps) {
  const { opportunity, ...sp } = await searchParams;
  const { index, profile, matching } = getDemoContext(sp);
  const qp = demoQueryParam({ index, profile });

  const result = opportunity
    ? matching.results.find((r) => r.opportunity.sourceId === opportunity)
    : matching.results[0];

  const readiness = result ? computeReadiness(profile, result.opportunity) : null;
  const gaps = readiness ? readinessGaps(readiness) : [];
  const resources = gaps.map((g) => utahResourceForGap(g.id)).filter((r) => r != null);

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-xl">
      <section className="max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full mb-4">
          <MapPin className="size-3.5" />
          <span className="font-label-caps text-label-caps">Utah-Only Experience</span>
        </div>
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
          Utah resources that can help you get ready
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {result
            ? `Based on your readiness assessment for ${result.opportunity.name}, we've identified key gaps. Here are specialized local partners in Utah to help you close them.`
            : "Once you have a matched opportunity, we'll identify readiness gaps and connect you with the Utah partners best suited to help close them."}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {resources.length === 0 && result && (
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] p-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              No open readiness gaps for {result.opportunity.name} — you&apos;re in good shape. See the Ready tab for your
              application package.
            </p>
          </div>
        )}

        {resources.map((resource) => (
          <div
            key={resource!.gapId}
            id={resource!.gapId}
            className="bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 overflow-hidden flex flex-col h-full border-t-4 border-error scroll-mt-24"
          >
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center gap-2 text-error mb-4">
                {resource!.gapIcon === "shield" ? <ShieldAlert className="size-5" /> : <AlertTriangle className="size-5" />}
                <span className="font-label-caps text-label-caps">{resource!.gapLabel}</span>
              </div>
              <h3 className="font-heading text-headline-sm text-primary mb-2">{resource!.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow">{resource!.description}</p>
              <div className="bg-surface-container-low rounded-lg p-4 mb-6">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">{resource!.bulletsLabel}</h4>
                <ul className="space-y-2">
                  {resource!.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="text-tertiary-fixed-dim mt-0.5">•</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-6 pt-0 mt-auto">
              {resource!.ctaKind === "primary" ? (
                <a
                  href={resource!.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-primary text-primary-foreground font-body-md text-body-md font-semibold py-3 px-4 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {resource!.ctaLabel}
                  <ArrowRight className="size-[18px]" />
                </a>
              ) : (
                <a
                  href={resource!.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-secondary text-secondary font-body-md text-body-md font-semibold py-3 px-4 rounded-lg hover:bg-secondary-fixed hover:border-transparent transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {resource!.ctaLabel}
                  <ExternalLink className="size-[18px]" />
                </a>
              )}
            </div>
          </div>
        ))}

        <div className="bg-primary text-primary-foreground rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 overflow-hidden flex flex-col h-full relative min-h-[280px]">
          <div className="relative z-10 p-6 flex-grow flex flex-col justify-center items-center text-center">
            <Compass className="size-12 text-secondary-fixed mb-4" />
            <h3 className="font-heading text-headline-md mb-2">Explore the Ecosystem</h3>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim mb-6">
              Discover more local partners, networking events, and state-funded programs tailored to your industry.
            </p>
            <Link
              href={`/?${qp}`}
              className="bg-secondary-fixed text-on-secondary-fixed font-body-md text-body-md font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity min-h-[48px] flex items-center"
            >
              View Full Resource Map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
