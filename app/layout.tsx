import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION = "Öffentliche GitHub-Repositories, Beiträge und Aktivität";

export const metadata: Metadata = {
  metadataBase: env.SITE_URL ? new URL(env.SITE_URL) : undefined,
  title: env.SITE_TITLE,
  description: DESCRIPTION,
  alternates: env.SITE_URL ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: env.SITE_TITLE,
    title: env.SITE_TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: env.SITE_TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-canvas"
        >
          Zum Inhalt springen
        </a>
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
