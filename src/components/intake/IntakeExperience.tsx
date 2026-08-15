"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bot, ArrowUp, CheckCircle2, MoreHorizontal, MapPin, Factory, Users, DollarSign, FlaskConical, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StartupProfile } from "@/types/startup-profile";
import { extractProfileAction } from "@/app/(app)/intake/actions";
import { profileFields } from "@/lib/profile-completeness";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

const FIELD_ICONS: Record<string, LucideIcon> = {
  location: MapPin,
  industry: Factory,
  employees: Users,
  revenue: DollarSign,
  "funding-need": DollarSign,
  "rd-activities": FlaskConical,
  "product-maturity": TrendingUp,
};

export function IntakeExperience({
  initialProfile,
  initialIndex,
  greetingName,
}: {
  initialProfile: StartupProfile;
  initialIndex: number | null;
  greetingName?: string;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [usingCustom, setUsingCustom] = useState(initialIndex == null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: greetingName
        ? `Hi ${greetingName} — tell us about your company, what you do, and what you're trying to accomplish.`
        : "Tell us about your company, what you do, and what you're trying to accomplish.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isExtracting, startTransition] = useTransition();

  const fields = profileFields(profile);
  const completeCount = fields.filter((f) => f.complete).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    startTransition(async () => {
      const extracted = await extractProfileAction(text);
      setProfile(extracted);
      setUsingCustom(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            extracted.fieldsNeedingClarification.length > 0
              ? `Got it — I've updated your profile. A couple things I'd still like to confirm: ${extracted.fieldsNeedingClarification.join(" ")}`
              : "Got it — I've updated your profile from what you shared.",
        },
      ]);
    });
  }

  const mapHref = usingCustom ? `/?custom=${encodeURIComponent(JSON.stringify(profile))}` : `/?startup=${initialIndex}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-md flex-grow content-start pb-xl">
      <div className="md:col-span-8 flex flex-col justify-end bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] overflow-hidden relative min-h-[420px] border border-surface-variant">
        <div className="flex-grow p-md overflow-y-auto z-10 flex flex-col justify-end gap-4 max-h-[480px]">
          {messages.map((m, i) =>
            m.role === "ai" ? (
              <div key={i} className="flex items-start gap-sm max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="size-5" />
                </div>
                <div className="bg-surface-container p-sm rounded-2xl rounded-tl-sm text-on-surface shadow-sm font-body-md">{m.text}</div>
              </div>
            ) : (
              <div key={i} className="flex items-end justify-end gap-sm max-w-[85%] self-end">
                <div className="bg-secondary text-on-secondary p-sm rounded-2xl rounded-tr-sm shadow-sm font-body-md">{m.text}</div>
              </div>
            )
          )}
          {isExtracting && (
            <div className="flex items-start gap-sm max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="size-5" />
              </div>
              <div className="bg-surface-container p-sm rounded-2xl rounded-tl-sm text-on-surface-variant shadow-sm font-body-md italic">
                Reading your description...
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-md bg-surface-container-lowest border-t border-surface-variant z-20">
          <div className="relative flex items-center bg-surface-container-low rounded-xl border border-outline-variant focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all shadow-sm">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md p-sm resize-none"
              placeholder="e.g. We are a software firm in SLC..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isExtracting || !input.trim()}
              className="absolute right-sm bottom-sm w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-container transition-colors shadow-md disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="font-label-caps text-label-caps text-outline">Press Enter to send</span>
          </div>
        </form>
      </div>

      <div className="md:col-span-4 flex flex-col gap-sm">
        <div className="flex justify-between items-center mb-xs">
          <h3 className="font-heading text-headline-sm text-primary">Building Your Profile</h3>
          <span className="font-label-caps text-label-caps bg-tertiary-fixed-dim text-on-tertiary-fixed-variant px-2 py-1 rounded-full">
            {completeCount} of {fields.length} Complete
          </span>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-1.5 mb-sm">
          <div className="bg-secondary h-1.5 rounded-full transition-all" style={{ width: `${(completeCount / fields.length) * 100}%` }} />
        </div>
        <div className="flex flex-col gap-sm">
          {fields.map((field) => {
            const Icon = FIELD_ICONS[field.id] ?? Factory;
            return (
              <div
                key={field.id}
                className={cn(
                  "p-sm rounded-lg flex items-center justify-between transition-transform",
                  field.complete
                    ? "bg-surface-container-lowest border border-tertiary-fixed-dim shadow-[var(--shadow-card)] hover:-translate-y-0.5"
                    : "bg-surface-container-low border border-dashed border-outline-variant opacity-70"
                )}
              >
                <div className="flex items-center gap-sm">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      field.complete ? "bg-tertiary-fixed text-on-tertiary-container" : "bg-surface-variant text-on-surface-variant"
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-outline">{field.label}</p>
                    <p className={cn("font-body-md", field.complete ? "text-on-surface font-semibold" : "font-body-sm text-on-surface-variant italic")}>
                      {field.value ?? "Listening..."}
                    </p>
                  </div>
                </div>
                {field.complete ? (
                  <CheckCircle2 className="text-tertiary-fixed-dim size-5 shrink-0" />
                ) : (
                  <MoreHorizontal className="text-outline-variant size-5 shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        <Link
          href={mapHref}
          className="mt-sm bg-primary hover:bg-primary-container text-primary-foreground font-body-md text-body-md font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[48px]"
        >
          Generate Government Opportunity Map
        </Link>
      </div>
    </div>
  );
}
