// Couleurs de la carte de fidélité : la couleur principale est le fond, la
// couleur secondaire sert aux textes et aux accents. Utilisé par la page de la
// carte, l'aperçu du commerçant et les cartes Apple Wallet / Google Wallet, pour
// que les trois affichent exactement la même chose.

export const DEFAULT_PRIMARY = "#FACC15";
export const DEFAULT_SECONDARY = "#171717";

const HEX = /^#[0-9a-f]{6}$/i;

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// « #000000 » est l'ancienne valeur par défaut : elle signifie « pas choisi ».
export function resolvePrimary(color: string | null | undefined): string {
  return color && HEX.test(color) && color !== "#000000"
    ? color
    : DEFAULT_PRIMARY;
}

// La couleur de texte choisie par le commerçant, sauf si elle est illisible sur
// son fond : on retombe alors sur du noir ou du blanc, selon le fond.
export function resolveSecondary(
  primary: string,
  secondary: string | null | undefined,
): string {
  const wanted = secondary && HEX.test(secondary) ? secondary : DEFAULT_SECONDARY;
  if (contrastRatio(primary, wanted) >= 3) return wanted;
  return luminance(primary) > 0.4 ? "#171717" : "#FFFFFF";
}

export function cardColors(
  primary: string | null | undefined,
  secondary: string | null | undefined,
) {
  const background = resolvePrimary(primary);
  return { background, text: resolveSecondary(background, secondary) };
}
