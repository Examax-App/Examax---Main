import { sanityFetch } from "@/lib/sanity/live";
import { UPDATES_QUERY } from "@/lib/sanity/queries";

/**
 * /updates/rss.xml — the changelog as an RSS feed, behind the page's RSS
 * button. Static; it reads the list page's own query, so the live refresh
 * that updates /updates refreshes the feed too.
 */
export const dynamic = "force-static";

const SITE = "https://examax.app";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const { data: posts } = await sanityFetch({ query: UPDATES_QUERY, perspective: "published", stega: false });
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title ?? "")}</title>
      <link>${SITE}/updates/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/updates/${post.slug}</guid>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.summary ?? "")}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Examax — Aktualności</title>
    <link>${SITE}/updates</link>
    <description>Najnowsze funkcje, aktualizacje i informacje od zespołu Examax</description>
    <language>pl</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
