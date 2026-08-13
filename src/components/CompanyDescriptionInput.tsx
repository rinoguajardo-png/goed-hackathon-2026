"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CompanyDescriptionInputProps {
  initialValue?: string;
  onSubmit: (description: string) => void;
  submitting?: boolean;
}

export function CompanyDescriptionInput({
  initialValue = "",
  onSubmit,
  submitting = false,
}: CompanyDescriptionInputProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
    >
      <label htmlFor="company-description" className="text-sm font-medium text-foreground">
        Tell us about your company
      </label>
      <Textarea
        id="company-description"
        className="min-h-32"
        placeholder="We're a 15-person Utah healthcare SaaS company using AI to reduce administrative work for nurses..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" size="lg" disabled={submitting || !value.trim()} className="self-start">
        <Sparkles data-icon="inline-start" />
        {submitting ? "Analyzing..." : "Find federal opportunities"}
      </Button>
    </form>
  );
}
