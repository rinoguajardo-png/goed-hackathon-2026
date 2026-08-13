import type { LLMCompleteOptions, LLMCompleteResult, LLMProvider } from "../types";

/**
 * Deterministic stand-in for a real LLM. Lets every downstream feature
 * (profile extraction, match explanations) be built and tested today without
 * depending on which provider the hackathon organizers give us tomorrow.
 */
export class MockLLMProvider implements LLMProvider {
  readonly name = "mock";

  async complete(options: LLMCompleteOptions): Promise<LLMCompleteResult> {
    const lastUserMessage =
      [...options.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const text = options.jsonMode
      ? JSON.stringify({
          mock: true,
          note: "MockLLMProvider does not perform real reasoning. Replace LLM_PROVIDER in .env.local with a real provider to get real output.",
          receivedPromptPreview: lastUserMessage.slice(0, 200),
        })
      : `[mock response] Received ${options.messages.length} message(s). Configure LLM_PROVIDER to get a real completion.`;

    return {
      text,
      provider: this.name,
      model: "mock-1",
    };
  }
}
