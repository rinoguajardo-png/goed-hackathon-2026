import type { LucideIcon } from "lucide-react";
import { Compass, Handshake, MessageCircle, ClipboardCheck, CircleUserRound } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Map", icon: Compass },
  { href: "/support", label: "Support", icon: Handshake },
  { href: "/intake", label: "Intake", icon: MessageCircle },
  { href: "/ready", label: "Ready", icon: ClipboardCheck },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];
