"use client";

import { useState } from "react";

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
      <label htmlFor="company-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tell us about your company
      </label>
      <textarea
        id="company-description"
        className="min-h-32 w-full rounded-lg border border-gray-300 p-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        placeholder="We're a 15-person Utah healthcare SaaS company using AI to reduce administrative work for nurses..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting || !value.trim()}
        className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Analyzing..." : "Find federal opportunities"}
      </button>
    </form>
  );
}
