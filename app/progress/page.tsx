import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { GridSection } from "@/components/roadmap/sections";
import { ProgressHero } from "@/components/progress/ProgressHero";
import { MetricBand } from "@/components/progress/MetricBand";
import { GlanceSection } from "@/components/progress/GlanceSection";
import { JourneySection } from "@/components/progress/JourneySection";
import { LiveSection } from "@/components/progress/LiveSection";
import { ProfileSection } from "@/components/progress/ProfileSection";
import { NextSection } from "@/components/progress/NextSection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Śledzenie postępów",
  description:
    "Każde zadanie, lekcja i quiz trafia do statystyk od razu — opanowanie tematów, skuteczność, seria nauki i gotowość do egzaminu CKE w jednym miejscu.",
  path: "/progress",
  social: { description: "Zobacz, ile już umiesz, co się poprawiło i co ćwiczyć dalej — od pierwszego zadania do dnia egzaminu." },
});

/**
 * The progress route — the long form of the landing page's `#progress`
 * section, and the destination behind the navbar's "Śledzenie postępów" card.
 *
 * Built as a one-to-one of dub.co/analytics (read off its live DOM and
 * recorded on 2026-10-01; the full-page capture is `DesignRules/progress.png`
 * and the event stream, its sheet and the hero are under
 * `DesignRules/dom-captures/analytics-*.html`), section for section and in
 * the same order, in Postępy's tangerine where dub runs green:
 *
 *   hero + attribution chart      → ProgressHero   (the learner's year, hover by month)
 *   customer logo band            → MetricBand     (what is measured: results ⇄ habits)
 *   Success at a glance           → GlanceSection  #glance (30-day chart, share + stack, 4-up)
 *   Visualize your journey        → JourneySection #journey (mastery funnel, learner + tiles)
 *   See it as it happens          → LiveSection    #live (events table, topic sheet, filters)
 *   Know your customer            → ProfileSection #profile (the landing's profile wall, full size)
 *   Turn events into opportunities→ NextSection    #next (recommendations ⇄ reminders)
 *   CTA band + footer             → CtaBand, Footer
 *
 * The reference's customer quote is replaced by Korepetytor AI's own
 * recommendation (no real testimonials yet, as on /training and /roadmap).
 */
export default function ProgressPage() {
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
        <ProgressHero />
        <MetricBand />
        <GlanceSection />
        <JourneySection />
        <LiveSection />
        <ProfileSection />
        <NextSection />
        {/* The reference's empty ruled strip between the last band and the CTA notch */}
        <GridSection innerClassName="h-12" />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
