import { sanityFetch } from "@/lib/sanity/live";
import { UPDATES_QUERY } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

/**
 * /updates/rss.xml — the changelog as an RSS feed, behind the page's RSS
 * button. Static; it reads the list page's own query, so the live refresh
 * that updates /updates refreshes the feed too, and it is rebuilt hourly in
 * case no one had /updates open when a post was published. Each item carries
 * its cover (Media RSS), and the channel links to itself and says when it
 * last changed, as feed validators expect.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://examax.app";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const { data: posts } = await sanityFetch({ query: UPDATES_QUERY, perspective: "published", stega: false });
  const items = posts
    .map((post) => {
      const cover = post.image?.asset
        ? `\n      <media:content url="${escape(urlFor(post.image).width(1200).height(675).fit("crop").url())}" medium="image" width="1200" height="675" />`
        : "";
      return `    <item>
      <title>${escape(post.title ?? "")}</title>
      <link>${SITE}/updates/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/updates/${post.slug}</guid>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.summary ?? "")}</description>${cover}
    </item>`;
    })
    .join("\n");
  /* The newest edit to any post, or now for an empty feed. */
  const lastChange = posts.reduce((latest, post) => (post._updatedAt > latest ? post._updatedAt : latest), "");
  const lastBuildDate = (lastChange ? new Date(lastChange) : new Date()).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Examax — Aktualności</title>
    <link>${SITE}/updates</link>
    <atom:link href="${SITE}/updates/rss.xml" rel="self" type="application/rss+xml" />
    <description>Najnowsze funkcje, aktualizacje i informacje od zespołu Examax</description>
    <language>pl</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${SITE}/web-app-manifest-192x192.png</url>
      <title>Examax — Aktualności</title>
      <link>${SITE}/updates</link>
    </image>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
