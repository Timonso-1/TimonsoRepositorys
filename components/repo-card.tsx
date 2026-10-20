import { ForkIcon, LinkIcon, RepoIcon, StarIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";
import type { Repo } from "@/lib/github";
import { getLanguageColor } from "@/lib/languages";

const MAX_TOPICS = 4;

export function RepoCard({ repo }: { repo: Repo }) {
  const topics = repo.topics?.slice(0, MAX_TOPICS) ?? [];

  return (
    <article className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong">
      <div className="flex items-center gap-2 text-muted">
        <RepoIcon />
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate font-semibold text-fg underline-offset-4 hover:underline"
        >
          {repo.name}
        </a>
        {repo.archived && (
          <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider">
            Archiviert
          </span>
        )}
        {repo.homepage && !repo.archived && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Webseite von ${repo.name}`}
            className="ml-auto shrink-0 transition-colors hover:text-fg"
          >
            <LinkIcon />
          </a>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {repo.description ?? "Keine Beschreibung vorhanden."}
      </p>

      {topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <li
              key={topic}
              className="rounded-full bg-line px-2 py-0.5 text-[11px] text-muted"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1" aria-label={`${repo.stargazers_count} Stars`}>
          <StarIcon />
          {repo.stargazers_count.toLocaleString("de-DE")}
        </span>
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1" aria-label={`${repo.forks_count} Forks`}>
            <ForkIcon />
            {repo.forks_count.toLocaleString("de-DE")}
          </span>
        )}
        <span className="ml-auto">Aktualisiert {formatDate(repo.pushed_at)}</span>
      </div>
    </article>
  );
}

export function RepoCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col rounded-xl border border-line bg-surface p-5">
      <div className="h-4 w-1/2 rounded bg-line" />
      <div className="mt-4 h-3 w-full rounded bg-line" />
      <div className="mt-2 h-3 w-3/4 rounded bg-line" />
      <div className="mt-5 h-3 w-1/3 rounded bg-line" />
    </div>
  );
}
