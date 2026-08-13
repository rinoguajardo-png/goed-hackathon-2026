"use client";

import { useState } from "react";
import { CompanyDescriptionInput } from "./CompanyDescriptionInput";

/** Proves CompanyDescriptionInput renders and captures input. Real
 * extraction (raw description -> StartupProfile via the LLM provider) is
 * tomorrow's work — this just echoes back what was typed. */
export function CompanyDescriptionDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <CompanyDescriptionInput onSubmit={setSubmitted} />
      {submitted && (
        <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          Captured — profile extraction wires in tomorrow. You typed: &quot;{submitted}&quot;
        </p>
      )}
    </div>
  );
}
