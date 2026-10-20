import "server-only";
import { getProfile } from "@/lib/github";

const DAY_SECONDS = 86400;

/** Profile avatar as data URI (for ImageResponse), or null if unavailable. */
export async function getAvatarDataUri(size: number): Promise<string | null> {
  try {
    const profile = await getProfile();
    if (!profile) return null;

    const url = new URL(profile.avatar_url);
    url.searchParams.set("s", String(size));

    const res = await fetch(url, { next: { revalidate: DAY_SECONDS } });
    if (!res.ok) return null;

    const type = res.headers.get("content-type") ?? "image/png";
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch (error) {
    console.error("[avatar] unavailable:", error);
    return null;
  }
}
