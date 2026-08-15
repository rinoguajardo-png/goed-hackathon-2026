"use client";

import { useFormStatus } from "react-dom";
import { Mail, Lock, KeyRound } from "lucide-react";
import { loginAction } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm font-heading text-headline-sm text-primary-foreground bg-primary-container hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors min-h-[48px] disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  return (
    <form action={loginAction} className="space-y-md">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="block font-body-sm text-body-sm font-bold text-on-surface mb-xs" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
            <Mail className="size-[18px]" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block font-body-sm text-body-sm font-bold text-on-surface mb-xs" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
            <Lock className="size-[18px]" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 text-secondary focus:ring-secondary border-outline-variant rounded bg-surface-container-lowest"
          />
          <label htmlFor="remember" className="ml-2 font-body-sm text-body-sm text-on-surface-variant">
            Remember me
          </label>
        </div>
        <span className="font-body-sm text-body-sm text-outline cursor-default" title="Demo build — not wired up">
          Forgot password?
        </span>
      </div>

      <SubmitButton />

      <div className="relative py-sm">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-surface-bright font-body-sm text-body-sm text-outline">Or continue with</span>
        </div>
      </div>

      <button
        type="submit"
        name="utahid"
        value="1"
        className="w-full flex justify-center items-center py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors min-h-[48px]"
      >
        <KeyRound className="mr-2 size-[18px] text-primary-container" />
        Sign in with UtahID
      </button>

      <p className="font-body-sm text-body-sm text-on-surface-variant text-center pt-sm">
        Demo sign-in — password isn&apos;t checked. Any email gets you in.
      </p>
    </form>
  );
}
