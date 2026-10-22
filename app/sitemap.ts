import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.SITE_URL) return [];
  return [{ url: env.SITE_URL, changeFrequency: "weekly", priority: 1 }];
}
