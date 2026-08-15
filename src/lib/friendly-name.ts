/** "jane.doe@acme.com" -> "Jane Doe". Falls back to the raw email if it
 * doesn't look name-like. Purely cosmetic — never used as an identifier.
 * Kept in its own client-safe module (no next/headers) so client components
 * like AppShell can import it without dragging in server-only cookie code. */
export function friendlyNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return email;
  return parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
}

/** "GOED Test 2: Advanced Manufacturing" -> "Advanced Manufacturing". Strips
 * the internal fixture-labeling prefix so the header shows a real-looking
 * company name instead of test scaffolding. */
export function cleanCompanyName(name: string | null): string | null {
  if (!name) return null;
  return name.replace("GOED Test ", "").replace(/^\d: /, "");
}
