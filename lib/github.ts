import "server-only";
import { env } from "@/lib/env";

const GITHUB_API_URL = "https://api.github.com";
const FETCH_PAGE_SIZE = 100;
const CACHE_TAG = "github-data";

export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  topics?: string[];
  pushed_at: string;
  license: { spdx_id: string | null } | null;
};

export type Profile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

export type Org = {
  login: string;
  avatar_url: string;
  description: string | null;
};

export type ContributionDay = { date: string; count: number };

export type RepoContribution = {
  nameWithOwner: string;
  url: string;
  description: string | null;
  ownerLogin: string;
  ownerAvatar: string;
  commits: number;
  pullRequests: number;
};

export type Contributions = {
  total: number;
  days: ContributionDay[];
  repos: RepoContribution[];
};

export type ActivityItem = {
  id: string;
  type: string;
  repo: string;
  repoUrl: string;
  createdAt: string;
  text: string;
};

function restHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return headers;
}

async function rest<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(path, GITHUB_API_URL);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, {
    headers: restHeaders(),
    next: { revalidate: env.GITHUB_REVALIDATE_SECONDS, tags: [CACHE_TAG] },
  });
  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${path} ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Optional data must never break the page: log and return null. */
async function optional<T>(label: string, task: () => Promise<T>): Promise<T | null> {
  try {
    return await task();
  } catch (error) {
    console.error(`[github] ${label} unavailable:`, error);
    return null;
  }
}

const user = () => encodeURIComponent(env.GITHUB_USERNAME);

export async function getRepos(): Promise<Repo[]> {
  const repos = await rest<Repo[]>(`/users/${user()}/repos`, {
    sort: "updated",
    per_page: String(FETCH_PAGE_SIZE),
  });
  return repos.filter((repo) => !repo.fork).slice(0, env.GITHUB_REPO_LIMIT);
}

export function getProfile(): Promise<Profile | null> {
  return optional("profile", () => rest<Profile>(`/users/${user()}`));
}

export function getOrgs(): Promise<Org[] | null> {
  return optional("orgs", () => rest<Org[]>(`/users/${user()}/orgs`));
}

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref_type?: string;
    size?: number;
    pull_request?: { merged?: boolean };
  };
};

function describeEvent(event: RawEvent): string | null {
  const { payload } = event;
  switch (event.type) {
    case "PushEvent":
      return payload.size
        ? `${payload.size} ${payload.size === 1 ? "Commit" : "Commits"} gepusht`
        : "Änderungen gepusht";
    case "PullRequestEvent":
      if (payload.action === "closed" && payload.pull_request?.merged) {
        return "Pull Request gemergt";
      }
      return payload.action === "opened" ? "Pull Request geöffnet" : null;
    case "IssuesEvent":
      return payload.action === "opened" ? "Issue erstellt" : null;
    case "CreateEvent":
      return payload.ref_type === "repository" ? "Repository erstellt" : null;
    case "ReleaseEvent":
      return "Release veröffentlicht";
    case "WatchEvent":
      return "Repository mit Stern markiert";
    default:
      return null;
  }
}

export function getActivity(): Promise<ActivityItem[] | null> {
  return optional("activity", async () => {
    const events = await rest<RawEvent[]>(`/users/${user()}/events/public`, { per_page: "50" });
    const items: ActivityItem[] = [];
    for (const event of events) {
      const text = describeEvent(event);
      if (!text) continue;
      items.push({
        id: event.id,
        type: event.type,
        repo: event.repo.name,
        repoUrl: `https://github.com/${event.repo.name}`,
        createdAt: event.created_at,
        text,
      });
    }
    return items.slice(0, 8);
  });
}

type ContributionsResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
        commitContributionsByRepository: RepoNode<{ totalCount: number }>[];
        pullRequestContributionsByRepository: RepoNode<{ totalCount: number }>[];
      };
    } | null;
  };
  errors?: { message: string }[];
};

type RepoNode<C> = {
  repository: {
    nameWithOwner: string;
    url: string;
    description: string | null;
    isPrivate: boolean;
    owner: { login: string; avatarUrl: string };
  };
  contributions: C;
};

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            url
            description
            isPrivate
            owner {
              login
              avatarUrl
            }
          }
          contributions {
            totalCount
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            url
            description
            isPrivate
            owner {
              login
              avatarUrl
            }
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

/**
 * Needs GITHUB_TOKEN: the GraphQL API does not allow anonymous access.
 * Private repositories are never exposed (filtered by isPrivate).
 */
export function getContributions(): Promise<Contributions | null> {
  if (!env.GITHUB_TOKEN) return Promise.resolve(null);

  return optional("contributions", async () => {
    const res = await fetch(`${GITHUB_API_URL}/graphql`, {
      method: "POST",
      headers: { ...restHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: env.GITHUB_USERNAME },
      }),
      next: { revalidate: env.GITHUB_REVALIDATE_SECONDS, tags: [CACHE_TAG] },
    });
    if (!res.ok) throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);

    const json = (await res.json()) as ContributionsResponse;
    const collection = json.data?.user?.contributionsCollection;
    if (!collection) throw new Error(json.errors?.[0]?.message ?? "empty GraphQL response");

    const byRepo = new Map<string, RepoContribution>();
    const upsert = (
      node: RepoNode<{ totalCount: number }>,
      field: "commits" | "pullRequests",
    ) => {
      const { repository } = node;
      if (repository.isPrivate) return;
      const entry = byRepo.get(repository.nameWithOwner) ?? {
        nameWithOwner: repository.nameWithOwner,
        url: repository.url,
        description: repository.description,
        ownerLogin: repository.owner.login,
        ownerAvatar: repository.owner.avatarUrl,
        commits: 0,
        pullRequests: 0,
      };
      entry[field] += node.contributions.totalCount;
      byRepo.set(repository.nameWithOwner, entry);
    };
    collection.commitContributionsByRepository.forEach((n) => upsert(n, "commits"));
    collection.pullRequestContributionsByRepository.forEach((n) => upsert(n, "pullRequests"));

    const calendar = collection.contributionCalendar;
    return {
      total: calendar.totalContributions,
      days: calendar.weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
      ),
      repos: [...byRepo.values()].sort(
        (a, b) => b.commits + b.pullRequests - (a.commits + a.pullRequests),
      ),
    };
  });
}

export function getProfileUrl(): string {
  return `https://github.com/${env.GITHUB_USERNAME}`;
}

export function getUsername(): string {
  return env.GITHUB_USERNAME;
}
