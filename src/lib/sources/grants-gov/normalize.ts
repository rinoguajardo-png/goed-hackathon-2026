import type { GovernmentOpportunity } from "@/types/government-opportunity";
import { GovernmentOpportunitySchema } from "@/types/government-opportunity";
import type { GrantsGovOpportunityDetail } from "./types";

function parseGrantsGovDate(value: string | undefined | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseMoneyString(value: string | undefined | null): number | null {
  if (!value) return null;
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

/** Grants.gov description/eligibility fields come back as raw HTML. We only
 * ever display them as plain text, so strip tags and decode entities here
 * rather than pushing HTML handling into every consumer. */
function stripHtml(value: string | undefined | null): string | null {
  if (!value) return null;
  const withoutTags = value.replace(/<[^>]*>/g, " ");
  const decoded = withoutTags.replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => HTML_ENTITIES[m]);
  return decoded.replace(/\s+/g, " ").trim() || null;
}

/** Converts a Grants.gov opportunity (from fetchOpportunityDetail) into our
 * internal GovernmentOpportunity shape. This is the ONLY place Grants.gov
 * field names (synopsis, forecast, awardCeiling, ...) should appear. */
export function normalizeGrantsGovOpportunity(
  detail: GrantsGovOpportunityDetail
): GovernmentOpportunity {
  // Posted opportunities carry a `synopsis`; forecasted ones carry a
  // `forecast` with slightly different field names. Prefer synopsis.
  const synopsis = detail.synopsis;
  const forecast = detail.forecast;

  const description = stripHtml(synopsis?.synopsisDesc ?? forecast?.forecastDesc);
  const eligibility = stripHtml(synopsis?.applicantEligibilityDesc ?? forecast?.applicantEligibilityDesc);
  const postedDate = parseGrantsGovDate(synopsis?.postingDate ?? forecast?.estSynopsisPostingDate);
  const deadline = parseGrantsGovDate(synopsis?.responseDate ?? forecast?.estApplicationResponseDate);
  const fundingMin = parseMoneyString(synopsis?.awardFloor ?? forecast?.awardFloor);
  const fundingMax = parseMoneyString(synopsis?.awardCeiling ?? forecast?.awardCeiling);
  const technologyAreas = (synopsis?.fundingActivityCategories ?? forecast?.fundingActivityCategories ?? [])
    .map((c) => c.description)
    .filter((v): v is string => Boolean(v));

  const agency =
    detail.agencyDetails?.agencyName ?? detail.topAgencyDetails?.agencyName ?? null;

  const raw: GovernmentOpportunity = {
    source: "grants.gov",
    sourceId: String(detail.id),
    name: detail.opportunityTitle,
    agency,
    description,
    opportunityType: "grant",
    eligibility,
    funding: { min: fundingMin, max: fundingMax, currency: "USD" },
    postedDate,
    deadline,
    industries: [],
    technologyAreas,
    geography: [],
    sourceUrl: `https://www.grants.gov/search-results-detail/${detail.id}`,
    rawSourceData: detail,
    fetchedAt: new Date().toISOString(),
  };

  return GovernmentOpportunitySchema.parse(raw);
}
