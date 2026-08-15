import type { StartupProfile } from "@/types/startup-profile";

export interface ProfileField {
  id: string;
  label: string;
  value: string | null;
  complete: boolean;
}

/** The 7 fields the Intake screen's "Building Your Profile" panel tracks —
 * a representative subset of the full StartupProfile, chosen because these
 * are the fields that most directly drive match/readiness scoring. */
export function profileFields(profile: StartupProfile): ProfileField[] {
  const location = [profile.location.city, profile.location.state].filter(Boolean).join(", ");
  return [
    { id: "location", label: "Location", value: location || null, complete: Boolean(profile.location.state) },
    { id: "industry", label: "Industry", value: profile.industry.join(", ") || null, complete: profile.industry.length > 0 },
    { id: "employees", label: "Employees", value: profile.employees != null ? String(profile.employees) : null, complete: profile.employees != null },
    {
      id: "revenue",
      label: "Revenue Band",
      value: profile.annualRevenue != null ? `$${(profile.annualRevenue / 1_000_000).toFixed(1)}M ARR` : null,
      complete: profile.annualRevenue != null,
    },
    {
      id: "funding-need",
      label: "Funding Need",
      value:
        profile.fundingNeed.min != null || profile.fundingNeed.max != null
          ? `$${((profile.fundingNeed.min ?? 0) / 1000).toFixed(0)}K - $${((profile.fundingNeed.max ?? 0) / 1000).toFixed(0)}K`
          : null,
      complete: profile.fundingNeed.min != null && profile.fundingNeed.max != null,
    },
    { id: "rd-activities", label: "R&D Activities", value: profile.rdActivities.join(", ") || null, complete: profile.rdActivities.length > 0 },
    {
      id: "product-maturity",
      label: "Product Maturity",
      value: profile.productMaturity !== "unknown" ? profile.productMaturity.replace("-", " ") : null,
      complete: profile.productMaturity !== "unknown",
    },
  ];
}
