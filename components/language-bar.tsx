import type { Repo } from "@/lib/github";
import { getLanguageColor } from "@/lib/languages";

type Slice = { language: string; count: number; percent: number };

function computeSlices(repos: Repo[]): Slice[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count, percent: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}

export function LanguageBar({ repos }: { repos: Repo[] }) {
  const slices = computeSlices(repos);
  if (slices.length === 0) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div
        role="img"
        aria-label={`Sprachverteilung: ${slices
          .map((s) => `${s.language} ${Math.round(s.percent)} Prozent`)
          .join(", ")}`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-line"
      >
        {slices.map((s) => (
          <span
            key={s.language}
            title={`${s.language}: ${s.count} ${s.count === 1 ? "Repository" : "Repositories"}`}
            style={{ width: `${s.percent}%`, backgroundColor: getLanguageColor(s.language) }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {slices.map((s) => (
          <li key={s.language} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(s.language) }}
            />
            <span className="font-medium">{s.language}</span>
            <span className="text-muted tabular-nums">
              {s.count} · {s.percent.toLocaleString("de-DE", { maximumFractionDigits: 0 })} %
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
