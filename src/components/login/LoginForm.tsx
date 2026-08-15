"use client";

import { useFormStatus } from "react-dom";
import { Network, ArrowRight } from "lucide-react";
import { loginAction } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-sm bg-primary hover:bg-primary-container text-primary-foreground font-body-md text-body-md font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Continue"}
      <ArrowRight className="size-5" />
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  return (
    <form action={loginAction} className="flex flex-col gap-md w-full max-w-sm">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-xs">
        <label htmlFor="name" className="font-label-caps text-label-caps text-on-surface-variant">
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Jane Founder"
          className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>
      <div className="flex flex-col gap-xs">
        <label htmlFor="company" className="font-label-caps text-label-caps text-on-surface-variant">
          Company name
        </label>
        <input
          id="company"
          name="company"
          placeholder="Acme Robotics"
          className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
      </div>
      <SubmitButton />
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
        Demo sign-in — no password needed. This just personalizes your session.
      </p>
    </form>
  );
}

export function LoginBrand() {
  return (
    <div className="flex flex-col items-center gap-sm mb-lg">
      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <Network className="size-7" />
      </div>
      <h1 className="font-heading text-headline-lg-mobile text-primary text-center">UT Opportunity Navigator</h1>
      <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-xs">
        Sign in to find the federal opportunities built for your company.
      </p>
    </div>
  );
}
