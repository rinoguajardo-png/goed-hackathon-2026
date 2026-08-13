import { StartupProfileSchema, type StartupProfile } from "@/types/startup-profile";

/**
 * The five official GOED AI Builder Day test startups. Used to sanity-check
 * the matching pipeline tomorrow — including Test 5, which is intentionally
 * a weak/no-match case. Never tune the matcher to force a strong result here.
 */

const aiHealthcare: StartupProfile = StartupProfileSchema.parse({
  rawDescription:
    "We're a 15-person Utah healthcare SaaS company using AI to reduce administrative work for nurses. We have $1M ARR and need $500K-$2M for R&D and hospital pilots.",
  companyName: "GOED Test 1: AI Healthcare",
  companyDescription: "Utah SaaS startup building AI-powered software that reduces administrative work for nurses.",
  industry: ["healthcare", "software", "artificial intelligence"],
  technologies: ["AI/ML", "SaaS", "clinical workflow automation"],
  location: { city: null, state: "UT", country: "USA" },
  employees: 15,
  annualRevenue: 1_000_000,
  fundingStage: "unknown",
  capitalRaisedToDate: 2_500_000,
  rdActivities: ["AI model development for clinical administrative workflows"],
  productMaturity: "early-revenue",
  targetCustomers: ["hospitals", "nurses", "healthcare systems"],
  fundingNeed: { min: 500_000, max: 2_000_000, currency: "USD" },
  useOfFunds: ["product development", "hospital pilots"],
  extractionConfidence: 1,
  fieldsNeedingClarification: [],
});

const advancedManufacturing: StartupProfile = StartupProfileSchema.parse({
  rawDescription:
    "We're a 35-person Utah hardware startup building advanced manufacturing for lightweight aerospace components. We have $3M revenue and $8M raised, and need $2M-$5M for manufacturing scale-up and R&D.",
  companyName: "GOED Test 2: Advanced Manufacturing",
  companyDescription: "Utah hardware startup building advanced manufacturing processes for lightweight aerospace components.",
  industry: ["manufacturing", "aerospace", "defense"],
  technologies: ["advanced manufacturing", "lightweight materials", "aerospace components"],
  location: { city: null, state: "UT", country: "USA" },
  employees: 35,
  annualRevenue: 3_000_000,
  fundingStage: "unknown",
  capitalRaisedToDate: 8_000_000,
  rdActivities: ["lightweight aerospace component R&D", "manufacturing process development"],
  productMaturity: "scaling",
  targetCustomers: ["aerospace manufacturers", "defense contractors"],
  fundingNeed: { min: 2_000_000, max: 5_000_000, currency: "USD" },
  useOfFunds: ["manufacturing scale-up", "R&D"],
  extractionConfidence: 1,
  fieldsNeedingClarification: [],
});

const climateWater: StartupProfile = StartupProfileSchema.parse({
  rawDescription:
    "We're a 10-person Utah startup with a sensor and AI platform that reduces municipal water loss. We have $500K revenue and $1.5M raised, and need $500K-$3M for product development and municipal pilots.",
  companyName: "GOED Test 3: Climate / Water Technology",
  companyDescription: "Utah startup building a sensor and AI platform to reduce municipal water loss.",
  industry: ["water technology", "climate technology", "infrastructure"],
  technologies: ["IoT sensors", "AI/ML", "leak detection"],
  location: { city: null, state: "UT", country: "USA" },
  employees: 10,
  annualRevenue: 500_000,
  fundingStage: "unknown",
  capitalRaisedToDate: 1_500_000,
  rdActivities: ["sensor platform R&D", "municipal water loss modeling"],
  productMaturity: "pilot",
  targetCustomers: ["municipalities", "water utilities"],
  fundingNeed: { min: 500_000, max: 3_000_000, currency: "USD" },
  useOfFunds: ["product development", "municipal pilots"],
  extractionConfidence: 1,
  fieldsNeedingClarification: [],
});

const cybersecurity: StartupProfile = StartupProfileSchema.parse({
  rawDescription:
    "We're a 22-person Utah startup with AI-powered threat detection for small and mid-sized organizations. We have $2M ARR and $5M raised, and need $1M-$3M for R&D and federal/commercial expansion.",
  companyName: "GOED Test 4: Cybersecurity",
  companyDescription: "Utah startup building AI-powered threat detection for small and mid-sized organizations.",
  industry: ["cybersecurity", "artificial intelligence"],
  technologies: ["AI/ML threat detection", "security operations"],
  location: { city: null, state: "UT", country: "USA" },
  employees: 22,
  annualRevenue: 2_000_000,
  fundingStage: "unknown",
  capitalRaisedToDate: 5_000_000,
  rdActivities: ["AI threat detection model R&D"],
  productMaturity: "early-revenue",
  targetCustomers: ["small and mid-sized organizations", "federal agencies (target expansion)"],
  fundingNeed: { min: 1_000_000, max: 3_000_000, currency: "USD" },
  useOfFunds: ["R&D", "federal and commercial expansion"],
  extractionConfidence: 1,
  fieldsNeedingClarification: [],
});

const consumerWorkforce: StartupProfile = StartupProfileSchema.parse({
  rawDescription:
    "We're an 8-person Utah startup running a marketplace connecting parents with local youth activities and enrichment programs. We have $750K revenue and $1M raised, and need $250K-$1M for expansion and technology development.",
  companyName: "GOED Test 5: Consumer / Workforce Technology",
  companyDescription: "Utah startup operating a marketplace connecting parents with local youth activities and enrichment programs.",
  industry: ["consumer marketplace", "education", "youth services"],
  technologies: ["marketplace platform"],
  location: { city: null, state: "UT", country: "USA" },
  employees: 8,
  annualRevenue: 750_000,
  fundingStage: "unknown",
  capitalRaisedToDate: 1_000_000,
  rdActivities: [],
  productMaturity: "early-revenue",
  targetCustomers: ["parents", "families", "local enrichment program providers"],
  fundingNeed: { min: 250_000, max: 1_000_000, currency: "USD" },
  useOfFunds: ["expansion", "technology development"],
  extractionConfidence: 1,
  fieldsNeedingClarification: [
    "No clear federal R&D or technology angle stated — likely weak/no federal opportunity fit. Do not force a match.",
  ],
});

export const GOED_TEST_STARTUPS: StartupProfile[] = [
  aiHealthcare,
  advancedManufacturing,
  climateWater,
  cybersecurity,
  consumerWorkforce,
];

export const GOED_TEST_STARTUPS_BY_NAME: Record<string, StartupProfile> = Object.fromEntries(
  GOED_TEST_STARTUPS.map((s) => [s.companyName ?? s.rawDescription, s])
);
