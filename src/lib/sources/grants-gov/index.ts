import { fetchOpportunityDetail, searchOpportunities, GrantsGovClientError } from "./client";
import { normalizeGrantsGovOpportunity } from "./normalize";
import type { GovernmentOpportunity } from "@/types/government-opportunity";

export { GrantsGovClientError };

/**
 * High-level entry point for the rest of the app: search by keyword, fetch
 * full detail for the top N hits, normalize, return. Detail fetches are
 * capped and best-effort — a single bad opportunity shouldn't fail the batch.
 */
export async function fetchNormalizedOpportunities(
  keyword: string,
  limit = 5
): Promise<GovernmentOpportunity[]> {
  const { hits } = await searchOpportunities({ keyword, rows: limit });

  const results = await Promise.allSettled(
    hits.slice(0, limit).map(async (hit) => {
      const detail = await fetchOpportunityDetail(hit.id);
      return normalizeGrantsGovOpportunity(detail);
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<GovernmentOpportunity> => r.status === "fulfilled")
    .map((r) => r.value);
}
