import { getDemoContext } from "@/lib/demo-context";
import { StartupSwitcher } from "@/components/StartupSwitcher";
import { IntakeExperience } from "@/components/intake/IntakeExperience";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ startup?: string; custom?: string }>;
}

export default async function IntakePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { index, profile } = getDemoContext(sp);

  return (
    <main className="flex-grow flex flex-col max-w-[1280px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-lg">
      <section className="mb-lg text-center md:text-left mt-4 md:mt-8 max-w-3xl">
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-sm">
          Find government opportunities built for your company.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">
          Tell us about your business — or pick one of the official GOED demo companies below. We&apos;ll identify
          potential federal opportunities and explain why they may fit.
        </p>
        <StartupSwitcher activeIndex={index} />
      </section>

      <IntakeExperience key={index ?? "custom"} initialProfile={profile} initialIndex={index} />
    </main>
  );
}
