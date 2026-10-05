import { GitHubIcon } from "@/components/icons";
import { env } from "@/lib/env";
import { RepoCard } from "@/components/repo-card";
import { getProfileUrl, getRepos, getUsername } from "@/lib/github";

export default async function Page() {
  const repos = await getRepos();

  return (
    <main className="flex-1 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Meine Projekte</h1>
          <p className="mt-2 text-muted">
            Zuletzt aktualisierte Repositories von{" "}
            <a
              href={getProfileUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fg underline-offset-4 hover:underline"
            >
              @{getUsername()}
            </a>
          </p>
        </header>

        {repos.length === 0 ? (
          <p className="text-muted">Keine öffentlichen Repositories gefunden.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        <aside className="mt-12 flex gap-3 rounded-xl border border-line p-4 text-sm text-muted">
          <span className="mt-0.5 shrink-0 text-fg">
            <GitHubIcon />
          </span>
          <div>
            <p className="font-medium text-fg">GitHub Integration</p>
            <p className="mt-1">
              This website uses the GitHub API to fetch and display public repositories from GitHub.
            </p>
            {env.SITE_SOURCE_URL && (
              <p className="mt-2">
                Source code:{" "}
                <a
                  href={env.SITE_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-medium text-fg underline-offset-4 hover:underline"
                >
                  {env.SITE_SOURCE_URL}
                </a>
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
