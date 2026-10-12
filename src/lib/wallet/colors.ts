import { cardColors } from "@/lib/card-colors";

function toRgbString(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

// Fond = couleur principale du commerçant (jaune KeepMe si absente), textes =
// couleur secondaire, avec repli sur noir ou blanc si elle serait illisible.
export function passColors(
  primaryColor: string | null | undefined,
  secondaryColor: string | null | undefined,
) {
  const { background, text } = cardColors(primaryColor, secondaryColor);
  return {
    backgroundColor: toRgbString(background),
    foregroundColor: toRgbString(text),
    labelColor: toRgbString(text),
  };
}

// Même règle pour Google Wallet, au format « #rrggbb » (fond uniquement : Google
// choisit lui-même la couleur du texte).
export function hexBackground(primaryColor: string | null | undefined): string {
  return cardColors(primaryColor, null).background;
}
