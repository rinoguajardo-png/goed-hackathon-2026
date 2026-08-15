import { Suspense } from "react";
import { AppShell } from "@/components/nav/AppShell";
import { getSession } from "@/lib/session";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <Suspense fallback={null}>
      <AppShell session={session}>{children}</AppShell>
    </Suspense>
  );
}
