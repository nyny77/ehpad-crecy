import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/administration", "/admin-users"],
    },
    sitemap: "https://ehpad-crecy.netlify.app/sitemap.xml",
  };
}
