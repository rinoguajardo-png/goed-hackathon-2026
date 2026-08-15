import { createEmptyStartupProfile, type StartupProfile } from "@/types/startup-profile";

/**
 * Zero-dependency fallback extractor. Used whenever no real LLM is
 * configured (MockLLMProvider) or the model's JSON fails to parse, so the
 * Intake flow still produces a usable profile offline/on-stage. Real
 * extraction (lib/extraction/extract-profile.ts) always tries the LLM first.
 */

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  healthcare: ["healthcare", "health", "hospital", "clinical", "nurse", "medical"],
  manufacturing: ["manufactur", "aerospace", "hardware", "materials"],
  "water technology": ["water", "municipal"],
  "climate technology": ["climate", "sustainab", "emissions"],
  cybersecurity: ["cyber", "security", "threat detection"],
  "artificial intelligence": ["ai", "artificial intelligence", "machine learning", "ml "],
  software: ["saas", "software", "platform", "app"],
  "consumer marketplace": ["marketplace", "consumer"],
  education: ["education", "youth", "enrichment", "school"],
};

function matchKeywords(text: string, dict: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  return Object.entries(dict)
    .filter(([, keywords]) => keywords.some((k) => lower.includes(k)))
    .map(([label]) => label);
}

function extractMoneyRange(text: string): { min: number | null; max: number | null } {
  const rangeMatch = text.match(/\$([\d.]+)\s*([kKmM])?\s*[-–to]+\s*\$?([\d.]+)\s*([kKmM])?/);
  if (rangeMatch) {
    const [, minStr, minUnit, maxStr, maxUnit] = rangeMatch;
    return { min: toNumber(minStr, minUnit), max: toNumber(maxStr, maxUnit ?? minUnit) };
  }
  return { min: null, max: null };
}

function extractSingleMoney(text: string, keyword: RegExp): number | null {
  const match = text.match(keyword);
  if (!match) return null;
  return toNumber(match[1], match[2]);
}

function toNumber(numStr: string, unit?: string): number {
  const n = parseFloat(numStr);
  if (unit?.toLowerCase() === "m") return n * 1_000_000;
  if (unit?.toLowerCase() === "k") return n * 1_000;
  return n;
}

export function heuristicExtractProfile(rawDescription: string): StartupProfile {
  const profile = createEmptyStartupProfile(rawDescription);
  const text = rawDescription;

  const employeesMatch = text.match(/(\d+)[\s-]*(?:person|people|employee)/i);
  const employees = employeesMatch ? parseInt(employeesMatch[1], 10) : null;

  const isUtah = /\butah\b|\bUT\b/i.test(text);

  const revenue = extractSingleMoney(text, /\$([\d.]+)\s*([kKmM])?\s*(?:ARR|revenue|in revenue)/i);
  const capitalRaised = extractSingleMoney(text, /\$([\d.]+)\s*([kKmM])?\s*raised/i);

  const fundingNeedMatch = text.match(/need\s+\$([\d.]+)\s*([kKmM])?\s*[-–to]+\s*\$?([\d.]+)\s*([kKmM])?/i);
  const fundingNeed = fundingNeedMatch
    ? {
        min: toNumber(fundingNeedMatch[1], fundingNeedMatch[2]),
        max: toNumber(fundingNeedMatch[3], fundingNeedMatch[4] ?? fundingNeedMatch[2]),
        currency: "USD" as const,
      }
    : { ...extractMoneyRange(text), currency: "USD" as const };

  const industries = matchKeywords(text, INDUSTRY_KEYWORDS);

  const useOfFundsMatch = text.match(/for ([a-z ,]+?)(?:\.|$)/i);
  const useOfFunds = useOfFundsMatch
    ? useOfFundsMatch[1]
        .split(/,| and /)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const clarifications: string[] = [];
  if (employees == null) clarifications.push("Employee count wasn't mentioned — please confirm team size.");
  if (fundingNeed.min == null && fundingNeed.max == null) clarifications.push("Funding need wasn't clear — how much are you looking to raise?");
  if (industries.length === 0) clarifications.push("Industry wasn't clear from the description — what sector are you in?");

  return {
    ...profile,
    companyDescription: text,
    industry: industries,
    technologies: industries.includes("artificial intelligence") ? ["AI/ML"] : [],
    location: { city: null, state: isUtah ? "UT" : null, country: "USA" },
    employees,
    annualRevenue: revenue,
    capitalRaisedToDate: capitalRaised,
    productMaturity: revenue ? "early-revenue" : "unknown",
    fundingNeed,
    useOfFunds,
    extractionConfidence: 0.5,
    fieldsNeedingClarification: clarifications,
  };
}
