import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading, SectionShell } from "@/components/home/section";

export function CscSection({ languageCode }: { languageCode: string }) {
  return (
    <SectionShell id="csc" labelledBy="csc-heading">
      <div className="grid items-center gap-8 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
        <div>
          <SectionHeading
            id="csc-heading"
            kicker="In-person support"
            title="A little help can go a long way."
            lead="Some services are easier with a person by your side. Find a Citizen Service Centre and see what help is available near you."
          />
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-slate-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            Look for verified listings and confirm service details with the
            centre before you visit.
          </p>
        </div>
        <Reveal delay={0.08} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href={`/csc?lang=${languageCode}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl brand-gradient px-6 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Explore the directory
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={`/register-agent?lang=${languageCode}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-700/40 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            List a service centre
          </Link>
        </Reveal>
      </div>
    </SectionShell>
  );
}
