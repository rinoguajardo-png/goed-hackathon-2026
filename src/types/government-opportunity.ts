import { z } from "zod";

/**
 * Single normalized shape for an opportunity regardless of where it came
 * from (Grants.gov, SBIR, SAM.gov, ...). Adapters live under lib/sources/*
 * and are the ONLY code allowed to know the source-specific field names.
 * The matching engine and UI must only ever see this shape.
 */

export const OpportunitySourceSchema = z.enum([
  "grants.gov",
  "sbir",
  "sam.gov",
  "usaspending",
]);
export type OpportunitySource = z.infer<typeof OpportunitySourceSchema>;

export const OpportunityTypeSchema = z.enum([
  "grant",
  "cooperative-agreement",
  "contract",
  "sbir",
  "sttr",
  "loan",
  "other",
]);
export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;

export const FundingRangeSchema = z.object({
  min: z.number().nonnegative().nullable(),
  max: z.number().nonnegative().nullable(),
  currency: z.literal("USD").default("USD"),
});
export type FundingRange = z.infer<typeof FundingRangeSchema>;

export const GovernmentOpportunitySchema = z.object({
  source: OpportunitySourceSchema,
  /** ID as issued by the source system (e.g. Grants.gov opportunity id). */
  sourceId: z.string(),

  name: z.string(),
  agency: z.string().nullable().default(null),

  description: z.string().nullable().default(null),
  opportunityType: OpportunityTypeSchema.default("other"),

  eligibility: z.string().nullable().default(null),

  funding: FundingRangeSchema.default({ min: null, max: null, currency: "USD" }),

  postedDate: z.string().datetime().nullable().default(null),
  deadline: z.string().datetime().nullable().default(null),

  industries: z.array(z.string()).default([]),
  technologyAreas: z.array(z.string()).default([]),

  /** States/regions this opportunity is restricted to, if any. Empty = no
   * geographic restriction known. */
  geography: z.array(z.string()).default([]),

  sourceUrl: z.string().nullable().default(null),

  /** Untouched payload from the source API, kept for debugging and for
   * re-normalizing later without another network call. */
  rawSourceData: z.unknown().nullable().default(null),

  /** When we pulled/normalized this record. */
  fetchedAt: z.string().datetime(),
});

export type GovernmentOpportunity = z.infer<typeof GovernmentOpportunitySchema>;
