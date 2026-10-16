export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#e9ece7] px-5 py-8 sm:px-8 sm:py-10"
      aria-busy="true"
      aria-label="Loading admin workspace"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="h-3 w-36 animate-pulse rounded-full bg-slate-300/70" />
        <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded-xl bg-slate-300/70" />
        <div className="mt-3 h-5 w-[32rem] max-w-full animate-pulse rounded-lg bg-slate-200/80" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-3xl border border-white/70 bg-[#edf0eb] shadow-sm"
            />
          ))}
        </div>
        <div className="mt-10 h-[32rem] animate-pulse rounded-[2rem] border border-white/70 bg-[#edf0eb] shadow-md" />
      </div>
    </main>
  );
}
