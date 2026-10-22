import { AboutSection } from "@/components/about-section";
import { ActivityFeed } from "@/components/activity-feed";
import { ContributionHeatmap } from "@/components/contribution-heatmap";
import { GitHubIcon } from "@/components/icons";
import { LanguageBar } from "@/components/language-bar";
import { OrgContributions } from "@/components/org-contributions";
import { ProfileHero } from "@/components/profile-hero";
import { SectionNav, type NavItem } from "@/components/section-nav";
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

  const hasOrgs = (orgs && orgs.length > 0) || orgRepos.length > 0;
  const hasHeatmap = !!contributions && contributions.days.length > 0;
  const hasActivity = !!activity && activity.length > 0;

  const navItems: NavItem[] = [
    { id: "about", label: "Über mich" },
    { id: "languages", label: "Sprachen" },
    { id: "projects", label: "Projekte" },
    ...(hasOrgs ? [{ id: "orgs", label: "Organisationen" }] : []),
    ...(hasHeatmap ? [{ id: "heatmap", label: "Aktivität" }] : []),
    ...(hasActivity ? [{ id: "events", label: "Letzte Aktivitäten" }] : []),
  ];

  return (
    <main id="main" className="flex-1 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHero
          profile={profile}
          repoCount={repos.length}
          totalContributions={contributions?.total ?? null}
          lastActive={repos.map((r) => r.pushed_at).sort().at(-1) ?? null}
        />

        <SectionNav items={navItems} />

        <Section id="about" title="Über mich">
          <AboutSection />
        </Section>

        <Section id="languages" title="Sprachen" hint="Hauptsprache pro Repository">
          <LanguageBar repos={repos} />
        </Section>

        <Section id="projects" title="Projekte">
          {repos.length === 0 ? (
            <p className="text-muted">Keine öffentlichen Repositories gefunden.</p>
          ) : (
            <RepoExplorer repos={repos} />
          )}
        </Section>

        {hasOrgs && (
          <Section
            id="orgs"
            title="Organisationen und Beiträge"
            hint={orgRepos.length > 0 ? "Beiträge der letzten 12 Monate, nur öffentliche Repositories" : undefined}
          >
            <OrgContributions orgs={orgs ?? []} repos={orgRepos} />
          </Section>
        )}

        {hasHeatmap && (
          <Section id="heatmap" title="Aktivität">
            <ContributionHeatmap days={contributions.days} total={contributions.total} />
          </Section>
        )}

        {hasActivity && (
          <Section id="events" title="Letzte Aktivitäten" hint="Öffentliche GitHub-Events">
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
