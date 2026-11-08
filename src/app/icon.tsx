import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Icône de l'onglet du navigateur : le « K » de KeepMe sur carré jaune.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#facc15",
          color: "#171717",
          fontSize: 46,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        K
      </div>
    ),
    { ...size },
  );
}
