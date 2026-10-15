import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading, SectionShell } from "@/components/home/section";
import { HomeIcon } from "@/components/home/home-icon";
import { popularServices } from "@/config/home";

/** Popular services grid — every card deep-links into /services search. */
export function PopularServicesSection({
  languageCode,
}: {
  languageCode: string;
}) {
  return (
    <SectionShell
      id="services"
      labelledBy="popular-services-heading"
      className="border-y border-slate-200/70 bg-[#f4f5f0]"
    >
      <SectionHeading
        id="popular-services-heading"
        kicker="Popular services"
        title="A useful place to begin"
        lead="Explore common service topics. Availability and requirements depend on the official service and your state."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularServices.map((service, index) => (
          <Reveal key={service.title} delay={Math.min(index, 7) * 0.05}>
            <article className="card-hover flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4f0] text-teal-800">
                <HomeIcon name={service.icon} />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-slate-900">
                {service.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
              <Link
                href={`/services?lang=${languageCode}&q=${encodeURIComponent(service.query)}`}
                className="mt-5 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Explore guidance
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
