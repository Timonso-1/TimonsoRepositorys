import { AboutSection } from "@/components/about-section";
import { ActivityFeed } from "@/components/activity-feed";
import { ContributionHeatmap } from "@/components/contribution-heatmap";
import { GitHubIcon } from "@/components/icons";
import { LanguageBar } from "@/components/language-bar";
import { OrgContributions } from "@/components/org-contributions";
import { ProfileHero } from "@/components/profile-hero";
import { RepoExplorer } from "@/components/repo-explorer";
import { Section } from "@/components/section";
import { env } from "@/lib/env";
import {
  getActivity,
  getContributions,
  getOrgs,
  getProfile,
  getRepos,
  getUsername,
} from "@/lib/github";

export default async function Page() {
  const [repos, profile, orgs, contributions, activity] = await Promise.all([
    getRepos(),
    getProfile(),
    getOrgs(),
    getContributions(),
    getActivity(),
  ]);

  const orgRepos = (contributions?.repos ?? []).filter((r) => r.ownerLogin !== getUsername());

  return (
    <main id="main" className="flex-1 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHero
          profile={profile}
          repoCount={repos.length}
          totalContributions={contributions?.total ?? null}
          lastActive={repos.map((r) => r.pushed_at).sort().at(-1) ?? null}
        />

        <Section title="Über mich">
          <AboutSection />
        </Section>

        <Section title="Sprachen" hint="Hauptsprache pro Repository">
          <LanguageBar repos={repos} />
        </Section>

        <Section title="Projekte">
          {repos.length === 0 ? (
            <p className="text-muted">Keine öffentlichen Repositories gefunden.</p>
          ) : (
            <RepoExplorer repos={repos} />
          )}
        </Section>

        {((orgs && orgs.length > 0) || orgRepos.length > 0) && (
          <Section
            title="Organisationen und Beiträge"
            hint={orgRepos.length > 0 ? "Beiträge der letzten 12 Monate, nur öffentliche Repositories" : undefined}
          >
            <OrgContributions orgs={orgs ?? []} repos={orgRepos} />
          </Section>
        )}

        {contributions && contributions.days.length > 0 && (
          <Section title="Aktivität">
            <ContributionHeatmap days={contributions.days} total={contributions.total} />
          </Section>
        )}

        {activity && activity.length > 0 && (
          <Section title="Letzte Aktivitäten" hint="Öffentliche GitHub-Events">
            <ActivityFeed items={activity} />
          </Section>
        )}

        <aside className="mt-12 flex gap-3 rounded-xl border border-line p-4 text-sm text-muted">
          <span className="mt-0.5 shrink-0 text-fg">
            <GitHubIcon />
          </span>
          <div>
            <p className="font-medium text-fg">GitHub-Integration</p>
            <p className="mt-1">
              Diese Seite lädt öffentliche Daten serverseitig über die GitHub-API und speichert sie
              kurzzeitig im Cache. Es werden keine Nutzerdaten gespeichert.
            </p>
            {env.SITE_SOURCE_URL && (
              <p className="mt-2">
                Quellcode:{" "}
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
