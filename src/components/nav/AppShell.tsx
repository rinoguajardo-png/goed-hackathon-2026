"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Network, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/login/actions";
import { NAV_ITEMS } from "./nav-items";
import { friendlyNameFromEmail } from "@/lib/friendly-name";
import type { DemoSession } from "@/lib/session";

export function AppShell({ children, session }: { children: React.ReactNode; session: DemoSession | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startup = searchParams.get("startup");
  const custom = searchParams.get("custom");
  const withStartup = (href: string) => {
    const param = custom ? `custom=${custom}` : startup !== null ? `startup=${startup}` : null;
    if (!param) return href;
    return `${href}${href.includes("?") ? "&" : "?"}${param}`;
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-full flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-sm bg-surface h-16 md:h-20 border-b border-surface-variant/20 shadow-[0px_4px_12px_rgba(0,33,71,0.04)] md:shadow-none">
        <Link href={withStartup("/")} className="flex items-center gap-sm">
          <Network className="text-primary size-6" strokeWidth={2} />
          <span className="font-heading text-headline-sm font-bold text-primary tracking-tight truncate max-w-[180px] md:max-w-none">
            UT Opportunity Navigator
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-md">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={withStartup(item.href)}
                className={cn(
                  "font-label-caps text-label-caps flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors",
                  active
                    ? "text-primary bg-surface-container-lowest shadow-[0px_4px_12px_rgba(0,33,71,0.08)]"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {session && (
            <span className="hidden md:inline font-body-sm text-body-sm text-on-surface-variant" title={session.email}>
              {friendlyNameFromEmail(session.email)}
            </span>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors text-primary relative"
            aria-label="Notifications"
          >
            <Bell className="size-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          {session && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="size-5" />
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="flex-grow w-full pt-16 md:pt-20 pb-[84px] md:pb-0">{children}</main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-xs pb-[env(safe-area-inset-bottom)] pt-2 bg-surface-container-lowest shadow-[0px_-4px_12px_rgba(0,33,71,0.08)] rounded-t-xl h-[76px]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={withStartup(item.href)}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg transition-all duration-200",
                active
                  ? "bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-90"
                  : "text-on-surface-variant p-2 hover:bg-surface-container w-16"
              )}
            >
              <Icon className="size-6" />
              <span className="font-label-caps text-label-caps mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
