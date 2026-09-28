import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisplayCards } from "@/components/ui/DisplayCards";
import { AccentTile } from "@/components/ui/FeaturePill";
import { releases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Aktualności",
  description:
    "Nowe funkcje, zmiany w produkcie i ogłoszenia zespołu Examax.",
};

/**
 * The releases page.
 *
 * Structure follows the marketing-page convention already set by /contact and
 * /help: the 1200px column with its `border-x` edges, a centred display
 * headline, and hairline-divided sections beneath.
 *
 * The three most recent releases lead as a stack rather than as a list,
 * because they are the only three most visitors will read; the full run
 * follows underneath as dated rows. Both read `lib/releases.ts`, which the
 * landing page's changelog strip also reads.
 */
export default function AktualnosciPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-[1200px] border-x border-ash/60 bg-white">
          <section className="border-b border-ash px-5 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="mx-auto grid size-12 place-items-center rounded-cards text-charcoal"
            >
              <Newspaper className="size-8" strokeWidth={1.5} />
            </span>
            <h1 className="mx-auto mt-4 max-w-xl font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none">
              Aktualności
            </h1>
            <p className="mx-auto mt-5 max-w-md text-body-xl text-steel">
              Nowe funkcje, zmiany w produkcie i ogłoszenia zespołu.
            </p>

            {/* The stack is skewed and fans to the right, so it needs room on
                that side and clipping on small screens — hence the overflow
                guard and the leftward nudge that re-centres the fan. */}
            <div className="mt-14 overflow-hidden pb-10">
              <DisplayCards
                items={releases}
                className="-translate-x-6 sm:-translate-x-12"
              />
            </div>
          </section>

          <section className="px-5 py-12 sm:px-16 sm:py-16">
            <h2 className="text-body font-medium uppercase tracking-[0.12em] text-fog">
              Wszystkie wydania
            </h2>
            <ol className="mt-6 divide-y divide-ash border-y border-ash">
              {releases.map((release) => (
                <li
                  key={release.title}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-6"
                >
                  <p className="font-geist-mono text-caption text-silver sm:w-32 sm:shrink-0 sm:pt-1">
                    {release.date}
                  </p>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <AccentTile icon={release.icon} accent={release.accent} />
                      <p className="text-body-lg font-medium text-charcoal">
                        {release.title}
                      </p>
                    </div>
                    <p className="mt-2 max-w-2xl text-body text-steel">
                      {release.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
