import type { MetadataRoute } from "next";
import { SERVICES_EXTENDED } from "@/lib/services-data";

const BASE_URL = "https://ehpad-crecy.netlify.app";

export const dynamic = "force-static";

const PUBLIC_ROUTES = [
  "",
  "/admissions",
  "/animation",
  "/blog",
  "/contact",
  "/echo-du-coeur",
  "/equipe",
  "/familles",
  "/galerie",
  "/hebergement",
  "/histoire",
  "/mentions-legales",
  "/politique-confidentialite",
  "/accessibilite",
  "/recrutement",
  "/visite",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date("2026-08-16T00:00:00+02:00");
  const routes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: updatedAt,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/admissions" || route === "/contact" ? 0.9 : 0.7,
  }));

  const services: MetadataRoute.Sitemap = SERVICES_EXTENDED.map((service) => ({
    url: `${BASE_URL}/equipe/${service.id}`,
    lastModified: updatedAt,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...routes, ...services];
}
