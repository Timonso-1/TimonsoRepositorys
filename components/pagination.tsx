export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const btn =
    "rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:border-line-strong disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Seitennavigation" className="mt-6 flex items-center justify-center gap-2">
      <button type="button" className={btn} disabled={page === 1} onClick={() => onChange(page - 1)}>
        Zurück
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? "page" : undefined}
          onClick={() => onChange(n)}
          className={`h-9 w-9 rounded-lg border text-sm transition-colors ${
            n === page
              ? "border-fg bg-fg text-canvas"
              : "border-line text-muted hover:border-line-strong hover:text-fg"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className={btn}
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        Weiter
      </button>
    </nav>
  );
}
