import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/live";
import { UPDATES_QUERY } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/seo";

/** Every public page, most important first. */
const PAGES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/training", priority: 0.9 },
  { path: "/roadmap", priority: 0.9 },
  { path: "/progress", priority: 0.9 },
  { path: "/simulation", priority: 0.9 },
  { path: "/agents", priority: 0.9 },
  { path: "/pricing", priority: 0.8 },
  { path: "/math", priority: 0.8 },
  { path: "/polish", priority: 0.8 },
  { path: "/english", priority: 0.8 },
  { path: "/enterprise", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/updates", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/contact/sales", priority: 0.4 },
  { path: "/contact/support", priority: 0.4 },
  { path: "/legal/privacy", priority: 0.3 },
  { path: "/legal/terms", priority: 0.3 },
  { path: "/legal/cookies", priority: 0.3 },
  { path: "/legal/gdpr", priority: 0.3 },
];

/** /sitemap.xml — the pages above, then every changelog post from Sanity. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await sanityFetch({ query: UPDATES_QUERY, perspective: "published", stega: false });
  return [
    ...PAGES.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" as const, priority })),
    ...posts.map((post) => ({ url: `${SITE_URL}/updates/${post.slug}`, lastModified: post._updatedAt, priority: 0.5 })),
  ];
}
