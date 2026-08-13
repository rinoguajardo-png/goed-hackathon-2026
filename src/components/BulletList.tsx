import type { LucideIcon } from "lucide-react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulletListProps {
  title: string;
  items: string[];
  emptyLabel?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

/** Shared renderer for the concerns / what-to-verify / next-steps sections —
 * same shape (title + bullet list), different content, semantics, and icon. */
export function BulletList({
  title,
  items,
  emptyLabel = "None noted",
  icon: Icon = Circle,
  iconClassName = "text-muted-foreground",
}: BulletListProps) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-1.5 space-y-1.5 text-sm text-foreground/90">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon className={cn("mt-0.5 size-3.5 shrink-0", iconClassName)} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted-foreground italic">{emptyLabel}</p>
      )}
    </div>
  );
}
