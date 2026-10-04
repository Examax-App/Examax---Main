import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { GridSection, MiniFeatures } from "@/components/roadmap/sections";
import { AccentTile, accentStyles } from "@/components/ui/FeaturePill";
import { FeaturedTopics } from "@/components/subjects/FeaturedTopics";
import { FeaturedSlide } from "@/components/subjects/FeaturedSlide";
import { ClosingCard, TopicCard } from "@/components/subjects/TopicCard";
import { TopicRow } from "@/components/subjects/TopicRow";
import { topicsLabel } from "@/components/subjects/pieces";
import { cn } from "@/lib/cn";
import type { Accent } from "@/components/ui/FeaturePill";
import type { Subject } from "@/components/subjects/types";

/** dub's five a row when the działy fill it; otherwise the widest row that leaves none alone. */
function tileColumns(count: number) {
  if (count % 5 === 0) return "lg:grid-cols-5";
  if (count % 4 === 0) return "lg:grid-cols-4";
  return "lg:grid-cols-3";
}

/** A dział tile's glyph takes the subject's colour under the pointer, as the navbar's subject rows do. */
const HOVER_TINT: Record<Accent, string> = {
  blue: "group-hover:text-electric-blue",
  green: "group-hover:text-vivid-green",
  lavender: "group-hover:text-lavender",
  sapphire: "group-hover:text-deep-sapphire",
  tangerine: "group-hover:text-tangerine",
  yellow: "group-hover:text-[#ca8a04]",
};

/**
 * A subject's page — /math, /polish and /english, the destinations behind
 * the "Przedmioty" column of the navbar's "Materiały" menu and the footer's
 * "Przedmioty". A one-to-one of dub.co/marketplace (the capture is
 * `DesignRules/Marketplace _ Dub (subjects).png`), section for section:
 *
 *   heading + line, left-aligned        → the subject, and what its page covers
 *   featured program carousel           → FeaturedTopics + FeaturedSlide (a key
 *                                         topic at a time, with its diagram)
 *   Categories (icon tiles, 5 a row)    → Działy, each a jump to its row
 *   a row of program cards per category → TopicRow of TopicCards per dział,
 *                                         every topic with its icon and exams
 *   (footer)                            → the house close: what the subject
 *                                         gives you, then the CTA band
 *
 * The page column is the site's own 1080px, ruled at both edges.
 */
export function SubjectPage({ subject }: { subject: Subject }) {
  const total = subject.categories.reduce((sum, category) => sum + category.topics.length, 0);
  const last = subject.categories.length - 1;

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
        {/* Heading */}
        <GridSection labelledBy="subject-heading" innerClassName="px-6 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20">
          <p className="flex items-center gap-2 text-body font-medium text-steel">
            <AccentTile icon={subject.icon} accent={subject.accent} size="sm" />
            {subject.name}
          </p>
          <h1 id="subject-heading" className="mt-4 max-w-3xl text-balance font-satoshi text-4xl font-medium leading-[1.1] text-charcoal sm:text-5xl">
            {subject.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-fog">{subject.sub}</p>
        </GridSection>

        <GridSection labelledBy="topics-heading">
          {/* Featured, inset from the column's rules as dub's card is */}
          <div className="px-2 pt-2">
            <FeaturedTopics
              labels={subject.featured.map((topic) => topic.name)}
              slides={subject.featured.map((topic) => (
                <FeaturedSlide key={topic.name} topic={topic} accent={subject.accent} />
              ))}
            />
          </div>

          <div className="px-6 pb-16 pt-14 sm:px-8 sm:pb-20">
            {/* Działy */}
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="topics-heading" className="text-lg font-medium text-charcoal">
                Działy
              </h2>
              <span className="text-body text-fog">{topicsLabel(total)}</span>
            </div>
            <ul className={cn("mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3", tileColumns(subject.categories.length))}>
              {subject.categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="focus-ring group flex h-full min-h-[72px] flex-col justify-between gap-3 rounded-lg border border-ash bg-white p-3 transition-colors hover:bg-canvas-muted"
                  >
                    <category.icon
                      className={cn("size-4 text-charcoal transition-colors", HOVER_TINT[subject.accent])}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-body font-medium leading-tight text-charcoal">{category.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* A row per dział */}
            <div className="mt-16 flex flex-col gap-14">
              {subject.categories.map((category, i) => (
                <TopicRow key={category.id} id={category.id} name={category.name} count={category.topics.length}>
                  {category.topics.map((topic) => (
                    <TopicCard key={topic.name} topic={topic} accent={subject.accent} />
                  ))}
                  {i === last ? <ClosingCard icons={subject.featured.slice(0, 3).map((topic) => topic.icon)} accent={subject.accent} /> : null}
                </TopicRow>
              ))}
            </div>
          </div>

          <MiniFeatures
            iconClassName={accentStyles[subject.accent].text}
            summary={subject.benefits.summary}
            cta={{ label: "Zacznij za darmo", href: "/signup" }}
            items={subject.benefits.items}
          />
          {/* The reference's empty ruled strip before the CTA notch */}
          <div aria-hidden className="h-12" />
        </GridSection>

        <CtaBand title={subject.cta.title} sub={subject.cta.sub} />
      </main>
      <Footer />
    </>
  );
}
