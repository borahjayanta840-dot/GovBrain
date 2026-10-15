import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getPageLanguage } from "@/lib/language";
import { getOfficialSourceUpdates } from "@/lib/data";

export const metadata: Metadata = {
  title: "Official source updates — GovGuide AI",
  description: "Recently detected changes on verified government source pages.",
};

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { languages, languageCode } = await getPageLanguage((await searchParams).lang);
  const { data: updates, error } = await getOfficialSourceUpdates();

  return (
    <SiteShell languages={languages} languageCode={languageCode}>
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
          Official sources
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
          Latest source updates
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          We automatically check verified government source pages and show when their
          published content changes. A detected page change is not confirmation that a
          service rule or deadline changed; always review the original source.
        </p>

        {error ? (
          <p role="status" className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            Official updates are temporarily unavailable. Please try again later.
          </p>
        ) : updates.length === 0 ? (
          <p className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
            No verified government source pages have been checked yet. The first scheduled
            check records a baseline; later detected changes are added automatically.
          </p>
        ) : (
          <ol className="mt-8 space-y-4">
            {updates.map((update) => (
              <li key={update.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {update.source_title}
                  </p>
                  <time
                    className="text-xs text-slate-500"
                    dateTime={update.detected_at}
                  >
                    {update.is_baseline ? "Initial check" : "Change detected"}{" "}
                    {new Date(update.detected_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </time>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                  {update.page_title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{update.excerpt}</p>
                <Link
                  href={update.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-10 items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  Open official source
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </SiteShell>
  );
}
