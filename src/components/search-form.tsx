import Link from "next/link";
import { Search } from "lucide-react";

export function SearchForm({ value = "", languageCode }: { value?: string; languageCode: string }) {
  return <form action="/services" method="get" className="flex w-full flex-col gap-2 sm:flex-row">
    <input type="hidden" name="lang" value={languageCode} />
    <label className="sr-only" htmlFor="service-search">Search government services</label>
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input id="service-search" name="q" defaultValue={value} placeholder="Search a service, document or life event" className="min-h-12 w-full rounded-xl border border-slate-200 bg-[#fbfcfa] py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-500 focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-800/10 sm:min-h-14" />
    </div>
    <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl brand-gradient px-7 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:translate-y-px sm:min-h-14">Search services</button>
    {value && <Link href={`/services?lang=${languageCode}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 transition-colors hover:border-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Clear</Link>}
  </form>;
}
