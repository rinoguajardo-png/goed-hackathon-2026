import type { StartupProfile } from "@/types/startup-profile";
import type { GovernmentOpportunity } from "@/types/government-opportunity";
import type { HistoricalAward } from "@/types/historical-award";
import {
  DEFAULT_MATCH_WEIGHTS,
  type EligibilityCheck,
  type FitClassification,
  type MatchResult,
  type MatchWeights,
  type MatchingSummary,
  type ScoreComponent,
} from "@/types/matching";
import { tokenizeAll, overlapScore } from "./text";
import { isUtahEligible } from "./utah-gate";

function fundingOverlapScore(profile: StartupProfile, opportunity: GovernmentOpportunity): number {
  const pMin = profile.fundingNeed.min;
  const pMax = profile.fundingNeed.max;
  const oMin = opportunity.funding.min;
  const oMax = opportunity.funding.max;
  if (pMin == null || pMax == null || oMin == null || oMax == null) return 0.5;

  const overlapLow = Math.max(pMin, oMin);
  const overlapHigh = Math.min(pMax, oMax);
  if (overlapHigh < overlapLow) return 0.1; // ranges don't intersect at all — weak, not zero
  const overlap = overlapHigh - overlapLow;
  const span = Math.max(pMax, oMax) - Math.min(pMin, oMin);
  if (span <= 0) return 1;
  return Math.min(1, overlap / span + 0.3); // small floor bump so partial overlap doesn't read as near-zero
}

function stageRelevanceScore(profile: StartupProfile, opportunity: GovernmentOpportunity): number {
  const maturity = profile.productMaturity;
  if (opportunity.opportunityType === "sbir" || opportunity.opportunityType === "sttr") {
    if (maturity === "prototype" || maturity === "pilot" || maturity === "early-revenue") return 0.9;
    if (maturity === "concept") return 0.5;
    return 0.65;
  }
  if (opportunity.opportunityType === "contract" || opportunity.opportunityType === "cooperative-agreement") {
    if (maturity === "scaling" || maturity === "mature") return 0.9;
    if (maturity === "early-revenue") return 0.7;
    return 0.4;
  }
  return 0.6;
}

function buildEligibilityChecks(profile: StartupProfile, opportunity: GovernmentOpportunity): EligibilityCheck[] {
  const checks: EligibilityCheck[] = [
    {
      rule: "Utah-based company",
      passed: isUtahEligible(profile),
      reason: isUtahEligible(profile)
        ? "Company location is Utah."
        : "This program is limited to Utah-based companies.",
    },
  ];

  if (profile.employees != null) {
    const smallBusiness = profile.employees < 500;
    checks.push({
      rule: "Small business size standard",
      passed: smallBusiness,
      reason: smallBusiness
        ? `${profile.employees} employees is within typical SBIR/small-business thresholds.`
        : `${profile.employees} employees may exceed small-business size standards for this program.`,
    });
  } else {
    checks.push({ rule: "Small business size standard", passed: "unknown", reason: "Employee count not provided." });
  }

  if (opportunity.geography.length > 0) {
    const state = profile.location.state?.toUpperCase() ?? "";
    const passed = opportunity.geography.map((g) => g.toUpperCase()).includes(state);
    checks.push({
      rule: `Geographic eligibility (${opportunity.geography.join(", ")})`,
      passed,
      reason: passed
        ? "Company location matches this opportunity's geographic restriction."
        : "This opportunity is geographically restricted and may not include your location.",
    });
  }

  if ((opportunity.eligibility ?? "").toLowerCase().includes("partner")) {
    checks.push({
      rule: "Named partner / teaming requirement",
      passed: "unknown",
      reason: "This opportunity's eligibility text suggests applying as a named partner rather than sole applicant — verify teaming requirements.",
    });
  }

  return checks;
}

function classify(score: number): FitClassification {
  if (score >= 0.75) return "likely-fit";
  if (score >= 0.55) return "potential-fit-verify-eligibility";
  if (score >= 0.35) return "adjacent-opportunity";
  return "probably-not-a-fit";
}

function buildExplanation(components: ScoreComponent[]): string {
  const top = [...components].sort((a, b) => b.score - a.score).slice(0, 2);
  return top.map((c) => c.explanation).join(" ");
}

