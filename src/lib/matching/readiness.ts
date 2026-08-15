import type { StartupProfile } from "@/types/startup-profile";
import type { GovernmentOpportunity } from "@/types/government-opportunity";
import { readinessScoreFromSteps, type ReadinessAssessment, type ReadinessStep } from "@/types/readiness";

/**
 * Heuristic, not a real compliance engine — deliberately simple rules over
 * profile.productMaturity and opportunity text so the score is deterministic
 * and explainable in a demo, not a black box. Swapping in real SAM.gov /
 * eligibility-service checks is future work (see README Hackathon TODO).
 */

function requiresCyberAssessment(opportunity: GovernmentOpportunity): boolean {
  const haystack = `${opportunity.eligibility ?? ""} ${opportunity.description ?? ""}`.toLowerCase();
  return (
    haystack.includes("nist") ||
    haystack.includes("cybersecurity") ||
    opportunity.industries.some((i) => i.toLowerCase().includes("cyber") || i.toLowerCase().includes("defense"))
  );
}

export function computeReadiness(profile: StartupProfile, opportunity: GovernmentOpportunity): ReadinessAssessment {
  const companyProfileComplete = profile.extractionConfidence >= 0.5 && profile.fieldsNeedingClarification.length === 0;

  const samStatus: ReadinessStep["status"] =
    profile.productMaturity === "mature"
      ? "complete"
      : profile.productMaturity === "scaling" || profile.productMaturity === "early-revenue"
        ? "current"
        : "pending";

  const needsCyber = requiresCyberAssessment(opportunity);
  const hasCyberCapability = profile.industry.some((i) => i.toLowerCase().includes("cyber")) ||
    profile.technologies.some((t) => t.toLowerCase().includes("cyber") || t.toLowerCase().includes("nist"));
  const cyberStatus: ReadinessStep["status"] = !needsCyber
    ? "complete"
    : hasCyberCapability
      ? "complete"
      : "pending";

  const advisorStatus: ReadinessStep["status"] = samStatus === "complete" ? "current" : "pending";

  const scoredSteps: ReadinessStep[] = [
    {
      id: "company-profile",
      title: "Company Profile Updated",
      description: "Core capabilities and past performance documented.",
      status: companyProfileComplete ? "complete" : "current",
    },
    {
      id: "sam-registration",
      title: "SAM.gov Registration",
      description: "Required for all federal contracts. Expected time: 2-3 weeks.",
      status: samStatus,
      ctaLabel: samStatus !== "complete" ? "Start Registration" : undefined,
    },
    {
      id: "cybersecurity-assessment",
      title: "Cybersecurity Assessment",
      description: needsCyber
        ? "Self-assessment against NIST SP 800-171 guidelines, required for this opportunity."
        : "Self-assessment against NIST SP 800-171 guidelines.",
      status: cyberStatus,
    },
    {
      id: "advisor-connection",
      title: "Advisor Connection",
      description: "Review proposal strategy with a Utah APEX Accelerator advisor.",
      status: advisorStatus,
    },
  ];

  const readyToApply: ReadinessStep = {
    id: "ready-to-apply",
    title: "Ready to Apply",
    description: "All compliance and strategic prerequisites met.",
    status: scoredSteps.every((s) => s.status === "complete") ? "complete" : "pending",
  };

  return {
    overallScore: readinessScoreFromSteps(scoredSteps),
    steps: [...scoredSteps, readyToApply],
  };
}

/** Steps that aren't "complete" — used to drive the Support page's resource list. */
export function readinessGaps(assessment: ReadinessAssessment): ReadinessStep[] {
  return assessment.steps.filter((s) => s.status !== "complete" && s.id !== "ready-to-apply");
}
