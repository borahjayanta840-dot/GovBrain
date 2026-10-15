import Link from "next/link";
import { ArrowRight, Check, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { AiAssistant } from "@/components/ai-assistant";
import { SearchForm } from "@/components/search-form";
import { Reveal } from "@/components/home/reveal";
import { popularSearches } from "@/config/home";

/** Editorial welcome and a concise visual guide to the service journey. */
export function HeroSection({ languageCode }: { languageCode: string }) {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden border-b border-slate-200/70 bg-[#f8f8f3]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-52 -z-10 h-[38rem] w-[38rem] rounded-full border border-teal-900/[0.06] sm:right-[-10rem] sm:top-[-20rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-9rem] top-[-8rem] -z-10 h-[25rem] w-[25rem] rounded-full border border-teal-900/[0.06] sm:right-[-1rem] sm:top-[-10rem]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/10 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-teal-900 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
              Independent guidance for public services
            </div>
            <h1
              id="home-hero-heading"
              className="editorial-serif text-balance mt-6 max-w-3xl text-[2.75rem] leading-[1.06] tracking-[-0.045em] text-[#173a34] sm:text-6xl lg:text-[4.35rem]"
            >
              Public services,
              <br className="hidden sm:block" />{" "}
              <span className="text-teal-700">made clearer.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Understand what you may need, prepare with confidence, and find
              the official source for your next step.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-lg shadow-teal-950/[0.06] ring-1 ring-white">
              <SearchForm languageCode={languageCode} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Popular searches">
              <span className="mr-1 text-xs font-semibold text-slate-500">Popular:</span>
              {popularSearches.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={`/services?lang=${languageCode}&q=${encodeURIComponent(item.query)}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white/70 px-3.5 text-xs font-medium text-slate-700 transition-colors hover:border-teal-700/30 hover:bg-teal-50 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/services?lang=${languageCode}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl brand-gradient px-6 text-sm font-semibold text-white shadow-md shadow-teal-950/15 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Explore services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/csc?lang=${languageCode}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 text-sm font-semibold text-slate-800 transition-colors hover:border-teal-700/40 hover:bg-white hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Find in-person help
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200/80 pt-5 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                Official links, clearly shown
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                Browse without an account
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#123f39] p-6 text-white shadow-2xl shadow-teal-950/20 sm:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/[0.09]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-white/[0.09]"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-teal-100/80 uppercase">
                  <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  A clearer way forward
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[11px] font-medium text-white/75">
                  Assam pilot
                </span>
              </div>

              <h2 className="editorial-serif mt-8 max-w-sm text-3xl leading-tight tracking-tight sm:text-[2.6rem]">
                Your next step,
                <br />
                made easier to see.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-teal-50/75">
                Start with a service. Get a simple guide to what comes next.
              </p>

              <ol className="mt-8 space-y-3">
                <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-900">
                    <Compass className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold tracking-[0.12em] text-teal-100/60 uppercase">
                      01 · Discover
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-white">
                      Find the service you need
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-teal-100/60" aria-hidden="true" />
                </li>
                <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e7b968] text-[#3d301d]">
                    <span className="text-sm font-bold">02</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold tracking-[0.12em] text-teal-100/60 uppercase">
                      Prepare
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-white">
                      Understand steps and documents
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-teal-100/60" aria-hidden="true" />
                </li>
                <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-200 text-teal-950">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold tracking-[0.12em] text-teal-100/60 uppercase">
                      Continue
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-white">
                      Use the linked official source
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-teal-100/60" aria-hidden="true" />
                </li>
              </ol>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-teal-100/65">
                <ShieldCheck className="h-4 w-4 shrink-0 text-teal-200" aria-hidden="true" />
                Independent guidance. The official source makes the final decision.
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <AiAssistant languageCode={languageCode} variant="floating" />
    </section>
  );
}
