import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { RoadmapHero } from "@/components/roadmap/RoadmapHero";
import { TopicBand } from "@/components/roadmap/TopicBand";
import { PlanSection } from "@/components/roadmap/PlanSection";
import { ScheduleSection } from "@/components/roadmap/ScheduleSection";
import { ConnectedBand } from "@/components/roadmap/ConnectedBand";
import { FlexiblePath } from "@/components/roadmap/FlexiblePath";
import { GridSection } from "@/components/roadmap/sections";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Roadmapa nauki do matury i egzaminu ósmoklasisty",
  description:
    "Cały materiał egzaminu CKE rozpisany na tematy i tygodnie — osobisty plan nauki liczony do dnia egzaminu, który wie, co robić dalej.",
  path: "/roadmap",
  social: { description: "Plan nauki ułożony pod Twój egzamin, termin i tempo — temat po temacie, aż do dnia egzaminu." },
});

/**
 * The roadmap route — the long form of the landing page's `#roadmap` section,
 * and the destination behind the navbar's "Roadmapa nauki" card.
 *
 * Built as a one-to-one of dub.co/links (read off its live DOM and recorded
 * on 2026-10-01; the full-page capture is `DesignRules/roadmap.png`),
 * section for section and in the same order, in Roadmapa's blue where dub
 * runs orange:
 *
 *   hero + "Shorten any link"  → RoadmapHero       (add a topic to the plan)
 *   customer logo band         → TopicBand         (roadmap topics, E8 ⇄ Matura)
 *   Branded short links        → PlanSection #plan (builder, 2×2, 4-up)
 *   Success at a glance        → ScheduleSection #schedule (weekly plan chart, 2×2, 3-up)
 *   Connect your favorite tools→ ConnectedBand     (the rest of Examax)
 *   Programmatic link mgmt     → FlexiblePath #flexible (three tabs)
 *   CTA band + footer          → CtaBand, Footer
 *
 * This page is the personal study plan, not analytics: the chart plots what
 * the plan schedules, never a score. The reference's two customer quotes are
 * left out (no real testimonials yet), as on /training.
 */
export default function RoadmapPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Roadmapa", path: "/roadmap" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <RoadmapHero />
        <TopicBand />
        <PlanSection />
        <ScheduleSection />
        <ConnectedBand />
        <FlexiblePath />
        {/* The reference's empty ruled strip between the last band and the CTA notch */}
        <GridSection innerClassName="h-12" />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
