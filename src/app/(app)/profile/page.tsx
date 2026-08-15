import { StartupProfilePreview } from "@/components/StartupProfilePreview";
import { StartupSwitcher } from "@/components/StartupSwitcher";
import { getDemoContext } from "@/lib/demo-context";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ startup?: string; custom?: string }>;
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { index, profile } = getDemoContext(sp);

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary">Company Profile</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          What we know about your company so far. Switch demo companies below, or head to Intake to describe a new one.
        </p>
        <StartupSwitcher activeIndex={index} />
      </div>
      <StartupProfilePreview profile={profile} />
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-2">Original description</h2>
        <p className="font-body-md text-body-md text-on-surface italic">&quot;{profile.rawDescription}&quot;</p>
      </div>
    </main>
  );
}
