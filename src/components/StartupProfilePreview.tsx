import type { StartupProfile } from "@/types/startup-profile";

function formatMoney(value: number | null): string {
  if (value === null) return "unknown";
  return `$${value.toLocaleString()}`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}

export function StartupProfilePreview({ profile }: { profile: StartupProfile }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {profile.companyName ?? "Startup profile"}
      </h3>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Industry" value={profile.industry.join(", ") || "unknown"} />
        <Field
          label="Location"
          value={[profile.location.city, profile.location.state, profile.location.country].filter(Boolean).join(", ") || "unknown"}
        />
        <Field label="Employees" value={profile.employees?.toString() ?? "unknown"} />
        <Field label="Annual revenue" value={formatMoney(profile.annualRevenue)} />
        <Field label="Capital raised" value={formatMoney(profile.capitalRaisedToDate)} />
        <Field
          label="Funding need"
          value={`${formatMoney(profile.fundingNeed.min)} - ${formatMoney(profile.fundingNeed.max)}`}
        />
        <Field label="Product maturity" value={profile.productMaturity} />
        <Field label="Use of funds" value={profile.useOfFunds.join(", ") || "unknown"} />
      </dl>
      {profile.fieldsNeedingClarification.length > 0 && (
        <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <span className="font-medium">Needs clarification:</span>{" "}
          {profile.fieldsNeedingClarification.join("; ")}
        </div>
      )}
    </div>
  );
}
