import { RepoIcon, StarIcon } from "@/components/icons";
import type { Repo } from "@/lib/github";

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <article className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong">
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
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {repo.description ?? "Keine Beschreibung vorhanden."}
      </p>

      <div className="mt-4 flex items-center gap-5 text-xs text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-fg" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1" aria-label={`${repo.stargazers_count} Stars`}>
          <StarIcon />
          {repo.stargazers_count.toLocaleString("de-DE")}
        </span>
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
