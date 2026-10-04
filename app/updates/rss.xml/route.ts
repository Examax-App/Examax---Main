import { ENTRIES } from "@/components/updates/entries";

/** /updates/rss.xml — the changelog as an RSS feed, behind the page's RSS button. Built once, at build time. */
export const dynamic = "force-static";

const SITE = "https://examax.app";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = ENTRIES.map(
    (entry) => `    <item>
      <title>${escape(entry.title)}</title>
      <link>${SITE}/updates#${entry.slug}</link>
      <guid isPermaLink="false">${entry.slug}</guid>
      <pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(entry.summary)}</description>
    </item>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Examax — Aktualności</title>
    <link>${SITE}/updates</link>
    <description>Wszystkie nowości, ulepszenia i poprawki w Examaxie</description>
    <language>pl</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
