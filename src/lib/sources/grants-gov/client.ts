import type {
  GrantsGovFetchOpportunityResponse,
  GrantsGovOpportunityDetail,
  GrantsGovOppHit,
  GrantsGovSearchRequest,
  GrantsGovSearchResponse,
} from "./types";

const BASE_URL = process.env.GRANTS_GOV_BASE_URL || "https://api.grants.gov/v1/api/search2";
const FETCH_OPPORTUNITY_URL = "https://api.grants.gov/v1/api/fetchOpportunity";
const DEFAULT_TIMEOUT_MS = 10_000;

export class GrantsGovClientError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "GrantsGovClientError";
  }
}

async function postJson<T>(url: string, body: unknown, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new GrantsGovClientError(`Grants.gov request failed with status ${response.status}`);
    }

    const json = (await response.json()) as { errorcode: number; msg: string };
    if (json.errorcode !== 0) {
      throw new GrantsGovClientError(`Grants.gov API error: ${json.msg}`);
    }

    return json as T;
  } catch (err) {
    if (err instanceof GrantsGovClientError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new GrantsGovClientError(`Grants.gov request timed out after ${timeoutMs}ms`, err);
    }
    throw new GrantsGovClientError("Grants.gov request failed", err);
  } finally {
    clearTimeout(timeout);
  }
}

/** Search Grants.gov for opportunities matching a keyword. Returns lightweight
 * hits only — call fetchOpportunityDetail() to get description/eligibility/funding. */
export async function searchOpportunities(
  request: GrantsGovSearchRequest
): Promise<{ hitCount: number; hits: GrantsGovOppHit[] }> {
  const response = await postJson<GrantsGovSearchResponse>(BASE_URL, {
    rows: 10,
    oppStatuses: "forecasted|posted",
    ...request,
  });

  return { hitCount: response.data.hitCount, hits: response.data.oppHits };
}

/** Fetch full detail (description, eligibility, funding range) for a single
 * opportunity by its Grants.gov id. */
export async function fetchOpportunityDetail(
  opportunityId: string
): Promise<GrantsGovOpportunityDetail> {
  const response = await postJson<GrantsGovFetchOpportunityResponse>(FETCH_OPPORTUNITY_URL, {
    opportunityId,
  });
  return response.data;
}
