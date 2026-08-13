import sampleSolicitations from "./fixtures/sample-solicitations.json";
import sampleAwards from "./fixtures/sample-awards.json";
import { normalizeSbirAward, normalizeSbirSolicitation } from "./normalize";
import type { SbirAward, SbirSolicitation } from "./types";
import type { GovernmentOpportunity } from "@/types/government-opportunity";
import type { HistoricalAward } from "@/types/historical-award";

/**
 * Today's data source is a fixture (the live api.www.sbir.gov endpoint
 * returned 403 Forbidden when tested — likely IP-gated). Tomorrow, swap the
 * body of these two functions for real fetch() calls; callers and
 * normalize.ts don't change.
 */

export function getSampleOpportunities(): GovernmentOpportunity[] {
  return (sampleSolicitations as SbirSolicitation[]).map(normalizeSbirSolicitation);
}

export function getSampleHistoricalAwards(): HistoricalAward[] {
  return (sampleAwards as SbirAward[]).map(normalizeSbirAward);
}
