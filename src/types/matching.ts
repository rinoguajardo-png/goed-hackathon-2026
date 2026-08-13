import type { StartupProfile } from "./startup-profile";
import type { GovernmentOpportunity } from "./government-opportunity";
import type { HistoricalAward } from "./historical-award";

/**
 * Interfaces only — no scoring logic lives here yet. This lets tomorrow's
 * work change weights, add/remove score components, or swap the whole
 * algorithm without touching the UI or the source adapters, which only ever
 * depend on these shapes.
 */

export type ScoreComponentKey =
  | "eligibility"
  | "technology"
  | "industry"
  | "funding"
  | "stageRelevance"
  | "strategic";

export interface ScoreComponent {
  key: ScoreComponentKey;
  /** 0-1. Individual component scores are combined via MatchWeights to
   * produce MatchResult.overallScore — the combination function is not
   * fixed today. */
  score: number;
  explanation: string;
}

/** Freely editable during the hackathon — not hardcoded into scoring logic. */
export type MatchWeights = Record<ScoreComponentKey, number>;

export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  eligibility: 0.25,
  technology: 0.25,
  industry: 0.15,
  funding: 0.15,
  stageRelevance: 0.1,
  strategic: 0.1,
};

export const FIT_CLASSIFICATIONS = [
  "likely-fit",
  "potential-fit-verify-eligibility",
  "adjacent-opportunity",
  "probably-not-a-fit",
] as const;

export type FitClassification = (typeof FIT_CLASSIFICATIONS)[number];

export interface EligibilityCheck {
  rule: string;
  passed: boolean | "unknown";
  reason: string;
}

export interface MatchResult {
  opportunity: GovernmentOpportunity;

  overallScore: number; // 0-1
  components: ScoreComponent[];
  classification: FitClassification;

  eligibilityChecks: EligibilityCheck[];

  /** LLM-generated narrative. LLM explains, it does not decide eligibility. */
  explanation: string;
  potentialConcerns: string[];
  whatToVerify: string[];
  nextSteps: string[];

  historicalEvidence: HistoricalAward[];
}

/** Top-level output for one startup profile against a set of opportunities.
 * `hasStrongMatch` / `summary` are what let the product say "there probably
 * isn't a strong federal opportunity for this company right now" instead of
 * forcing a result — see GOED test case 5. */
export interface MatchingSummary {
  startupProfile: StartupProfile;
  results: MatchResult[];
  hasStrongMatch: boolean;
  summary: string;
}

export interface MatchingEngine {
  weights: MatchWeights;
  match(
    profile: StartupProfile,
    opportunities: GovernmentOpportunity[],
    historicalAwards?: HistoricalAward[]
  ): Promise<MatchingSummary>;
}
