import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection } from "@/components/roadmap/sections";
import { XIcon } from "@/components/ui/SocialIcons";
import { ENTRIES, formatDate } from "@/components/updates/entries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Aktualności", description: "Wszystkie nowości, ulepszenia i poprawki w Examaxie.", path: "/updates" }),
  alternates: { canonical: "/updates", types: { "application/rss+xml": "/updates/rss.xml" } },
};

/** Dub's small outline button, measured: 32px tall, 8px radius, neutral-200 edge, a 4px ring on hover. */
const BUTTON =
  "focus-ring inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-ash bg-white text-[14px] font-medium leading-none text-charcoal shadow-sm transition-all hover:ring-4 hover:ring-ash";

/**
 * Prose, as dub's posts set it (`prose prose-neutral`, read off the live
 * page): 16px on 28px in neutral-700, 20px between paragraphs, a disc list
 * indented 32px with 8px between items, links in medium neutral-500
 * underlined 4px below the text and darkening on hover.
 */
const PROSE =
  "mt-8 text-[16px] leading-[28px] text-slate [&_a]:font-medium [&_a]:text-fog [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-black [&_li]:my-2 [&_li]:pl-1.5 [&_p]:my-5 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-charcoal [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-8 [&_li::marker]:text-slate";

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
 * One post for now, the launch, so there is no "Older posts" strip under it.
 * The page closes on the footer, with the reference's short empty ruled
 * strip above it.
 */
export default function UpdatesPage() {
  return (
    <>
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

        <GridSection innerClassName="px-4 sm:px-12">
          {ENTRIES.map((entry) => (
            <article key={entry.slug} id={entry.slug} aria-labelledby={`${entry.slug}-title`} className="grid scroll-mt-20 pb-20 pt-4 sm:pt-12 md:grid-cols-4">
              <div className="sticky top-20 hidden self-start md:col-span-1 md:block">
                <time dateTime={entry.date} className="text-sm font-medium text-graphite">
                  {formatDate(entry.date)}
                </time>
              </div>
              <div className="flex flex-col md:col-span-3">
                <time dateTime={entry.date} className="mb-3 text-sm font-medium text-graphite md:hidden">
                  {formatDate(entry.date)}
                </time>
                <h2 id={`${entry.slug}-title`} className="font-satoshi text-2xl font-semibold tracking-tight text-graphite">
                  {entry.title}
                </h2>
                <div className="mt-5 aspect-video overflow-hidden rounded-lg border border-ash">{entry.visual}</div>
                <div className={PROSE}>{entry.body}</div>
              </div>
            </article>
          ))}
        </GridSection>

        {/* The reference's empty ruled strip above the footer */}
        <div className="px-4">
          <div aria-hidden className="mx-auto h-12 max-w-[var(--page-max-width)] border-x border-ash" />
        </div>
      </main>
      <Footer />
    </>
  );
}
