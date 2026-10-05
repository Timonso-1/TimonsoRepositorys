import { CodeIcon, GitHubIcon, MailIcon } from "@/components/icons";
import { env } from "@/lib/env";
import { getProfileUrl, getUsername } from "@/lib/github";

const linkClassName = "group flex items-center gap-2 transition-colors hover:text-fg";
const labelClassName = "underline-offset-4 group-hover:underline";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-8">
        {env.SITE_COPYRIGHT_HOLDER && (
          <p>
            © {year} {env.SITE_COPYRIGHT_HOLDER}
          </p>
        )}
        <div className="flex flex-col items-center gap-4 sm:ml-auto sm:flex-row sm:gap-6">
          {env.SITE_SOURCE_URL && (
            <a
              href={env.SITE_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              <CodeIcon />
              <span className={labelClassName}>Quellcode</span>
            </a>
          )}
          {env.SITE_CONTACT_EMAIL && (
            <a href={`mailto:${env.SITE_CONTACT_EMAIL}`} className={linkClassName}>
              <MailIcon />
              <span className={labelClassName}>{env.SITE_CONTACT_EMAIL}</span>
            </a>
          )}
          <a
            href={getProfileUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <GitHubIcon />
            <span className={labelClassName}>@{getUsername()}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
