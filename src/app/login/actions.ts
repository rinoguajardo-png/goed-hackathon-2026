"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session-constants";

export async function loginAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const next = String(formData.get("next") ?? "/intake");

  if (!name) redirect(`/login?next=${encodeURIComponent(next)}`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({ name, company }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days — this is a demo identity cookie, not a real auth session
    sameSite: "lax",
  });

  redirect(next || "/intake");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
