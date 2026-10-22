import { ImageResponse } from "next/og";
import { getAvatarDataUri } from "@/lib/avatar";
import { env } from "@/lib/env";
import { getUsername } from "@/lib/github";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio-Vorschau";

export default async function OpengraphImage() {
  const avatar = await getAvatarDataUri(320);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: 80,
          background: "#000000",
          color: "#fafafa",
          borderTop: "8px solid #5eead4",
        }}
      >
        {avatar && (
          <img
            src={avatar}
            alt=""
            width={240}
            height={240}
            style={{ borderRadius: "50%", border: "2px solid #525252" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{env.SITE_TITLE}</div>
          <div style={{ marginTop: 16, fontSize: 34, color: "#a3a3a3" }}>
            GitHub-Projekte von @{getUsername()}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
