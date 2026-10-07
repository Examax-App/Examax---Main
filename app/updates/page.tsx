import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection } from "@/components/roadmap/sections";
import { XIcon } from "@/components/ui/SocialIcons";
import { formatDate } from "@/components/updates/format";
import { PostBody } from "@/components/updates/PostBody";
import { PostCover } from "@/components/updates/PostCover";
import { sanityFetch } from "@/lib/sanity/live";
import { UPDATES_QUERY } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Aktualności", description: "Nowe funkcje, ulepszenia i poprawki w Examaxie – wpis po wpisie, od startu platformy. Sprawdź, co zmieniło się ostatnio.", path: "/updates" }),
  alternates: { canonical: "/updates", types: { "application/rss+xml": "/updates/rss.xml" } },
};

/** Dub's small outline button, measured: 32px tall, 8px radius, neutral-200 edge, a 4px ring on hover. */
const BUTTON =
  "focus-ring inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-ash bg-white text-[14px] font-medium leading-none text-charcoal shadow-sm transition-all hover:ring-4 hover:ring-ash";

/**
 * /updates — the changelog, a one-to-one of dub.co/changelog (measured off
 * its live DOM on 2026-10-03; the capture is `DesignRules/Changelog _ Dub.png`):
 *
 *   a ruled band: the title (Satoshi 48), the line (20, neutral-500), and
 *   "Follow" on X beside an RSS button
 *   then one ruled column of posts, each on a four-column grid — the date
 *   in the first column, sticky as the post scrolls; the title (Satoshi 24,
 *   semibold, tight), the 16:9 picture (8px radius, hairline) and the prose
 *   across the other three
 *
 * Posts come from Sanity (Studio type `changelogPost`, newest first); the
 * date, title and cover link to the post's own page, /updates/[slug]. The
 * page is static and <SanityLive /> (app/updates/layout.tsx) refreshes it
 * when a post changes. There is no "Older posts" strip yet: dub pages at
 * ten posts, so add one (and /updates/page/[n]) once there are more.
 * The page closes on the footer, with the reference's short empty ruled
 * strip above it.
 */
export default async function UpdatesPage() {
  const { data: posts } = await sanityFetch({ query: UPDATES_QUERY, perspective: "published", stega: false });

  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Aktualności", path: "/updates" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <GridSection labelledBy="updates-heading" innerClassName="px-4 sm:px-12">
          <div className="flex flex-col gap-8 py-16">
            <div>
              <h1 id="updates-heading" className="mt-5 font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]">
                Aktualności
              </h1>
              <p className="mt-6 text-lg text-fog sm:text-xl">Wszystkie nowości, ulepszenia i poprawki w Examaxie</p>
            </div>
            <div className="flex w-fit items-center gap-2">
              <a href="https://x.com/examaxapp" target="_blank" rel="noopener noreferrer" className={`${BUTTON} px-3`}>
                <XIcon className="size-4" />
                Obserwuj
              </a>
              <a href="/updates/rss.xml" aria-label="Kanał RSS" className={`${BUTTON} w-8`}>
                <Rss className="size-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </GridSection>

        {posts.length > 0 && (
          <GridSection innerClassName="px-4 sm:px-12">
            {posts.map((post, index) => {
              const href = `/updates/${post.slug}`;
              const date = post.publishedAt && (
                <time dateTime={post.publishedAt} className="text-sm font-medium text-graphite transition-colors hover:text-midnight-ink">
                  {formatDate(post.publishedAt)}
                </time>
              );
              return (
                <article key={post._id} id={post.slug ?? undefined} aria-labelledby={`${post.slug}-title`} className="grid scroll-mt-20 pb-20 pt-4 sm:pt-12 md:grid-cols-4">
                  <div className="sticky top-20 hidden self-start md:col-span-1 md:block">
                    <Link href={href}>{date}</Link>
                  </div>
                  <div className="flex flex-col md:col-span-3">
                    <Link href={href} className="mb-3 md:hidden">
                      {date}
                    </Link>
                    <Link href={href}>
                      <h2
                        id={`${post.slug}-title`}
                        className="font-satoshi text-2xl font-semibold tracking-tight text-graphite hover:underline hover:decoration-1 hover:underline-offset-4"
                      >
                        {post.title}
                      </h2>
                    </Link>
                    <Link href={href} tabIndex={-1} aria-hidden className="mt-5">
                      <PostCover image={post.image} title={post.title ?? ""} preload={index === 0} className="border-ash" />
                    </Link>
                    <PostBody value={post.body} className="mt-8" />
                  </div>
                </article>
              );
            })}
          </GridSection>
        )}

        {/* The reference's empty ruled strip above the footer */}
        <div className="px-4">
          <div aria-hidden className="mx-auto h-12 max-w-[var(--page-max-width)] border-x border-ash" />
        </div>
      </main>
      <Footer />
    </>
  );
}
