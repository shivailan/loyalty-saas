import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Les pages publiques du site sont ouvertes aux moteurs de recherche ; les
// espaces privés (commerçant, administrateur, cartes clients, paiement) et les
// écrans de gestion des pages de commande ne le sont pas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/admin",
        "/subscribe",
        "/api/",
        "/auth/",
        "/card/",
        "/join/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/r/*/admin",
        "/r/*/cuisine",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
