import { NextRequest, NextResponse } from "next/server";
import { fetchNormalizedOpportunities } from "@/lib/sources/grants-gov";
import { GrantsGovClientError } from "@/lib/sources/grants-gov/client";

/** Proves: application -> Grants.gov -> real response -> normalized
 * opportunity -> app-consumable JSON. Example: /api/grants-gov/search?q=AI+health */
export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("q") ?? "artificial intelligence";

  try {
    const opportunities = await fetchNormalizedOpportunities(keyword, 3);
    return NextResponse.json({ keyword, count: opportunities.length, opportunities });
  } catch (err) {
    if (err instanceof GrantsGovClientError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
