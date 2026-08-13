import { Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60 sticky top-0 z-10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="size-4.5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-foreground">
              GOED Federal Funding Intelligence
            </p>
            <p className="text-xs leading-tight text-muted-foreground">
              Government funding analyst for startups
            </p>
          </div>
        </div>
        <Badge variant="secondary">AI Builder Day 2026</Badge>
      </div>
    </header>
  );
}
