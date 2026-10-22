import Image from "next/image";
import { GitHubIcon } from "@/components/icons";
import type { Profile } from "@/lib/github";
import { getProfileUrl, getUsername } from "@/lib/github";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/format";

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-xl font-semibold tabular-nums">
        {typeof value === "number" ? value.toLocaleString("de-DE") : value}
      </dd>
    </div>
  );
}

export function ProfileHero({
  profile,
  repoCount,
  totalContributions,
  lastActive,
}: {
  profile: Profile | null;
  repoCount: number;
  totalContributions: number | null;
  lastActive: string | null;
}) {
  const username = getUsername();

  return (
    <header className="relative mb-12 overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        {profile && (
          <Image
            src={profile.avatar_url}
            alt={`Avatar von ${username}`}
            width={96}
            height={96}
            priority
            className="h-24 w-24 rounded-full border border-line-strong"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{env.SITE_TITLE}</h1>
          <p className="mt-2 text-muted">
            {profile?.bio ?? "Öffentliche Repositories und Beiträge von"}{" "}
            <a
              href={getProfileUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-fg underline-offset-4 hover:underline"
            >
              <GitHubIcon />@{username}
            </a>
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            <Stat value={repoCount} label="Projekte" />
            {profile && <Stat value={profile.followers} label="Follower" />}
            {profile && <Stat value={new Date(profile.created_at).getUTCFullYear()} label="Auf GitHub seit" />}
            {lastActive && <Stat value={formatDate(lastActive)} label="Zuletzt aktiv" />}
            {totalContributions !== null && (
              <Stat value={totalContributions} label="Beiträge (12 Monate)" />
            )}
          </dl>
        </div>
      </div>
    </header>
  );
}
