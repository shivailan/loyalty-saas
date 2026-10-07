const DEFAULT_BACKGROUND = "#FACC15";

function parseHex(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toRgbString([r, g, b]: [number, number, number]): string {
  return `rgb(${r}, ${g}, ${b})`;
}

// Fond = couleur du commerçant (jaune KeepMe si absente ou noire par défaut),
// texte noir ou blanc selon la luminosité pour rester lisible.
export function passColors(primaryColor: string | null | undefined) {
  const background =
    primaryColor && primaryColor !== "#000000" && parseHex(primaryColor)
      ? parseHex(primaryColor)!
      : parseHex(DEFAULT_BACKGROUND)!;
  const [r, g, b] = background;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const dark: [number, number, number] = [23, 23, 23];
  const light: [number, number, number] = [255, 255, 255];
  const foreground = luminance > 0.6 ? dark : light;
  return {
    backgroundColor: toRgbString(background),
    foregroundColor: toRgbString(foreground),
    labelColor: toRgbString(foreground),
  };
}

// Même règle que pour Apple, mais au format « #rrggbb » attendu par Google.
export function hexBackground(primaryColor: string | null | undefined): string {
  return primaryColor &&
    primaryColor !== "#000000" &&
    /^#[0-9a-f]{6}$/i.test(primaryColor.trim())
    ? primaryColor.trim()
    : DEFAULT_BACKGROUND;
}
