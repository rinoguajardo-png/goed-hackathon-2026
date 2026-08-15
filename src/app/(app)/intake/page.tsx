import { tryParseCustomProfile } from "@/lib/demo-context";
import { createEmptyStartupProfile } from "@/types/startup-profile";
import { IntakeExperience } from "@/components/intake/IntakeExperience";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ custom?: string }>;
}

export default async function IntakePage({ searchParams }: PageProps) {
  const { custom } = await searchParams;
  const profile = tryParseCustomProfile(custom) ?? createEmptyStartupProfile("");

  return (
    <main className="flex-grow flex flex-col max-w-[1280px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-lg">
      <section className="mb-lg text-center md:text-left mt-4 md:mt-8 max-w-3xl">
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-sm">
          Find government opportunities built for your company.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">
          Tell us about your business — what you do, your technology, your team, and what you&apos;re trying to
          accomplish. We&apos;ll identify potential federal opportunities and explain why they may fit.
        </p>
      </section>

      <IntakeExperience initialProfile={profile} />
    </main>
  );
}
