import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading, SectionShell } from "@/components/home/section";
import { HomeIcon } from "@/components/home/home-icon";
import { jobHubCards } from "@/config/home";

/** Opportunity categories that lead to the published service catalog. */
export function JobsSection({ languageCode }: { languageCode: string }) {
  return (
    <SectionShell id="jobs" labelledBy="jobs-heading">
      <SectionHeading
        id="jobs-heading"
        kicker="Job & opportunity hub"
        title="Explore opportunities"
        lead="Browse guidance for jobs, apprenticeships, internships and scholarships. Check each official listing for current dates and requirements."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobHubCards.map((card, index) => (
          <Reveal key={card.title} delay={Math.min(index, 4) * 0.05}>
            <article className="card-hover relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <span className="absolute top-5 right-5 rounded-full bg-[#f2f4ef] px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {card.badge}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4f0] text-teal-800">
                <HomeIcon name={card.icon} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
              <Link
                href={`/services?lang=${languageCode}&q=${encodeURIComponent(card.query)}`}
                className="mt-4 inline-flex w-fit text-sm font-bold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Browse guidance →
              </Link>
            </article>
          </Reveal>
        ))}
        <Reveal delay={0.1}>
          <Link
            href="#newsletter"
            className="card-hover flex h-full min-h-44 flex-col justify-center rounded-xl border border-dashed border-teal-700/30 bg-teal-50/50 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <HomeIcon name="Bell" />
            </span>
            <span className="mt-4 text-base font-bold text-slate-900">
              Get job alerts
            </span>
            <span className="mt-1.5 text-sm leading-6 text-slate-600">
              Subscribe in the newsletter below for weekly openings.
            </span>
            <span className="mt-3 text-xs font-bold tracking-widest text-teal-700 uppercase">
              Notify me →
            </span>
          </Link>
        </Reveal>
      </div>
    </SectionShell>
  );
}
