/**
 * Provider-agnostic LLM interface. Business logic (profile extraction, match
 * explanations, etc.) should depend only on this file, never on a specific
 * vendor SDK. Swapping providers tomorrow means adding one file under
 * lib/llm/providers/ and one line in lib/llm/index.ts.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompleteOptions {
  messages: LLMMessage[];
  /** Hint that the caller wants JSON back. Providers that support structured
   * output should use it; providers that don't should still return text that
   * parses as JSON via prompting. */
  jsonMode?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMCompleteResult {
  text: string;
  provider: string;
  model: string;
}

export interface LLMProvider {
  readonly name: string;
  complete(options: LLMCompleteOptions): Promise<LLMCompleteResult>;
}
