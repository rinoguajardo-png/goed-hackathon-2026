export interface UtahResource {
  /** Matches a ReadinessStep.id — this resource is surfaced whenever that step isn't complete. */
  gapId: string;
  gapLabel: string;
  gapIcon: "warning" | "shield";
  title: string;
  description: string;
  bullets: string[];
  bulletsLabel: string;
  ctaLabel: string;
  ctaKind: "primary" | "secondary";
  ctaHref: string;
}

/**
 * Static, curated list of real Utah organizations that help close specific
 * readiness gaps — the "Utah resources that can help you get ready" screen.
 * Keeping this a flat static list (vs. a live directory API) matches the
 * "prepare infrastructure, not the final integration" scope from the
 * hackathon brief; swapping in a live GOED partner directory is future work.
 */
export const UTAH_RESOURCES: UtahResource[] = [
  {
    gapId: "sam-registration",
    gapLabel: "Missing SAM Registration",
    gapIcon: "warning",
    title: "Utah PTAC (APEX Accelerator)",
    description:
      "Specialized in federal registrations. They provide free, one-on-one counseling to help Utah businesses navigate the SAM.gov registration process.",
    bulletsLabel: "Why Connect?",
    bullets: ["Avoid common registration errors", "Get your UEI number faster"],
    ctaLabel: "Connect with Advisor",
    ctaKind: "primary",
    ctaHref: "https://apex.utah.gov/",
  },
  {
    gapId: "cybersecurity-assessment",
    gapLabel: "Cybersecurity Certification",
    gapIcon: "shield",
    title: "Utah Manufacturing Extension Partnership",
    description:
      "Offers specialized assistance for manufacturers to achieve necessary cybersecurity compliance and certifications required for federal contracts.",
    bulletsLabel: "Next Steps",
    bullets: ["Review compliance requirements"],
    ctaLabel: "Learn More",
    ctaKind: "secondary",
    ctaHref: "https://www.mep.org/",
  },
  {
    gapId: "advisor-connection",
    gapLabel: "Proposal Strategy Review",
    gapIcon: "warning",
    title: "GOED Office of Trade & Innovation",
    description:
      "State advisors who review proposal strategy and eligibility before submission, and can connect you to federal agency program officers.",
    bulletsLabel: "Why Connect?",
    bullets: ["Get a second read on strategic fit", "Warm introductions to program officers"],
    ctaLabel: "Connect with Advisor",
    ctaKind: "primary",
    ctaHref: "https://goed.utah.gov/",
  },
  {
    gapId: "teaming-partner",
    gapLabel: "Requires a Teaming Partner",
    gapIcon: "warning",
    title: "Salt Lake Chamber — Teaming & Alliance Network",
    description:
      "Some opportunities require applying as a named partner to a larger prime, university, or municipality rather than as a sole applicant. This network brokers those introductions for Utah companies.",
    bulletsLabel: "Why Connect?",
    bullets: ["Find a prime contractor or municipal pilot partner", "Understand teaming agreement basics"],
    ctaLabel: "Find a Partner",
    ctaKind: "secondary",
    ctaHref: "https://slchamber.com/",
  },
];

export function utahResourceForGap(gapId: string): UtahResource | undefined {
  return UTAH_RESOURCES.find((r) => r.gapId === gapId);
}
