import type { ReactNode } from "react";
import { Reveal } from "@/components/home/reveal";

export function SectionHeading({
  kicker,
  title,
  lead,
  id,
}: {
  kicker: string;
  title: string;
  lead?: string;
  id: string;
}) {
  return (
    <Reveal>
      <p className="text-xs font-bold tracking-[0.18em] text-teal-700 uppercase">
        {kicker}
      </p>
      <h2
        id={id}
        className="editorial-serif text-balance mt-2 text-3xl leading-tight tracking-tight text-slate-900 sm:text-4xl"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-[1.05rem]">
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

export function SectionShell({
  id,
  labelledBy,
  children,
  className = "",
}: {
  id?: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-7xl scroll-mt-28 px-5 py-14 sm:px-8 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );
}
