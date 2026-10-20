"use client";

import { useMemo, useState } from "react";
import { RepoCard } from "@/components/repo-card";
import type { Repo } from "@/lib/github";
import { getLanguageColor } from "@/lib/languages";

type SortKey = "updated" | "stars" | "name";

const SORT_LABELS: Record<SortKey, string> = {
  updated: "Zuletzt aktualisiert",
  stars: "Meiste Sterne",
  name: "Name (A–Z)",
};

const chipBase = "rounded-full border px-3 py-1 text-xs transition-colors";

export function RepoExplorer({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("updated");

  const languages = useMemo(
    () => [...new Set(repos.map((r) => r.language).filter((l): l is string => !!l))].sort(),
    [repos],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = repos.filter((repo) => {
      if (language && repo.language !== language) return false;
      if (!needle) return true;
      return [repo.name, repo.description ?? "", ...(repo.topics ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "name") return a.name.localeCompare(b.name, "de");
      return b.pushed_at.localeCompare(a.pushed_at);
    });
  }, [repos, query, language, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Projekte durchsuchen"
          aria-label="Projekte durchsuchen"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-muted focus:border-line-strong focus:outline-none sm:max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sortierung"
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-line-strong focus:outline-none sm:ml-auto"
        >
          {Object.entries(SORT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {languages.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Nach Sprache filtern">
          <button
            type="button"
            onClick={() => setLanguage(null)}
            aria-pressed={language === null}
            className={`${chipBase} ${
              language === null ? "border-fg bg-fg text-canvas" : "border-line text-muted hover:text-fg"
            }`}
          >
            Alle
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(language === lang ? null : lang)}
              aria-pressed={language === lang}
              className={`${chipBase} flex items-center gap-1.5 ${
                language === lang
                  ? "border-fg bg-fg text-canvas"
                  : "border-line text-muted hover:text-fg"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getLanguageColor(lang) }}
              />
              {lang}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-muted">Keine Projekte für diese Auswahl gefunden.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
