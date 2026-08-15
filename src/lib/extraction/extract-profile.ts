import { getLLMProvider } from "@/lib/llm";
import { StartupProfileSchema, type StartupProfile } from "@/types/startup-profile";
import { heuristicExtractProfile } from "./heuristic-extract";

const SYSTEM_PROMPT = `You extract a structured company profile from a founder's free-text description.
Respond with ONLY a JSON object matching this shape (no markdown fences, no commentary):
{
  "companyName": string | null,
  "companyDescription": string | null,
  "industry": string[],
  "technologies": string[],
  "location": { "city": string | null, "state": string | null, "country": string },
  "employees": number | null,
  "annualRevenue": number | null,
  "fundingStage": "pre-seed"|"seed"|"series-a"|"series-b"|"series-c-plus"|"growth"|"bootstrapped"|"unknown",
  "capitalRaisedToDate": number | null,
  "rdActivities": string[],
  "productMaturity": "concept"|"prototype"|"pilot"|"early-revenue"|"scaling"|"mature"|"unknown",
  "targetCustomers": string[],
  "fundingNeed": { "min": number | null, "max": number | null, "currency": "USD" },
  "useOfFunds": string[],
  "fieldsNeedingClarification": string[]
}
Only include a field's value if the description supports it — leave arrays empty and numbers null rather than guessing.
List anything genuinely ambiguous or missing in fieldsNeedingClarification.`;

/**
 * Tries the configured LLM first (real reasoning, handles messy free text
 * well); falls back to a deterministic regex/keyword extractor whenever no
 * real provider is configured or the model's output doesn't parse — so the
 * Intake flow never dead-ends on stage.
 */
export async function extractStartupProfile(rawDescription: string): Promise<StartupProfile> {
  const provider = getLLMProvider();

  if (provider.name !== "mock") {
    try {
      const result = await provider.complete({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: rawDescription },
        ],
        jsonMode: true,
        maxTokens: 1024,
        temperature: 0,
      });
      const parsed = JSON.parse(result.text);
      return StartupProfileSchema.parse({
        ...parsed,
        rawDescription,
        extractionConfidence: 1,
      });
    } catch {
      // fall through to heuristic extraction below
    }
  }

  return heuristicExtractProfile(rawDescription);
}
