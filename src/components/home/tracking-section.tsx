import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading, SectionShell } from "@/components/home/section";
import { trackingSteps } from "@/config/home";

/** Illustrates common application stages without implying live tracking data. */
export function TrackingSection({ languageCode }: { languageCode: string }) {
  return (
    <SectionShell id="tracking" labelledBy="tracking-heading">
      <SectionHeading
        id="tracking-heading"
        kicker="Application tracking"
        title="Understand the application journey"
        lead="Requests may pass through stages like these. For the current status of an application, check with the official service or assisting centre."
      />
      <ol className="mt-8 grid gap-4 md:grid-cols-5">
        {trackingSteps.map((step, index) => (
          <Reveal key={step.title} delay={Math.min(index, 4) * 0.06}>
            <li className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md">
                {index + 1}
              </span>
              <p className="mt-3 text-sm font-bold text-slate-900">
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {step.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.08}>
        <Link
          href={`/my-services?lang=${languageCode}`}
          className="mt-6 inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          View saved services →
        </Link>
      </Reveal>
    </SectionShell>
  );
}
