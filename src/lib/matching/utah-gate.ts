import type { StartupProfile } from "@/types/startup-profile";

/**
 * This product is Utah-only by design (GOED-funded pilot). A company outside
 * Utah is eliminated before any matching/scoring runs, rather than scored
 * low — being out of state isn't a weak fit, it's out of scope entirely.
 */
const UTAH_STATE_VALUES = new Set(["ut", "utah"]);

export function isUtahEligible(profile: StartupProfile): boolean {
  const state = profile.location.state?.trim().toLowerCase() ?? "";
  return UTAH_STATE_VALUES.has(state);
}
