import { HistoricalAwardSchema, type HistoricalAward } from "@/types/historical-award";

/**
 * Small curated set answering "who else has received this money?" for the
 * demo opportunities. Real ingestion from USAspending/SBIR history is future
 * work (see README Hackathon TODO) — this proves the model and UI end to end.
 */

const raw: HistoricalAward[] = [
  {
    source: "sbir",
    sourceId: "award-relativity-space-2025",
    recipientName: "Relativity Space",
    agency: "NASA",
    program: "SBIR Phase II",
    awardTitle: "Additive Manufacturing for Lightweight Aerospace Structures",
    amount: 1_750_000,
    year: 2025,
    state: "CA",
    naicsCode: "332",
    category: "manufacturing",
    technologyArea: "additive manufacturing",
    description: "Follow-on award for titanium alloy additive manufacturing processes for launch vehicle components.",
    rawSourceData: null,
  },
  {
    source: "sbir",
    sourceId: "award-icon-technology-2024",
    recipientName: "ICON Technology, Inc.",
    agency: "NASA",
    program: "SBIR Phase I",
    awardTitle: "Additive Manufacturing Materials Qualification for Deep Space Components",
    amount: 250_000,
    year: 2024,
    state: "TX",
    naicsCode: "332",
    category: "manufacturing",
    technologyArea: "materials science",
    description: "Materials qualification testing for additively manufactured lightweight aerospace components.",
    rawSourceData: null,
  },
  {
    source: "usaspending",
    sourceId: "award-huntsman-defense-2025",
    recipientName: "Huntsman Advanced Materials",
    agency: "DoD",
    program: "Defense Industrial Base Contract",
    awardTitle: "Cybersecurity Hardening for Manufacturing Supply Chain",
    amount: 2_100_000,
    year: 2025,
    state: "UT",
    naicsCode: "541512",
    category: "cybersecurity",
    technologyArea: "NIST 800-171 compliance",
    description: "Utah-based defense supplier awarded contract to bring manufacturing IT infrastructure to NIST SP 800-171 compliance.",
    rawSourceData: null,
  },
  {
    source: "sbir",
    sourceId: "award-recursion-pharma-2024",
    recipientName: "Recursion Pharmaceuticals",
    agency: "NIH",
    program: "SBIR Phase I",
    awardTitle: "AI-Driven Clinical Workflow Automation",
    amount: 300_000,
    year: 2024,
    state: "UT",
    naicsCode: "621",
    category: "healthcare",
    technologyArea: "AI/ML",
    description: "Utah-based company awarded Phase I SBIR for AI applications reducing administrative burden in clinical settings.",
    rawSourceData: null,
  },
];

export const GOED_DEMO_HISTORICAL_AWARDS: HistoricalAward[] = raw.map((a) => HistoricalAwardSchema.parse(a));
