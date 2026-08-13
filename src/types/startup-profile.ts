import { z } from "zod";

/**
 * Every field is nullable/optional on purpose: a founder's raw description
 * rarely mentions all of these, and the LLM extraction step tomorrow needs to
 * be able to say "unknown" rather than guess. `confidence` and
 * `fieldsNeedingClarification` let the UI ask the founder to fill gaps
 * instead of silently matching on missing data.
 */

export const FundingStageSchema = z.enum([
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "series-c-plus",
  "growth",
  "bootstrapped",
  "unknown",
]);
export type FundingStage = z.infer<typeof FundingStageSchema>;

export const ProductMaturitySchema = z.enum([
  "concept",
  "prototype",
  "pilot",
  "early-revenue",
  "scaling",
  "mature",
  "unknown",
]);
export type ProductMaturity = z.infer<typeof ProductMaturitySchema>;

export const MoneyRangeSchema = z.object({
  min: z.number().nonnegative().nullable(),
  max: z.number().nonnegative().nullable(),
  currency: z.literal("USD").default("USD"),
});
export type MoneyRange = z.infer<typeof MoneyRangeSchema>;

export const StartupProfileSchema = z.object({
  /** Free-text description the founder originally provided. Always kept
   * verbatim so re-extraction is possible with a better prompt/provider. */
  rawDescription: z.string(),

  companyName: z.string().nullable().default(null),
  companyDescription: z.string().nullable().default(null),

  industry: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),

  location: z
    .object({
      city: z.string().nullable().default(null),
      state: z.string().nullable().default(null),
      country: z.string().nullable().default("USA"),
    })
    .default({ city: null, state: null, country: "USA" }),

  employees: z.number().int().nonnegative().nullable().default(null),

  annualRevenue: z.number().nonnegative().nullable().default(null),

  fundingStage: FundingStageSchema.default("unknown"),
  capitalRaisedToDate: z.number().nonnegative().nullable().default(null),

  rdActivities: z.array(z.string()).default([]),
  productMaturity: ProductMaturitySchema.default("unknown"),

  targetCustomers: z.array(z.string()).default([]),

  /** What the startup is trying to raise right now, not lifetime capital. */
  fundingNeed: MoneyRangeSchema.default({ min: null, max: null, currency: "USD" }),
  useOfFunds: z.array(z.string()).default([]),

  /** 0-1. How much of this profile came from confident extraction vs.
   * defaults. Drives whether the UI should prompt for clarification. */
  extractionConfidence: z.number().min(0).max(1).default(0),
  fieldsNeedingClarification: z.array(z.string()).default([]),
});

export type StartupProfile = z.infer<typeof StartupProfileSchema>;

export function createEmptyStartupProfile(rawDescription: string): StartupProfile {
  return StartupProfileSchema.parse({ rawDescription });
}
