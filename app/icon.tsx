import { ImageResponse } from "next/og";
import { getAvatarDataUri } from "@/lib/avatar";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const avatar = await getAvatarDataUri(size.width * 2);

  return new ImageResponse(
    avatar ? (
      <img
        src={avatar}
        alt=""
        width={size.width}
        height={size.height}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5eead4, #0a0a0a)",
        }}
      />
    ),
    { ...size },
  );
}
