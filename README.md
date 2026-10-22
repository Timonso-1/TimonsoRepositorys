# Timonso Repositories

Portfolio page for a GitHub user: profile, searchable and paginated project list, organisations and
contributions, activity heatmap and recent public events. Built with Next.js (App Router), React and
Tailwind CSS; GitHub is queried server-side and cached.

## Setup

```bash
npm install
cp .env.example .env.local   # then set GITHUB_USERNAME
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable                    | Required | Default | Purpose                                              |
| --------------------------- | -------- | ------- | ---------------------------------------------------- |
| `GITHUB_USERNAME`           | yes      | –       | User whose repositories are shown                    |
| `GITHUB_TOKEN`              | no       | –       | Raises the rate limit to 5000 requests/h; required for the heatmap and organisation contributions (GraphQL) |
| `GITHUB_REPO_LIMIT`         | no       | `10`    | Number of repositories shown (1–100)                 |
| `GITHUB_REVALIDATE_SECONDS` | no       | `3600`  | Cache lifetime of the GitHub response                |
| `SITE_TITLE`                | no       | `Meine Projekte` | Title in header, browser tab and social preview |
| `SITE_URL`                  | no       | –       | Public URL for canonical link, sitemap and Open Graph |
| `SITE_COPYRIGHT_HOLDER`     | no       | –       | Name in the footer copyright; hidden when empty      |
| `SITE_SOURCE_URL`           | no       | –       | Source code link in footer and notice; hidden when empty |
| `SITE_CONTACT_EMAIL`        | no       | –       | Contact email in the footer; hidden when empty       |

Variables are validated at startup in `lib/env.ts`; an invalid configuration fails the build with a clear message.

## Structure

```
app/          page, layout, icon and Open Graph image, robots, sitemap, loading and error states
components/   hero, repo explorer and cards, pagination, heatmap, org contributions, activity feed
lib/          env validation, GitHub API client, avatar, language colors, about content
```
