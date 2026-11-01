import path from "path";
import type { NextConfig } from "next";

// Site unique : les pages de commande (application « Qtime », déployée à part)
// sont servies sous www. KeepMe les relaie en coulisses vers l'adresse interne
// de l'application, qui range ses fichiers sous /qtime-static pour ne pas se
// mélanger aux siens (voir « multi-zones » dans la documentation de Next.js).
const COMMANDE_BACKEND = (
  process.env.COMMANDE_BACKEND_URL ?? "https://commande.keepmecard.fr"
).replace(/\/$/, "");

const commandePaths = [
  "/r/:path*",
  "/inscription",
  "/conditions",
  "/api/r/:path*",
  "/api/orders/:path*",
  "/api/ticket/:path*",
  "/api/staff/:path*",
  "/api/print/:path*",
  "/api/siret",
  "/api/inscription",
  "/qtime-static/:path+",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return commandePaths.map((source) => ({
      source,
      destination: `${COMMANDE_BACKEND}${source}`,
    }));
  },
  turbopack: {
    root: path.join(__dirname),
  },
  // sharp charge libvips (fichier .so) dynamiquement : le traceur de Next ne
  // le voit pas et l'omet du déploiement Vercel. On l'ajoute à la main pour
  // la seule route qui génère les cartes Wallet.
  outputFileTracingIncludes: {
    "/api/wallet/apple/*": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
};

export default nextConfig;
