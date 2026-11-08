import { ImageResponse } from "next/og";

export const alt =
  "KeepMe : gagnez du temps en cuisine avec KeepMe Order, fidélisez vos clients avec KeepMe Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image affichée quand le lien du site est partagé (messages, réseaux sociaux).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171717",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#facc15",
              color: "#171717",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            K
          </div>
          <div style={{ marginLeft: 20, fontSize: 40, fontWeight: 600 }}>
            KeepMe
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Gagnez du temps en cuisine.
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#facc15",
            }}
          >
            Fidélisez vos clients.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#d4d4d4" }}>
          <div style={{ display: "flex", color: "#facc15", marginRight: 12 }}>
            KeepMe Order
          </div>
          <div style={{ display: "flex", marginRight: 12 }}>·</div>
          <div style={{ display: "flex", color: "#facc15" }}>KeepMe Card</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
