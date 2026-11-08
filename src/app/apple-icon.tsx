import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icône affichée quand le site est ajouté à l'écran d'accueil d'un iPhone
// (Apple arrondit lui-même les angles).
export default function AppleIcon() {
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
          fontSize: 130,
          fontWeight: 700,
        }}
      >
        K
      </div>
    ),
    { ...size },
  );
}
