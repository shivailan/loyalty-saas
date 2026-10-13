import "server-only";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";
import { cardColors } from "@/lib/card-colors";

export type PosterData = {
  merchantName: string;
  joinUrl: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  visitsRequired: number | null;
  rewardDescription: string | null;
};

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const INK = "#171717";
const GREY = "#6B7280";

function color(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// Les polices standard d'un PDF ne contiennent que l'alphabet latin : tout
// autre caractère (emoji, lettres non latines) ferait échouer la génération.
function sanitize(text: string): string {
  const allowed = "’‘“”–—…œŒ€•";
  return [...text.normalize("NFC")]
    .filter((char) => {
      const code = char.codePointAt(0)!;
      return (
        (code >= 32 && code <= 126) ||
        (code >= 160 && code <= 255) ||
        allowed.includes(char)
      );
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  centerX: number,
  y: number,
  hex: string,
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: centerX - width / 2,
    y,
    size,
    font,
    color: color(hex),
  });
}

function roundedRect(
  page: PDFPage,
  x: number,
  top: number,
  w: number,
  h: number,
  r: number,
  hex: string,
) {
  // Le chemin SVG a son origine en haut à gauche, axe Y vers le bas.
  const path = `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  page.drawSvgPath(path, { x, y: top, color: color(hex) });
}

async function loadLogo(url: string | null): Promise<Buffer | null> {
  if (!url) return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    return await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(480, 480, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();
  } catch {
    return null;
  }
}

// Affiche A4 à imprimer : couleurs et logo du commerçant, grand QR code
// d'inscription, récompense et trois étapes.
export async function buildPoster(data: PosterData): Promise<Uint8Array> {
  const { background, text } = cardColors(
    data.primaryColor,
    data.secondaryColor,
  );
  const doc = await PDFDocument.create();
  doc.setTitle(`Affiche fidélité ${sanitize(data.merchantName)}`);
  doc.setCreator("KeepMe");
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const cx = PAGE_W / 2;
  const top = (y: number) => PAGE_H - y; // coordonnées « depuis le haut »

  // 1. Bandeau de couleur : logo + nom du commerce
  const headerH = 215;
  page.drawRectangle({
    x: 0,
    y: PAGE_H - headerH,
    width: PAGE_W,
    height: headerH,
    color: color(background),
  });

  const logo = await loadLogo(data.logoUrl);
  let nameBaseline = top(headerH / 2 + 12);
  if (logo) {
    const tile = 96;
    roundedRect(page, cx - tile / 2, top(30), tile, tile, 20, "#FFFFFF");
    const image = await doc.embedPng(logo);
    const inner = tile - 16;
    page.drawImage(image, {
      x: cx - inner / 2,
      y: top(30) - tile + 8,
      width: inner,
      height: inner,
    });
    nameBaseline = top(160);
  }
  const name = sanitize(data.merchantName) || "Notre commerce";
  let nameSize = logo ? 36 : 48;
  while (nameSize > 18 && bold.widthOfTextAtSize(name, nameSize) > PAGE_W - 90)
    nameSize -= 2;
  const nameLines = wrapLines(name, bold, nameSize, PAGE_W - 90).slice(0, 2);
  nameLines.forEach((line, i) =>
    drawCentered(
      page,
      line,
      bold,
      nameSize,
      cx,
      nameBaseline - i * (nameSize + 4),
      text,
    ),
  );

  // 2. Titre
  drawCentered(
    page,
    "Rejoignez notre carte de fidélité",
    bold,
    27,
    cx,
    top(262),
    INK,
  );
  drawCentered(
    page,
    "Scannez le QR code avec l’appareil photo de votre téléphone.",
    regular,
    13,
    cx,
    top(285),
    GREY,
  );

  // 3. QR code dans un cadre de la couleur du commerce
  const qr = QRCode.create(data.joinUrl, { errorCorrectionLevel: "Q" });
  const modules = qr.modules.size;
  const quiet = 2; // marge blanche obligatoire autour du QR, en modules
  const qrSize = 262;
  const cell = qrSize / (modules + quiet * 2);
  const inner = qrSize;
  const framePad = 14;
  const frame = inner + framePad * 2;
  const frameTop = top(305);
  roundedRect(
    page,
    cx - frame / 2 - 8,
    frameTop,
    frame + 16,
    frame + 16,
    26,
    background,
  );
  roundedRect(page, cx - frame / 2, frameTop - 8, frame, frame, 18, "#FFFFFF");
  const qrLeft = cx - inner / 2;
  const qrTop = frameTop - 8 - framePad;
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.modules.data[row * modules + col]) continue;
      page.drawRectangle({
        x: qrLeft + (col + quiet) * cell - 0.15,
        y: qrTop - (row + quiet + 1) * cell - 0.15,
        width: cell + 0.3,
        height: cell + 0.3,
        color: color("#000000"),
      });
    }
  }

  // 4. Récompense : sur une ou deux lignes selon sa longueur
  const reward = sanitize(data.rewardDescription ?? "");
  if (data.visitsRequired && reward) {
    const label = `${data.visitsRequired} passages = ${reward}`;
    const maxWidth = PAGE_W - 150;
    let size = 20;
    let lines = wrapLines(label, bold, size, maxWidth);
    while (lines.length > 2 && size > 13) {
      size -= 1;
      lines = wrapLines(label, bold, size, maxWidth);
    }
    if (lines.length > 2) {
      // Texte vraiment trop long : on garde deux lignes et on coupe à un mot entier.
      let kept = lines.slice(0, 2);
      const last = kept[1].replace(/\s+\S*$/, "");
      kept = [kept[0], `${last || kept[1]}…`];
      lines = kept;
    }
    const lineHeight = size * 1.3;
    const pillH = 24 + lines.length * lineHeight;
    const widest = Math.max(
      ...lines.map((line) => bold.widthOfTextAtSize(line, size)),
    );
    const width = Math.min(widest + 56, PAGE_W - 80);
    const pillTop = top(638);
    roundedRect(
      page,
      cx - width / 2,
      pillTop,
      width,
      pillH,
      Math.min(22, pillH / 2),
      background,
    );
    lines.forEach((line, i) =>
      drawCentered(
        page,
        line,
        bold,
        size,
        cx,
        pillTop - 12 - size * 0.95 - i * lineHeight,
        text,
      ),
    );
  }

  // 5. Trois étapes
  const steps = [
    "Scannez le QR code",
    "Créez votre carte en 20 secondes",
    "Présentez-la à chaque passage",
  ];
  const colW = (PAGE_W - 100) / 3;
  steps.forEach((step, i) => {
    const colCx = 50 + colW * i + colW / 2;
    const circleY = top(746);
    page.drawCircle({
      x: colCx,
      y: circleY,
      size: 14,
      color: color(background),
    });
    drawCentered(page, String(i + 1), bold, 15, colCx, circleY - 5, text);
    wrapLines(step, regular, 11, colW - 18).forEach((line, j) =>
      drawCentered(page, line, regular, 11, colCx, circleY - 32 - j * 14, INK),
    );
  });

  // 6. Pied de page : adresse de secours et signature
  const shortUrl = data.joinUrl.replace(/^https?:\/\//, "");
  drawCentered(
    page,
    `Ou rendez-vous sur ${shortUrl}`,
    regular,
    9.5,
    cx,
    top(800),
    GREY,
  );
  drawCentered(
    page,
    "Carte de fidélité digitale · KeepMe",
    regular,
    9,
    cx,
    top(818),
    "#9CA3AF",
  );

  return doc.save();
}
