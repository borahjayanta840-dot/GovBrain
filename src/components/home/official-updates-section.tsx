import Link from "next/link";
import { getOfficialSourceUpdates } from "@/lib/data";
import { SectionHeading, SectionShell } from "@/components/home/section";

export async function OfficialUpdatesSection() {
  const { data: updates, error } = await getOfficialSourceUpdates(3);

  return (
    <SectionShell id="official-updates" labelledBy="official-updates-heading">
      <SectionHeading
        id="official-updates-heading"
        kicker="Verified government sources"
        title="Latest official source updates"
        lead="We check verified government pages daily. Review the original portal before acting on any change."
      />
      {error ? (
        <p role="status" className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
          Official source updates are temporarily unavailable.
        </p>
      ) : updates.length === 0 ? (
        <p className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
          No official source pages have been checked yet. Updates will appear here after
          monitoring is enabled.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {updates.map((update) => (
            <article key={update.id} className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {update.source_title}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {update.page_title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {update.excerpt}
              </p>
              <p className="mt-4 text-xs text-slate-500">
                {update.is_baseline ? "Initial page check" : "Change detected"} ·{" "}
                {new Date(update.detected_at).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <Link
                href={update.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-10 w-fit items-center text-sm font-semibold text-teal-800 underline underline-offset-4 hover:text-teal-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Open official source
              </Link>
            </article>
          ))}
        </div>
      )}
      <p className="mt-5 text-sm leading-6 text-slate-600">
        A detected page change does not confirm that a service rule or deadline changed.
      </p>
      <Link
        href="/updates"
        className="mt-4 inline-flex min-h-10 items-center rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        View all source updates
      </Link>
    </SectionShell>
  );
}
