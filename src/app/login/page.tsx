import { Landmark, ShieldCheck, Building2, Wallet, TrendingUp } from "lucide-react";
import { LoginForm } from "@/components/login/LoginForm";

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <main className="h-full min-h-screen flex items-center justify-center login-canyon-bg relative overflow-hidden font-body-md text-on-surface">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col md:flex-row gap-lg items-center">
        {/* Branding / hero side */}
        <div className="hidden md:flex flex-col text-primary-foreground pr-lg flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-xl">
            <Landmark className="size-9" />
            <span className="font-heading text-headline-md font-bold tracking-tight">UT Opportunity Navigator</span>
          </div>
          <h1 className="font-heading text-data-display mb-sm">
            Access Your
            <br />
            Economic Future.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary-fixed-dim mb-lg max-w-[28rem]">
            Connect with funding, resources, and institutional support designed to accelerate your business in Utah.
          </p>
          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-xs">
              <ShieldCheck className="size-[18px] text-tertiary-fixed" />
              <span className="font-body-sm text-body-sm text-secondary-fixed">Secure government-backed portal</span>
            </div>
            <div className="flex gap-4 items-center opacity-70">
              <Building2 className="size-7" />
              <Wallet className="size-7" />
              <TrendingUp className="size-7" />
            </div>
          </div>
        </div>

        {/* Login form side — sizing lives on this plain outer box; the
            backdrop-blur + overflow-hidden effects are isolated on the inner
            child below. Safari has a bug where backdrop-filter + overflow
            on a flex/grid item directly collapses it to min-content width;
            keeping this wrapper "plain" avoids it. */}
        <div className="w-full md:w-[420px] md:shrink-0 mx-auto">
          <div className="bg-surface-bright/90 backdrop-blur-md rounded-xl shadow-[0px_8px_20px_rgba(0,33,71,0.25)] p-gutter md:p-lg border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary-container" />

            <div className="md:hidden flex items-center gap-sm mb-lg text-primary-container">
              <Landmark className="size-7" />
              <span className="font-heading text-headline-sm font-bold">UT Opportunity Navigator</span>
            </div>

            <div className="mb-lg">
              <h2 className="font-heading text-headline-md text-primary mb-xs">Sign In</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Enter your email to access your dashboard.</p>
            </div>

            <LoginForm next={next ?? "/intake"} />

            <div className="mt-lg text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don&apos;t have an account? <span className="font-semibold text-secondary">Any email creates one</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
