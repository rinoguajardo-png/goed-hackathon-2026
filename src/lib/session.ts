import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session-constants";

export interface DemoSession {
  email: string;
}

export { friendlyNameFromEmail } from "@/lib/friendly-name";

/** Lightweight demo identity — a cookie set at login, not real auth. Good
 * enough to gate the flow and personalize the UI for a hackathon demo;
 * swapping in real accounts (Supabase Auth/NextAuth) is future work. */
export async function getSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.email !== "string" || !parsed.email) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}
