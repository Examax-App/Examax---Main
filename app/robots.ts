import type { MetadataRoute } from "next";

/** /robots.txt — everything public is open to crawlers; the dev-only gallery is not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/components"] }],
    sitemap: "https://examax.app/sitemap.xml",
    host: "https://examax.app",
  };
}
