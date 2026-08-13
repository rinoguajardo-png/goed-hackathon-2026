import { z } from "zod";

/**
 * Answers "who else has received this money?" Populated later from
 * USAspending and SBIR award history; kept separate from
 * GovernmentOpportunity because an award is a past fact, not an open
 * opportunity to apply to.
 */

export const HistoricalAwardSourceSchema = z.enum(["usaspending", "sbir"]);
export type HistoricalAwardSource = z.infer<typeof HistoricalAwardSourceSchema>;

export const HistoricalAwardSchema = z.object({
  source: HistoricalAwardSourceSchema,
  sourceId: z.string(),

  recipientName: z.string(),
  agency: z.string().nullable().default(null),
  program: z.string().nullable().default(null),
  awardTitle: z.string().nullable().default(null),

  amount: z.number().nonnegative().nullable().default(null),
  year: z.number().int().nullable().default(null),

  state: z.string().nullable().default(null),
  naicsCode: z.string().nullable().default(null),
  category: z.string().nullable().default(null),

  technologyArea: z.string().nullable().default(null),
  description: z.string().nullable().default(null),

  rawSourceData: z.unknown().nullable().default(null),
});

export type HistoricalAward = z.infer<typeof HistoricalAwardSchema>;
