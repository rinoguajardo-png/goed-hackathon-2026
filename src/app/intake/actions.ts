"use server";

import { extractStartupProfile } from "@/lib/extraction/extract-profile";
import type { StartupProfile } from "@/types/startup-profile";

export async function extractProfileAction(rawDescription: string): Promise<StartupProfile> {
  return extractStartupProfile(rawDescription);
}
