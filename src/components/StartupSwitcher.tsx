"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Factory, Droplets, ShieldCheck, Users2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GOED_TEST_STARTUPS } from "@/fixtures/goed-test-startups";
import { cn } from "@/lib/utils";

const STARTUP_ICONS: LucideIcon[] = [HeartPulse, Factory, Droplets, ShieldCheck, Users2];

export function StartupSwitcher({ activeIndex }: { activeIndex: number | null }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {GOED_TEST_STARTUPS.map((s, i) => {
        const Icon = STARTUP_ICONS[i];
        const active = i === activeIndex;
        return (
          <Link
            key={s.companyName}
            href={`${pathname}?startup=${i}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-label-caps text-label-caps transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <Icon className="size-3.5" />
            {s.companyName?.replace("GOED Test ", "").replace(/^\d: /, "")}
          </Link>
        );
      })}
    </div>
  );
}
