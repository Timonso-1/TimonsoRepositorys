import "server-only";
import { env } from "@/lib/env";

export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

const GITHUB_API_URL = "https://api.github.com";

const FETCH_PAGE_SIZE = 100;

export async function getRepos(): Promise<Repo[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const url = new URL(`/users/${encodeURIComponent(env.GITHUB_USERNAME)}/repos`, GITHUB_API_URL);
  url.searchParams.set("sort", "updated");
  url.searchParams.set("per_page", String(FETCH_PAGE_SIZE));

  const res = await fetch(url, {
    headers,
    next: { revalidate: env.GITHUB_REVALIDATE_SECONDS, tags: ["github-repos"] },
  });

  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${res.status} ${res.statusText}`);
  }

  const repos: Repo[] = await res.json();
  return repos.filter((repo) => !repo.fork).slice(0, env.GITHUB_REPO_LIMIT);
}

export function getProfileUrl(): string {
  return `https://github.com/${env.GITHUB_USERNAME}`;
}

export function getUsername(): string {
  return env.GITHUB_USERNAME;
}