function findHistoricalEvidence(
  opportunity: GovernmentOpportunity,
  awards: HistoricalAward[]
): HistoricalAward[] {
  const oppTokens = tokenizeAll([opportunity.name, opportunity.agency ?? "", ...opportunity.technologyAreas, ...opportunity.industries]);
  return awards
    .map((award) => {
      const awardTokens = tokenizeAll([
        award.agency ?? "",
        award.technologyArea ?? "",
        award.category ?? "",
        award.awardTitle ?? "",
      ]);
      return { award, score: overlapScore(oppTokens, awardTokens) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.award);
}

function scoreOpportunity(
  profile: StartupProfile,
  opportunity: GovernmentOpportunity,
  weights: MatchWeights,
  historicalAwards: HistoricalAward[]
): MatchResult {
  const profileTechTokens = tokenizeAll([...profile.technologies, ...profile.rdActivities, profile.companyDescription ?? ""]);
  const oppTechTokens = tokenizeAll([...opportunity.technologyAreas, opportunity.description ?? ""]);
  const techScore = overlapScore(profileTechTokens, oppTechTokens);

  const profileIndustryTokens = tokenizeAll(profile.industry);
  const oppIndustryTokens = tokenizeAll(opportunity.industries);
  const industryScore = overlapScore(profileIndustryTokens, oppIndustryTokens);

  const fundingScore = fundingOverlapScore(profile, opportunity);
  const stageScore = stageRelevanceScore(profile, opportunity);

  const eligibilityChecks = buildEligibilityChecks(profile, opportunity);
  const eligibilityScore =
    eligibilityChecks.reduce((sum, c) => sum + (c.passed === true ? 1 : c.passed === "unknown" ? 0.5 : 0), 0) /
    eligibilityChecks.length;

  const strategicScore = Math.min(1, 0.5 + (profile.rdActivities.length > 0 ? 0.3 : 0) + (techScore > 0.3 ? 0.2 : 0));

  const components: ScoreComponent[] = [
    {
      key: "technology",
      score: techScore,
      explanation:
        techScore >= 0.3
          ? `Your technology focus (${profile.technologies.slice(0, 2).join(", ") || "your R&D"}) aligns with this program's focus areas.`
          : `This program's technology focus only partially overlaps with your stated technologies.`,
    },
    {
      key: "industry",
      score: industryScore,
      explanation:
        industryScore >= 0.3
          ? `Your industry (${profile.industry.slice(0, 2).join(", ") || "your sector"}) matches this opportunity's target industries.`
          : `Your industry only loosely overlaps with this opportunity's target industries.`,
    },
    {
      key: "funding",
      score: fundingScore,
      explanation:
        fundingScore >= 0.5
          ? `Your funding need overlaps well with this opportunity's ${formatMoney(opportunity.funding.min)}–${formatMoney(opportunity.funding.max)} range.`
          : `Your funding need only partially overlaps with this opportunity's funding range.`,
    },
    {
      key: "stageRelevance",
      score: stageScore,
      explanation:
        stageScore >= 0.7
          ? `Your company's ${profile.productMaturity.replace("-", " ")} stage fits this opportunity type well.`
          : `Your company's ${profile.productMaturity.replace("-", " ")} stage is a partial fit for this opportunity type.`,
    },
    {
      key: "eligibility",
      score: eligibilityScore,
      explanation:
        eligibilityScore >= 0.75
          ? "You meet the eligibility signals we can check automatically."
          : "Some eligibility signals need manual verification before applying.",
    },
    {
      key: "strategic",
      score: strategicScore,
      explanation: "Active R&D activity strengthens your case for federal R&D funding programs.",
    },
  ];

  const overallScore = components.reduce((sum, c) => sum + c.score * weights[c.key], 0);
  const classification = classify(overallScore);

  const potentialConcerns: string[] = eligibilityChecks
    .filter((c) => c.passed !== true)
    .map((c) => c.reason);
  if ((opportunity.eligibility ?? "").toLowerCase().includes("nist")) {
    potentialConcerns.push("Requires NIST SP 800-171 cybersecurity compliance prior to award.");
  }

  const whatToVerify: string[] = [
    "Confirm applicant type and size standard against the full solicitation text.",
    ...eligibilityChecks.filter((c) => c.passed === "unknown").map((c) => c.reason),
  ];

  const nextSteps: string[] = [
    "Review the full NOFO/solicitation text before drafting a letter of intent.",
    "Close any open readiness gaps shown on this opportunity's Readiness panel.",
  ];

  return {
    opportunity,
    overallScore,
    components,
    classification,
    eligibilityChecks,
    explanation: buildExplanation(components),
    potentialConcerns,
    whatToVerify,
    nextSteps,
    historicalEvidence: findHistoricalEvidence(opportunity, historicalAwards),
  };
}

function formatMoney(n: number | null): string {
  if (n == null) return "unspecified";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function matchOpportunities(
  profile: StartupProfile,
  opportunities: GovernmentOpportunity[],
  historicalAwards: HistoricalAward[] = [],
  weights: MatchWeights = DEFAULT_MATCH_WEIGHTS
): MatchingSummary {
  if (!isUtahEligible(profile)) {
    return {
      startupProfile: profile,
      results: [],
      hasStrongMatch: false,
      summary:
        "This program is currently Utah-only. We couldn't identify a Utah location for this company, so no federal opportunities were matched.",
    };
  }

  const results = opportunities
    .map((o) => scoreOpportunity(profile, o, weights, historicalAwards))
    .sort((a, b) => b.overallScore - a.overallScore);

  const hasStrongMatch = results.some(
    (r) => r.classification === "likely-fit" || (r.classification === "potential-fit-verify-eligibility" && r.overallScore >= 0.55)
  );

  const top = results[0];
  const summary = hasStrongMatch
    ? `${top.opportunity.name} (${top.opportunity.agency ?? top.opportunity.source}) looks like a strong potential fit — ${Math.round(top.overallScore * 100)}% match.`
    : "There probably isn't a strong federal opportunity for this company right now based on what we know — consider revisiting as your R&D activity or funding need becomes clearer.";

  return { startupProfile: profile, results, hasStrongMatch, summary };
}
