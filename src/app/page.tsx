import Link from "next/link";
import { GOED_TEST_STARTUPS } from "@/fixtures/goed-test-startups";
import { fetchNormalizedOpportunities } from "@/lib/sources/grants-gov";
import { GrantsGovClientError } from "@/lib/sources/grants-gov/client";
import { StartupProfilePreview } from "@/components/StartupProfilePreview";
import { OpportunityCard } from "@/components/OpportunityCard";
import { CompanyDescriptionDemo } from "@/components/CompanyDescriptionDemo";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          GOED Federal Funding Intelligence — infrastructure preview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Foundation build. Matching/eligibility logic is not implemented yet — this page proves the
          schemas, live Grants.gov adapter, and UI components work end to end.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          GOED test startups
        </h2>
        <div className="flex flex-wrap gap-2">
          {GOED_TEST_STARTUPS.map((s, i) => (
            <Link
              key={s.companyName}
              href={`/?startup=${i}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                i === index
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
              }`}
            >
              {s.companyName?.replace("GOED Test ", "")}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <StartupProfilePreview profile={profile} />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Or describe your own company
        </h2>
        <CompanyDescriptionDemo />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Government Opportunity Map (live Grants.gov, keyword: &quot;{keyword}&quot;)
        </h2>
        {fetchError && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {fetchError}
          </p>
        )}
        {!fetchError && opportunities.length === 0 && (
          <p className="text-sm text-gray-400 italic">No opportunities found for this keyword.</p>
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
