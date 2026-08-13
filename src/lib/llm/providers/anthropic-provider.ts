import type { LLMCompleteOptions, LLMCompleteResult, LLMProvider } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";

/**
 * Minimal Anthropic implementation using raw fetch (no SDK dependency) to
 * prove the LLMProvider interface works with a real backend. Swap the model
 * string once we know what the hackathon environment provides.
 */
export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(options: LLMCompleteOptions): Promise<LLMCompleteResult> {
    const systemMessage = options.messages.find((m) => m.role === "system")?.content;
    const conversation = options.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature,
        system: systemMessage,
        messages: conversation,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    return { text, provider: this.name, model: this.model };
  }
}
