import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
