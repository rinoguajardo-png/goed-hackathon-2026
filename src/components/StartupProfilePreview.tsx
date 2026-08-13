import { Building2, DollarSign, MapPin, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StartupProfile } from "@/types/startup-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatMoney(value: number | null): string {
  if (value === null) return "unknown";
  return `$${value.toLocaleString()}`;
}

function Field({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}

export function StartupProfilePreview({ profile }: { profile: StartupProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{profile.companyName ?? "Startup profile"}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field icon={Building2} label="Industry" value={profile.industry.join(", ") || "unknown"} />
          <Field
            icon={MapPin}
            label="Location"
            value={
              [profile.location.city, profile.location.state, profile.location.country]
                .filter(Boolean)
                .join(", ") || "unknown"
            }
          />
          <Field icon={Users} label="Employees" value={profile.employees?.toString() ?? "unknown"} />
          <Field icon={TrendingUp} label="Annual revenue" value={formatMoney(profile.annualRevenue)} />
          <Field icon={DollarSign} label="Capital raised" value={formatMoney(profile.capitalRaisedToDate)} />
          <Field
            icon={DollarSign}
            label="Funding need"
            value={`${formatMoney(profile.fundingNeed.min)} - ${formatMoney(profile.fundingNeed.max)}`}
          />
          <Field icon={TrendingUp} label="Product maturity" value={profile.productMaturity} />
          <Field icon={Building2} label="Use of funds" value={profile.useOfFunds.join(", ") || "unknown"} />
        </dl>
        {profile.fieldsNeedingClarification.length > 0 && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <span className="font-medium">Needs clarification:</span>{" "}
            {profile.fieldsNeedingClarification.join("; ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
