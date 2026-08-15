import { GovernmentOpportunitySchema, type GovernmentOpportunity } from "@/types/government-opportunity";

/**
 * Curated, offline opportunity set for the GOED demo. Grants.gov/SBIR live
 * adapters exist under lib/sources/* and prove real API integration, but a
 * live demo can't depend on a third-party API being reachable/fast on stage
 * — so the actual matching demo runs against this fixed, realistic snapshot.
 * `sourceId` doubles as the route slug for /opportunity/[id].
 */

const FETCHED_AT = "2026-08-15T00:00:00.000Z";

const raw: GovernmentOpportunity[] = [
  {
    source: "sbir",
    sourceId: "nasa-advanced-manufacturing-2026",
    name: "NASA Advanced Manufacturing Program",
    agency: "NASA",
    description:
      "A multi-phase initiative seeking innovative additive manufacturing solutions for deep space exploration components. Phase I favors small businesses with established prototyping capabilities and a track record of quality assurance in lightweight materials.",
    opportunityType: "sbir",
    eligibility: "U.S. small business, SBIR Phase I preference for firms under 500 employees.",
    funding: { min: 500_000, max: 1_000_000, currency: "USD" },
    postedDate: "2026-06-15T00:00:00.000Z",
    deadline: "2026-09-02T23:59:59.000Z",
    industries: ["manufacturing", "aerospace", "defense"],
    technologyAreas: ["additive manufacturing", "lightweight materials", "titanium alloys", "materials science"],
    geography: [],
    sourceUrl: "https://www.sbir.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "sam.gov",
    sourceId: "dod-cybersecurity-infrastructure-2026",
    name: "Cybersecurity Infrastructure Upgrade",
    agency: "DoD",
    description:
      "Seeking AI-powered threat detection and infrastructure hardening for small and mid-sized organizations supporting the defense industrial base. Requires NIST SP 800-171 compliance prior to award.",
    opportunityType: "contract",
    eligibility: "U.S. small business; NIST SP 800-171 self-assessment required before award.",
    funding: { min: 1_200_000, max: 2_500_000, currency: "USD" },
    postedDate: "2026-07-01T00:00:00.000Z",
    deadline: "2026-09-29T23:59:59.000Z",
    industries: ["cybersecurity", "defense"],
    technologyAreas: ["AI/ML threat detection", "security operations", "NIST 800-171 compliance"],
    geography: [],
    sourceUrl: "https://sam.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "grants.gov",
    sourceId: "doe-grid-resilience-2026",
    name: "Grid Resilience Grant",
    agency: "DOE",
    description:
      "Funding for sensor and AI platforms that improve resilience and reduce loss across municipal utility infrastructure, with a preference for teams with existing municipal pilot relationships.",
    opportunityType: "grant",
    eligibility: "U.S. small business or utility partner; municipal pilot letter of support recommended.",
    funding: { min: 500_000, max: 3_000_000, currency: "USD" },
    postedDate: "2026-07-10T00:00:00.000Z",
    deadline: "2026-10-15T23:59:59.000Z",
    industries: ["water technology", "climate technology", "infrastructure", "energy"],
    technologyAreas: ["IoT sensors", "AI/ML", "leak detection", "grid resilience"],
    geography: [],
    sourceUrl: "https://www.grants.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "grants.gov",
    sourceId: "hhs-nursing-workforce-ai-2026",
    name: "Nursing Workforce Administrative AI Pilot",
    agency: "HHS",
    description:
      "Supports deployment of AI-powered software that reduces administrative burden for nursing staff in hospital and clinical settings, with funding for hospital pilot programs.",
    opportunityType: "cooperative-agreement",
    eligibility: "U.S. small business with early clinical revenue; hospital pilot partner required.",
    funding: { min: 500_000, max: 2_000_000, currency: "USD" },
    postedDate: "2026-06-01T00:00:00.000Z",
    deadline: "2026-09-20T23:59:59.000Z",
    industries: ["healthcare", "software", "artificial intelligence"],
    technologyAreas: ["AI/ML", "SaaS", "clinical workflow automation"],
    geography: [],
    sourceUrl: "https://www.grants.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "sbir",
    sourceId: "nsf-health-ai-sbir-2026",
    name: "SBIR Phase I: AI for Clinical Administrative Burden",
    agency: "NSF",
    description:
      "Phase I SBIR funding for early-stage R&D applying AI/ML to reduce clinical administrative workload, targeting SaaS companies with initial hospital traction.",
    opportunityType: "sbir",
    eligibility: "U.S. small business, R&D-stage.",
    funding: { min: 275_000, max: 275_000, currency: "USD" },
    postedDate: null,
    deadline: "2026-11-05T23:59:59.000Z",
    industries: ["healthcare", "artificial intelligence"],
    technologyAreas: ["AI/ML", "clinical workflow automation"],
    geography: [],
    sourceUrl: "https://seedfund.nsf.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "grants.gov",
    sourceId: "epa-water-loss-innovation-2026",
    name: "Municipal Water Loss Reduction Innovation Grant",
    agency: "EPA",
    description:
      "Funds sensor and AI platforms that demonstrably reduce non-revenue water loss in municipal systems, prioritizing applicants with signed municipal pilot agreements.",
    opportunityType: "grant",
    eligibility: "U.S. small business partnered with a municipal water utility.",
    funding: { min: 500_000, max: 1_500_000, currency: "USD" },
    postedDate: "2026-05-20T00:00:00.000Z",
    deadline: "2026-09-25T23:59:59.000Z",
    industries: ["water technology", "climate technology", "infrastructure"],
    technologyAreas: ["IoT sensors", "AI/ML", "leak detection"],
    geography: [],
    sourceUrl: "https://www.grants.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "sbir",
    sourceId: "dhs-cyber-smb-sbir-2026",
    name: "SBIR: AI-Powered Threat Detection for Small Organizations",
    agency: "DHS",
    description:
      "Phase I/II SBIR seeking AI-powered threat detection tuned for small and mid-sized organizations, with a path to federal procurement post-award.",
    opportunityType: "sbir",
    eligibility: "U.S. small business, cybersecurity focus.",
    funding: { min: 250_000, max: 1_800_000, currency: "USD" },
    postedDate: "2026-06-10T00:00:00.000Z",
    deadline: "2026-10-01T23:59:59.000Z",
    industries: ["cybersecurity", "artificial intelligence"],
    technologyAreas: ["AI/ML threat detection", "security operations"],
    geography: [],
    sourceUrl: "https://www.sbir.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "grants.gov",
    sourceId: "sba-growth-accelerator-2026",
    name: "SBA Growth Accelerator Fund Competition",
    agency: "SBA",
    description:
      "Non-dilutive prize funding for accelerator programs and small businesses pursuing R&D-adjacent growth. Broad eligibility across sectors; not a strong fit for companies without a clear federal R&D or technology angle.",
    opportunityType: "grant",
    eligibility: "U.S. small business, any sector; strongest fit for R&D-stage or accelerator-affiliated applicants.",
    funding: { min: 50_000, max: 300_000, currency: "USD" },
    postedDate: "2026-04-01T00:00:00.000Z",
    deadline: "2026-11-15T23:59:59.000Z",
    industries: ["small business", "economic development"],
    technologyAreas: [],
    geography: [],
    sourceUrl: "https://www.sba.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
  {
    source: "grants.gov",
    sourceId: "eda-utah-innovation-hub-2026",
    name: "Build to Scale: Utah Innovation Hub",
    agency: "EDA",
    description:
      "Regional economic development funding for organizations building technology and workforce ecosystems in Utah communities. Aimed at ecosystem builders more than individual product companies.",
    opportunityType: "grant",
    eligibility: "Utah-based economic development organizations, universities, and nonprofits; individual startups are eligible only as named partners.",
    funding: { min: 250_000, max: 1_000_000, currency: "USD" },
    postedDate: "2026-03-15T00:00:00.000Z",
    deadline: "2026-10-30T23:59:59.000Z",
    industries: ["workforce development", "education", "economic development"],
    technologyAreas: [],
    geography: ["UT"],
    sourceUrl: "https://www.eda.gov/",
    rawSourceData: null,
    fetchedAt: FETCHED_AT,
  },
];

export const GOED_DEMO_OPPORTUNITIES: GovernmentOpportunity[] = raw.map((o) =>
  GovernmentOpportunitySchema.parse(o)
);

export function getDemoOpportunityById(id: string): GovernmentOpportunity | undefined {
  return GOED_DEMO_OPPORTUNITIES.find((o) => o.sourceId === id);
}
