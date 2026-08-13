import { GovernmentOpportunitySchema, type GovernmentOpportunity } from "@/types/government-opportunity";
import { HistoricalAwardSchema, type HistoricalAward } from "@/types/historical-award";
import type { SbirAward, SbirSolicitation } from "./types";

function toIsoOrNull(value: string | undefined | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseAmount(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) return null;
  const numeric = typeof value === "number" ? value : Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

/** A solicitation becomes a GovernmentOpportunity. Topics are folded into the
 * description since that's where the specific ask usually lives. */
export function normalizeSbirSolicitation(solicitation: SbirSolicitation): GovernmentOpportunity {
  const topicSummaries = (solicitation.solicitation_topics ?? [])
    .map((t) => [t.topic_title, t.topic_description].filter(Boolean).join(": "))
    .filter(Boolean);

  const raw: GovernmentOpportunity = {
    source: "sbir",
    sourceId: solicitation.solicitation_number,
    name: solicitation.solicitation_title,
    agency: [solicitation.agency, solicitation.branch].filter(Boolean).join(" / ") || null,
    description: topicSummaries.length ? topicSummaries.join("\n\n") : null,
    opportunityType: solicitation.program === "STTR" ? "sttr" : "sbir",
    eligibility: "Small business concerns (SBIR/STTR eligibility rules apply)",
    funding: { min: null, max: null, currency: "USD" },
    postedDate: toIsoOrNull(solicitation.open_date),
    deadline: toIsoOrNull(solicitation.close_date ?? solicitation.application_due_date),
    industries: [],
    technologyAreas: solicitation.research_area_keywords ?? [],
    geography: [],
    sourceUrl: solicitation.solicitation_agency_url ?? null,
    rawSourceData: solicitation,
    fetchedAt: new Date().toISOString(),
  };

  return GovernmentOpportunitySchema.parse(raw);
}

/** A past award becomes a HistoricalAward — evidence for "who else has
 * received this money?" */
export function normalizeSbirAward(award: SbirAward): HistoricalAward {
  const raw: HistoricalAward = {
    source: "sbir",
    sourceId: award.agency_tracking_number ?? `${award.firm}-${award.award_year ?? "unknown"}`,
    recipientName: award.firm,
    agency: [award.agency, award.branch].filter(Boolean).join(" / ") || null,
    program: award.program ?? null,
    awardTitle: award.award_title,
    amount: parseAmount(award.award_amount),
    year: award.award_year ?? null,
    state: award.state ?? null,
    naicsCode: null,
    category: award.phase ?? null,
    technologyArea: award.research_area_keywords?.[0] ?? null,
    description: award.abstract ?? null,
    rawSourceData: award,
  };

  return HistoricalAwardSchema.parse(raw);
}
