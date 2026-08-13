import Link from "next/link";
import { AlertCircle, HeartPulse, Factory, Droplets, ShieldCheck, Users2, SearchX, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GOED_TEST_STARTUPS } from "@/fixtures/goed-test-startups";
import { fetchNormalizedOpportunities } from "@/lib/sources/grants-gov";
import { GrantsGovClientError } from "@/lib/sources/grants-gov/client";
import { StartupProfilePreview } from "@/components/StartupProfilePreview";
import { OpportunityCard } from "@/components/OpportunityCard";
import { CompanyDescriptionDemo } from "@/components/CompanyDescriptionDemo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STARTUP_ICONS: LucideIcon[] = [HeartPulse, Factory, Droplets, ShieldCheck, Users2];

interface HomeProps {
  searchParams: Promise<{ startup?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { startup } = await searchParams;
  const index = Math.min(Math.max(Number(startup ?? 0), 0), GOED_TEST_STARTUPS.length - 1);
  const profile = GOED_TEST_STARTUPS[index];

  const keyword = [...profile.technologies, ...profile.industry].slice(0, 3).join(" ");

  let opportunities: Awaited<ReturnType<typeof fetchNormalizedOpportunities>> = [];
  let fetchError: string | null = null;
  try {
    opportunities = await fetchNormalizedOpportunities(keyword, 3);
  } catch (err) {
    fetchError = err instanceof GrantsGovClientError ? err.message : "Failed to reach Grants.gov";
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          What federal resources could help your company grow — and why?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Foundation build. Matching and eligibility logic land tomorrow — this page proves the
          schemas, live Grants.gov adapter, and UI components work end to end.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          GOED test startups
        </h2>
        <div className="flex flex-wrap gap-2">
          {GOED_TEST_STARTUPS.map((s, i) => {
            const Icon = STARTUP_ICONS[i];
            return (
              <Link
                key={s.companyName}
                href={`/?startup=${i}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  i === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-3.5" />
                {s.companyName?.replace("GOED Test ", "")}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <StartupProfilePreview profile={profile} />
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Or describe your own company
            </h2>
          </CardHeader>
          <CardContent>
            <CompanyDescriptionDemo />
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-8" />

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Government Opportunity Map
        </h2>
        <p className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Live Grants.gov · keyword: &quot;{keyword}&quot;
        </p>
        {fetchError && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}
        {!fetchError && opportunities.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            <SearchX className="size-4 shrink-0" />
            No opportunities found for this keyword.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {opportunities.map((o, i) =>
            i === 0 ? (
              <OpportunityCard
                key={o.sourceId}
                opportunity={o}
                score={0.62}
                classification="potential-fit-verify-eligibility"
                explanation="Illustrative only — the matching engine isn't implemented yet. This shows how a scored result will render once scoring lands tomorrow."
                potentialConcerns={["Eligibility text above needs a rules-based check, not just a keyword match."]}
                whatToVerify={["Confirm applicant type matches this opportunity's eligibility requirements."]}
                nextSteps={["Review the full NOFO/solicitation text before drafting a LOI."]}
              />
            ) : (
              <OpportunityCard key={o.sourceId} opportunity={o} />
            )
          )}
        </div>
      </section>
    </div>
  );
}
