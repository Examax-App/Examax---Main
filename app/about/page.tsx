import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { AboutHero } from "@/components/about/AboutHero";
import { ExamStrip } from "@/components/about/ExamStrip";
import { StorySection } from "@/components/about/StorySection";
import { PeopleSection } from "@/components/about/PeopleSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { SourcesSection } from "@/components/about/SourcesSection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "O nas",
  description:
    "Kim jesteśmy, po co budujemy Examax i według jakich zasad. Platforma do nauki na egzamin ósmoklasisty i maturę, oparta na dokumentach CKE.",
  path: "/about",
  social: { title: "O Examax", description: "Przygotowanie do egzaminów CKE w jednym miejscu: zadania, postępy i nauka na błędach." },
});

/**
 * The about route — "O Examax" in the navbar's "O nas" menu and the
 * footer's "O nas". A one-to-one of dub.co/about (read off its live DOM on
 * 2026-10-02; his capture is `DesignRules/About _ Dub (pasted 2026-10-02).png`,
 * layout reference only), section for section and in the same order:
 *
 *   hero with chips in the heading   → AboutHero
 *   customer logo strip (flipping)   → ExamStrip       (exams and subjects)
 *   What is Dub? + video + mission   → StorySection    (the launch film)
 *   Our People: globe + team grid    → PeopleSection   (the owner's card, details to come)
 *   (Life at Dub is left out)
 *   Our values                       → ValuesSection
 *   Individual investors grid        → SourcesSection  (CKE's documents)
 *   closing band                     → CtaBand
 *
 * Examax is new: nothing on the page claims a team, customers, investors or
 * numbers it does not have.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "O nas", path: "/about" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <AboutHero />
        <ExamStrip />
        <StorySection />
        <PeopleSection />
        <ValuesSection />
        <SourcesSection />
        <CtaBand title="Zacznij przygotowania już dziś" sub="Załóż darmowe konto i zacznij od krótkiego testu poziomującego." />
      </main>
      <Footer />
    </>
  );
}
