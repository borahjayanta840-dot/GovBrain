import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CircleAlert,
  FileText,
  LayoutDashboard,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { AdminServiceDirectory } from "@/components/admin-service-directory";
import { AdminServiceForm } from "@/components/admin-service-form";
import { getAdminStatus, getAdminWorkspace } from "@/lib/admin";

function AccessMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf0eb] px-5 py-16">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/80 bg-[#edf0eb] p-8 shadow-[12px_12px_28px_rgba(69,82,73,0.14),-12px_-12px_28px_rgba(255,255,255,0.8)] sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e3e9e3] text-teal-800 shadow-[inset_3px_3px_7px_rgba(69,82,73,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.8)]">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-8 text-xs font-bold tracking-[0.18em] text-teal-700 uppercase">
          GovGuide AI · Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-3 leading-7 text-slate-600">{description}</p>
        {action}
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof Activity;
  tone: "teal" | "amber" | "slate";
}) {
  const iconTone = {
    teal: "bg-teal-50 text-teal-800",
    amber: "bg-amber-50 text-amber-800",
    slate: "bg-slate-100 text-slate-700",
  }[tone];

  return (
    <article className="rounded-3xl border border-white/80 bg-[#edf0eb] p-5 shadow-[7px_7px_16px_rgba(69,82,73,0.12),-7px_-7px_16px_rgba(255,255,255,0.75)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex size-11 items-center justify-center rounded-2xl ${iconTone}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const { user, isAdmin } = await getAdminStatus();

  if (!user) {
    return (
      <AccessMessage
        title="Sign in to continue"
        description="The admin workspace is available to authorized administrators. Sign in with your admin account to manage service information."
        action={
          <Link
            href="/auth?next=/admin"
            className="brand-gradient mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Sign in securely{" "}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />
    );
  }

  if (!isAdmin) {
    return (
      <AccessMessage
        title="Administrator access required"
        description="This account is signed in but does not have the administrator role. Contact a project administrator if you believe this is a mistake."
      />
    );
  }

  const workspace = await getAdminWorkspace();
  if (!workspace) {
    return (
      <AccessMessage
        title="Workspace temporarily unavailable"
        description="We could not load the service catalog. No changes were made. Please try again shortly."
        action={
          <Link
            href="/admin"
            className="mt-7 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Try again
          </Link>
        }
      />
    );
  }

  const selectedService = workspace.services.find(
    (service) => service.id === params.service,
  );
  const publishedCount = workspace.services.filter(
    (service) => service.status === "published",
  ).length;
  const draftCount = workspace.services.filter(
    (service) => service.status === "draft",
  ).length;
  const sourcesNeedingReview = workspace.services.filter(
    (service) => service.source?.status !== "verified",
  ).length;
  const verifiedSources = workspace.services.length - sourcesNeedingReview;
  const firstName = user.email?.split("@")[0] ?? "Administrator";

  return (
    <div className="admin-workspace min-h-screen bg-[#e9ece7] text-slate-900">
      <a href="#admin-main" className="skip-link">
        Skip to admin content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200/70 bg-[#e9ece7]/90 px-5 py-6 backdrop-blur-xl lg:flex">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <span className="brand-gradient flex size-11 items-center justify-center rounded-2xl text-white">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-900">
              GovGuide AI
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
              Admin workspace
            </span>
          </span>
        </Link>

        <p className="mt-10 mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
          Workspace
        </p>
        <nav aria-label="Admin workspace" className="space-y-1.5">
          <a
            href="#overview"
            className="flex min-h-11 items-center gap-3 rounded-xl bg-white/65 px-3 text-sm font-semibold text-teal-900 shadow-sm ring-1 ring-white/80"
          >
            <LayoutDashboard
              className="size-4 text-teal-700"
              aria-hidden="true"
            />
            Overview
          </a>
          <a
            href="#service-catalog"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white/55 hover:text-teal-900"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Service catalog
          </a>
          <a
            href="#service-editor"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white/55 hover:text-teal-900"
          >
            <FileText className="size-4" aria-hidden="true" />
            Service editor
          </a>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/80 bg-[#edf0eb] p-4 shadow-[inset_3px_3px_7px_rgba(69,82,73,0.09),inset_-3px_-3px_7px_rgba(255,255,255,0.78)]">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white">
              {firstName.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800">
                Administrator
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                {user.email}
              </span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-200/80 pt-3 text-[11px] font-medium text-slate-500">
            <ShieldCheck
              className="size-3.5 text-emerald-700"
              aria-hidden="true"
            />
            Role verified for this session
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#e9ece7]/85 backdrop-blur-xl">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
            <div className="flex min-h-16 items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-700">
                Admin <span className="px-1.5 text-slate-400">/</span>{" "}
                <span className="font-medium text-slate-500">
                  Service operations
                </span>
              </p>
              <Link
                href="/"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/60 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                View public site
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <nav
              aria-label="Admin workspace"
              className="flex gap-2 overflow-x-auto pb-3 lg:hidden"
            >
              <a
                href="#overview"
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl bg-white/65 px-3 text-xs font-semibold text-teal-900 ring-1 ring-white/80"
              >
                <LayoutDashboard className="size-3.5" aria-hidden="true" />
                Overview
              </a>
              <a
                href="#service-catalog"
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-600 hover:bg-white/55"
              >
                <BookOpen className="size-3.5" aria-hidden="true" />
                Service catalog
              </a>
              <a
                href="#service-editor"
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-600 hover:bg-white/55"
              >
                <FileText className="size-3.5" aria-hidden="true" />
                Service editor
              </a>
            </nav>
          </div>
        </header>

        <main
          id="admin-main"
          className="mx-auto max-w-[1600px] scroll-mt-24 px-5 py-8 sm:px-8 sm:py-10"
        >
          <section
            id="overview"
            aria-labelledby="admin-heading"
            className="scroll-mt-24"
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-teal-700 uppercase">
                  Service operations
                </p>
                <h1
                  id="admin-heading"
                  className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
                >
                  Welcome back, {firstName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Keep public service information accurate, discoverable, and
                  connected to its official source.
                </p>
              </div>
              <Link
                href="/admin#service-editor"
                className="brand-gradient inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add a service
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Services in catalog"
                value={workspace.services.length}
                detail="Total records available to manage"
                icon={BookOpen}
                tone="slate"
              />
              <MetricCard
                label="Published"
                value={publishedCount}
                detail="Visible in the public directory"
                icon={BadgeCheck}
                tone="teal"
              />
              <MetricCard
                label="Drafts"
                value={draftCount}
                detail="Saved but not publicly listed"
                icon={FileText}
                tone="slate"
              />
              <MetricCard
                label="Sources to review"
                value={sourcesNeedingReview}
                detail={`${verifiedSources} verified source${verifiedSources === 1 ? "" : "s"}`}
                icon={CircleAlert}
                tone={sourcesNeedingReview ? "amber" : "teal"}
              />
            </div>
          </section>

          <section
            id="service-catalog"
            aria-labelledby="catalog-heading"
            className="mt-10 scroll-mt-24 rounded-[2rem] border border-white/80 bg-[#edf0eb]/85 p-5 shadow-[10px_10px_24px_rgba(69,82,73,0.12),-10px_-10px_24px_rgba(255,255,255,0.75)] sm:p-7"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-teal-700 uppercase">
                  Content library
                </p>
                <h2
                  id="catalog-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-900"
                >
                  Service catalog
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Search the catalog and open a record to review or edit it.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/70">
                <span
                  className="size-1.5 rounded-full bg-emerald-600"
                  aria-hidden="true"
                />
                {workspace.services.length} records loaded
              </span>
            </div>
            <AdminServiceDirectory
              services={workspace.services}
              states={workspace.states}
            />
          </section>

          <section
            id="service-editor"
            aria-labelledby="editor-heading"
            className="mt-10 scroll-mt-24"
          >
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-teal-700 uppercase">
                  {selectedService ? "Editing record" : "Content studio"}
                </p>
                <h2
                  id="editor-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
                >
                  {selectedService
                    ? (selectedService.translations.find(
                        (translation) => translation.language_code === "en",
                      )?.name ?? selectedService.slug)
                    : "Create a service"}
                </h2>
              </div>
              {selectedService ? (
                <Link
                  href="/admin#service-editor"
                  className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-white/60 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  Start a new record
                  <Plus className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-[#edf0eb]/85 p-5 shadow-[10px_10px_24px_rgba(69,82,73,0.12),-10px_-10px_24px_rgba(255,255,255,0.75)] sm:p-7">
              <AdminServiceForm
                workspace={workspace}
                selectedService={selectedService}
              />
            </div>
          </section>

          <footer className="flex flex-col gap-2 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Changes are recorded against the signed-in administrator.</p>
            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck
                className="size-3.5 text-teal-700"
                aria-hidden="true"
              />
              Protected admin workspace
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
