"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";

type Day = { date: string; count: number };
type Hover = { day: Day; left: number; top: number };

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

export function ContributionHeatmap({ days, total }: { days: Day[]; total: number }) {
  const [hover, setHover] = useState<Hover | null>(null);
  const max = days.reduce((m, d) => Math.max(m, d.count), 0);
  const weeks = Math.ceil(days.length / 7);

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="sr-only">{total} Beiträge in den letzten 12 Monaten.</p>
      <div className="overflow-x-auto pb-1 pt-10">
        <div
          role="img"
          aria-label={`Aktivitäts-Heatmap mit ${total} Beiträgen in den letzten 12 Monaten`}
          className="relative grid min-w-[44rem] gap-[3px]"
          style={{
            gridTemplateRows: "repeat(7, 0.75rem)",
            gridAutoFlow: "column",
            gridTemplateColumns: `repeat(${weeks}, 0.75rem)`,
          }}
          onMouseLeave={() => setHover(null)}
        >
          {days.map((day) => (
            <span
              key={day.date}
              onMouseEnter={(e) =>
                setHover({
                  day,
                  left: e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2,
                  top: e.currentTarget.offsetTop,
                })
              }
              className={`rounded-[3px] transition-transform hover:scale-125 ${
                LEVELS[levelFor(day.count, max)]
              }`}
            />
          ))}
          {hover && (
            <div
              role="tooltip"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line-strong bg-canvas px-2.5 py-1.5 text-xs shadow-lg"
              style={{ left: hover.left, top: hover.top - 6 }}
            >
              <span className="font-semibold">
                {hover.day.count === 0
                  ? "Keine Beiträge"
                  : `${hover.day.count.toLocaleString("de-DE")} ${
                      hover.day.count === 1 ? "Beitrag" : "Beiträge"
                    }`}
              </span>
              <span className="text-muted"> am {formatDate(hover.day.date)}</span>
            </div>
          )}
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
