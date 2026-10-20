"use client";

import Image from "next/image";
import { useState } from "react";
import type { Org, RepoContribution } from "@/lib/github";

const COLLAPSED_COUNT = 4;

export function OrgContributions({
  orgs,
  repos,
}: {
  orgs: Org[];
  repos: RepoContribution[];
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? repos : repos.slice(0, COLLAPSED_COUNT);

  return (
    <div className="space-y-6">
      {orgs.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {orgs.map((org) => (
            <li key={org.login}>
              <a
                href={`https://github.com/${org.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-line-strong"
              >
                <Image
                  src={org.avatar_url}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
                <span className="font-medium">{org.login}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {repos.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {shown.map((repo) => (
            <li key={repo.nameWithOwner}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
              >
                <Image
                  src={repo.ownerAvatar}
                  alt=""
                  width={32}
                  height={32}
                  className="mt-0.5 h-8 w-8 shrink-0 rounded-md"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{repo.nameWithOwner}</p>
                  {repo.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{repo.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {repo.commits > 0 && `${repo.commits} Commits`}
                    {repo.commits > 0 && repo.pullRequests > 0 && " · "}
                    {repo.pullRequests > 0 && `${repo.pullRequests} Pull Requests`}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {repos.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="rounded-lg border border-line px-4 py-2 text-sm transition-colors hover:border-line-strong"
        >
          {expanded ? "Weniger anzeigen" : `Alle ${repos.length} anzeigen`}
        </button>
      )}
    </div>
  );
}
