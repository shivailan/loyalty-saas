import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Pages publiques à faire connaître aux moteurs de recherche.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/commande-a-emporter`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/carte-de-fidelite`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/cgv`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cgu`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${SITE_URL}/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
