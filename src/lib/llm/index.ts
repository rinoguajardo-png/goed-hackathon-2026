import type { LLMProvider } from "./types";
import { MockLLMProvider } from "./providers/mock-provider";
import { AnthropicProvider } from "./providers/anthropic-provider";

export type { LLMProvider, LLMMessage, LLMCompleteOptions, LLMCompleteResult } from "./types";

let cachedProvider: LLMProvider | null = null;

/**
 * Single place that decides which LLM backs the app. Business logic should
 * call getLLMProvider() and never import a specific provider directly.
 */
export function getLLMProvider(): LLMProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.LLM_PROVIDER || "mock";

  switch (providerName) {
    case "anthropic": {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.warn("LLM_PROVIDER=anthropic but ANTHROPIC_API_KEY is unset. Falling back to mock provider.");
        cachedProvider = new MockLLMProvider();
        break;
      }
      cachedProvider = new AnthropicProvider(apiKey);
      break;
    }
    // OpenAI / Gemini adapters can be dropped in here tomorrow following the
    // same shape as AnthropicProvider — no changes needed outside this file.
    case "mock":
    default:
      cachedProvider = new MockLLMProvider();
      break;
  }

  return cachedProvider;
}
