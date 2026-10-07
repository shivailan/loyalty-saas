import "server-only";
import sharp from "sharp";

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="87" height="87" viewBox="0 0 87 87">
  <rect width="87" height="87" rx="20" fill="#FACC15"/>
  <text x="43.5" y="62" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="56" font-weight="700" fill="#171717">K</text>
</svg>`;

// Apple exige icon.png (obligatoire) en 29, 58 et 87 px de côté.
export async function buildIcons(): Promise<Record<string, Buffer>> {
  const base = Buffer.from(ICON_SVG);
  const render = (size: number) =>
    sharp(base).resize(size, size).png().toBuffer();
  const [x1, x2, x3] = await Promise.all([render(29), render(58), render(87)]);
  return { "icon.png": x1, "icon@2x.png": x2, "icon@3x.png": x3 };
}

// Logo du commerçant converti en PNG (le format d'origine peut être JPEG, SVG,
// WebP…). Si le téléchargement échoue, la carte est simplement créée sans logo.
export async function buildLogo(
  logoUrl: string | null | undefined,
): Promise<Record<string, Buffer>> {
  if (!logoUrl) return {};
  try {
    const response = await fetch(logoUrl, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return {};
    const source = Buffer.from(await response.arrayBuffer());
    const render = (width: number, height: number) =>
      sharp(source)
        .resize(width, height, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    const [x1, x2, x3] = await Promise.all([
      render(160, 50),
      render(320, 100),
      render(480, 150),
    ]);
    return { "logo.png": x1, "logo@2x.png": x2, "logo@3x.png": x3 };
  } catch (error) {
    console.error("Wallet logo skipped:", error);
    return {};
  }
}

// Logo carré en PNG pour Google Wallet (qui n'accepte pas le SVG). Si le
// commerçant n'a pas de logo, ou s'il est illisible, on utilise l'icône KeepMe.
export async function buildSquareLogo(
  logoUrl: string | null | undefined,
): Promise<Buffer> {
  if (logoUrl) {
    try {
      const response = await fetch(logoUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        return await sharp(Buffer.from(await response.arrayBuffer()))
          .resize(660, 660, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .png()
          .toBuffer();
      }
    } catch (error) {
      console.error("Google Wallet logo fallback:", error);
    }
  }
  return sharp(Buffer.from(ICON_SVG)).resize(660, 660).png().toBuffer();
}
