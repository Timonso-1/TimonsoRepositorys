import type { ContributionDay } from "@/lib/github";
import { formatDate } from "@/lib/format";

const LEVELS = [
  "bg-line",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
] as const;

function levelFor(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)));
}

export function ContributionHeatmap({
  days,
  total,
}: {
  days: ContributionDay[];
  total: number;
}) {
  const max = days.reduce((m, d) => Math.max(m, d.count), 0);
  const weeks = Math.ceil(days.length / 7);

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="sr-only">{total} Beiträge in den letzten 12 Monaten.</p>
      <div className="overflow-x-auto pb-1">
        <div
          role="img"
          aria-label={`Aktivitäts-Heatmap mit ${total} Beiträgen in den letzten 12 Monaten`}
          className="grid min-w-[44rem] gap-[3px]"
          style={{
            gridTemplateRows: "repeat(7, 0.75rem)",
            gridAutoFlow: "column",
            gridTemplateColumns: `repeat(${weeks}, 0.75rem)`,
          }}
        >
          {days.map((day) => (
            <span
              key={day.date}
              title={`${day.count} Beiträge am ${formatDate(day.date)}`}
              className={`rounded-[3px] ${LEVELS[levelFor(day.count, max)]}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{total.toLocaleString("de-DE")} Beiträge in den letzten 12 Monaten</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Weniger
          {LEVELS.map((cls) => (
            <span key={cls} className={`h-3 w-3 rounded-[3px] ${cls}`} />
          ))}
          Mehr
        </span>
      </div>
    </div>
  );
}
