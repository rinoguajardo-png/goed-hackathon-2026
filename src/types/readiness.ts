/**
 * Readiness answers a different question than Match: "is this the right
 * opportunity" (MatchResult) vs "is the company actually prepared to pursue
 * it" (ReadinessAssessment). Deliberately kept as a separate model — see
 * lib/matching/readiness.ts — so the UI can show both scores side by side
 * instead of collapsing them into one number.
 */

export type ReadinessStepStatus = "complete" | "current" | "pending";

export interface ReadinessStep {
  id: string;
  title: string;
  description: string;
  status: ReadinessStepStatus;
  /** Present when status is "current" — the immediate next action. */
  ctaLabel?: string;
}

export interface ReadinessAssessment {
  /** 0-100, purely a function of how many steps are complete/current. */
  overallScore: number;
  steps: ReadinessStep[];
}

export function readinessScoreFromSteps(steps: ReadinessStep[]): number {
  if (steps.length === 0) return 100;
  const weight = { complete: 1, current: 0.6, pending: 0.25 } as const;
  const total = steps.reduce((sum, s) => sum + weight[s.status], 0);
  return Math.round((total / steps.length) * 100);
}
