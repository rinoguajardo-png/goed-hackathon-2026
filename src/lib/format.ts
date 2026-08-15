export function formatMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function formatFundingRange(min: number | null, max: number | null): string {
  if (min == null && max == null) return "Amount not specified";
  if (min == null) return `Up to ${formatMoney(max)}`;
  if (max == null) return `${formatMoney(min)}+`;
  return `${formatMoney(min)} - ${formatMoney(max)}`;
}

/** Fixed "today" for the demo so day counts stay stable regardless of when it's run. */
export const DEMO_TODAY = new Date("2026-08-15T00:00:00.000Z");

export function daysUntil(iso: string | null, from: Date = DEMO_TODAY): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  const ms = target.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatDeadline(iso: string | null): string {
  const days = daysUntil(iso);
  if (days == null) return "No deadline listed";
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `Closes in ${days} day${days === 1 ? "" : "s"}`;
}
