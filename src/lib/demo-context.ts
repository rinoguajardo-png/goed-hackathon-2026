import { GOED_TEST_STARTUPS } from "@/fixtures/goed-test-startups";
import { GOED_DEMO_OPPORTUNITIES } from "@/fixtures/goed-demo-opportunities";
import { GOED_DEMO_HISTORICAL_AWARDS } from "@/fixtures/goed-demo-historical-awards";
import { matchOpportunities } from "@/lib/matching/engine";
import type { MatchingSummary } from "@/types/matching";
import { StartupProfileSchema, type StartupProfile } from "@/types/startup-profile";

/**
 * Every screen resolves the same "selected demo company" from a `?startup=`
 * index rather than client-side global state — keeps each page an
 * independently-shareable/refreshable URL, which matters more for a live
 * demo than a fancier state manager would.
 */
export const DEFAULT_STARTUP_INDEX = 1; // Advanced Manufacturing — the demo script's walkthrough company

export interface DemoContext {
  /** null when the profile came from a custom (free-text extracted) description rather than a fixture index. */
  index: number | null;
  profile: StartupProfile;
  matching: MatchingSummary;
}

export interface DemoSearchParams {
  startup?: string;
  /** JSON-encoded StartupProfile, produced by the Intake page's free-text extraction flow. */
  custom?: string;
}

export function resolveStartupIndex(startupParam: string | undefined): number {
  const n = Number(startupParam);
  if (Number.isNaN(n)) return DEFAULT_STARTUP_INDEX;
  return Math.min(Math.max(n, 0), GOED_TEST_STARTUPS.length - 1);
}

export function tryParseCustomProfile(custom: string | undefined): StartupProfile | null {
  if (!custom) return null;
  try {
    return StartupProfileSchema.parse(JSON.parse(decodeURIComponent(custom)));
  } catch {
    return null;
  }
}

export function getDemoContext({ startup, custom }: DemoSearchParams): DemoContext {
  const customProfile = tryParseCustomProfile(custom);
  const index = customProfile ? null : resolveStartupIndex(startup);
  const profile = customProfile ?? GOED_TEST_STARTUPS[index!];
  const matching = matchOpportunities(profile, GOED_DEMO_OPPORTUNITIES, GOED_DEMO_HISTORICAL_AWARDS);
  return { index, profile, matching };
}

/** Query string (no leading "?") that carries the current profile selection
 * forward to another page — either `startup=N` or the encoded custom profile. */
export function demoQueryParam(ctx: Pick<DemoContext, "index" | "profile">): string {
  if (ctx.index != null) return `startup=${ctx.index}`;
  return `custom=${encodeURIComponent(JSON.stringify(ctx.profile))}`;
}
