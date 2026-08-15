import type { LucideIcon } from "lucide-react";
import { Compass, Handshake, MessageCircle, ClipboardCheck, CircleUserRound } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/intake", label: "Intake", icon: MessageCircle },
  { href: "/", label: "Map", icon: Compass },
  { href: "/ready", label: "Ready", icon: ClipboardCheck },
  { href: "/support", label: "Support", icon: Handshake },
];

/** Shown separately in the header identity cluster, not as a tab. */
export const PROFILE_ITEM: NavItem = { href: "/profile", label: "Profile", icon: CircleUserRound };
