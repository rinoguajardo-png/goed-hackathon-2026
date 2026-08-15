"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session-constants";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function loginAction(formData: FormData): Promise<void> {
  const viaUtahId = formData.get("utahid") === "1";
  const email = viaUtahId ? "demo.founder@utahid.gov" : String(formData.get("email") ?? "").trim();
  const next = String(formData.get("next") ?? "/intake");
  const remember = formData.get("remember") === "on";
  // Password is intentionally not checked — this is a demo identity gate,
  // not real auth. See lib/session.ts.

  if (!email) redirect(`/login?next=${encodeURIComponent(next)}`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({ email }), {
    path: "/",
    sameSite: "lax",
    ...(remember ? { maxAge: THIRTY_DAYS } : {}), // omit maxAge -> session cookie, cleared when the browser closes
  });

  redirect(next || "/intake");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
