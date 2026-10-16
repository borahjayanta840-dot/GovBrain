"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { AdminService } from "@/lib/admin";

type ServiceStatus = "all" | "published" | "draft" | "inactive";

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "published" || status === "verified"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-700/10"
      : status === "draft" || status === "needs_review" || status === "outdated"
        ? "bg-amber-50 text-amber-800 ring-amber-700/10"
        : "bg-slate-100 text-slate-700 ring-slate-700/10";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${tone}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function AdminServiceDirectory({
  services,
  states,
}: {
  services: AdminService[];
  states: { id: string; name: string; code: string }[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ServiceStatus>("all");
  const stateNames = useMemo(
    () => new Map(states.map((item) => [item.id, item.name])),
    [states],
  );
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return services.filter((service) => {
      if (status !== "all" && service.status !== status) return false;
      if (!normalizedQuery) return true;
      const englishName =
        service.translations.find(
          (translation) => translation.language_code === "en",
        )?.name ?? "";
      return [
        englishName,
        service.slug,
        service.source?.source_title ?? "",
        stateNames.get(service.state_id) ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, services, stateNames, status]);

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-5 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search service records</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by service, state, or official source"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/75 py-2.5 pr-4 pl-10 text-sm text-slate-800 shadow-inner transition outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-800/10"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/75 px-3 text-sm text-slate-600">
          <span className="shrink-0 text-xs font-semibold text-slate-500">
            Status
          </span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ServiceStatus)}
            className="min-w-28 border-0 bg-transparent py-1 text-sm font-semibold text-slate-800 outline-none focus:ring-0"
            aria-label="Filter by service status"
          >
            <option value="all">All records</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 py-4">
        <p className="text-xs font-medium text-slate-500" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredServices.length}
          </span>{" "}
          of {services.length} service records
        </p>
        {query || status !== "all" ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-teal-800 hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredServices.length ? (
        <div className="-mx-1 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                <th scope="col" className="px-4 py-3 font-bold">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  State
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Visibility
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Official source
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => {
                const title =
                  service.translations.find(
                    (translation) => translation.language_code === "en",
                  )?.name ?? service.slug;
                const sourceStatus = service.source?.status ?? "missing";
                return (
                  <tr
                    key={service.id}
                    className="group transition-colors hover:bg-white/55"
                  >
                    <th
                      scope="row"
                      className="border-t border-slate-200/70 px-4 py-4 font-normal"
                    >
                      <span className="block max-w-xs truncate text-sm font-semibold text-slate-800">
                        {title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        /{service.slug}
                      </span>
                    </th>
                    <td className="border-t border-slate-200/70 px-4 py-4 text-sm text-slate-600">
                      {stateNames.get(service.state_id) ?? "—"}
                    </td>
                    <td className="border-t border-slate-200/70 px-4 py-4">
                      <StatusPill status={service.status} />
                    </td>
                    <td className="border-t border-slate-200/70 px-4 py-4">
                      <span className="mb-1.5 block max-w-[190px] truncate text-xs font-medium text-slate-600">
                        {service.source?.source_title ?? "No source linked"}
                      </span>
                      <StatusPill status={sourceStatus} />
                    </td>
                    <td className="border-t border-slate-200/70 px-4 py-4 text-right">
                      <Link
                        href={`/admin?service=${encodeURIComponent(service.id)}#service-editor`}
                        aria-label={`Edit ${title}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-teal-800 transition-colors hover:bg-white hover:text-teal-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                      >
                        Edit{" "}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300/80 px-5 py-12 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No matching service records
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try another search or status filter.
          </p>
        </div>
      )}
    </div>
  );
}
