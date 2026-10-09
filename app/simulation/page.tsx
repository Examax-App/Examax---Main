import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection } from "@/components/roadmap/sections";
import { SimulationHero } from "@/components/simulation/SimulationHero";
import { ExamBand } from "@/components/simulation/ExamBand";
import { SheetSection } from "@/components/simulation/SheetSection";
import { ReportSection } from "@/components/simulation/ReportSection";
import { StepsCarousel } from "@/components/simulation/StepsCarousel";
import { ToolsSection } from "@/components/simulation/ToolsSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Symulacja matury i egzaminu ósmoklasisty",
  description:
    "Pełny arkusz CKE na czas, z narzędziami jak na sali, sprawdzony według zasad oceniania — i raport, który pokazuje, gdzie tracisz punkty.",
  path: "/simulation",
  social: { description: "Sprawdź się, zanim nadejdzie prawdziwy egzamin: pełny arkusz CKE, czas jak na sali i raport po każdym podejściu." },
});

/**
 * The simulation route — the long form of the landing page's `#exam` film,
 * and the destination behind the navbar's "Symulacja egzaminu" card.
 *
 * Built as a one-to-one of dub.co/solutions/creators (read off its live DOM
 * and recorded on 2026-10-02; his Figma capture is `DesignRules/SIMULATIONInspire.png`,
 * layout reference only), section for section and in the same order, in the
 * simulation's lavender where dub runs blue and green:
 *
 *   hero + portrait card               → SimulationHero (the learner and the sheet she handed in)
 *   creator logo strip                 → ExamBand       (the exams, by their official marks)
 *   Short links are essential          → SheetSection   #sheet (clock, tools, sessions, log)
 *   Gain deeper audience insights      → ReportSection  #report (the report dashboard, 4-up)
 *   From content to growth             → StepsCarousel  #steps (one sitting in four steps)
 *   Powerful features at scale         → ToolsSection   #tools (filters, still, stack, sitting card)
 *   CTA band with the Pro plan         → CtaBand        (one message: the Pro price, plainly)
 *
 * The reference's two customer quotes are left out — Examax has no real
 * testimonials yet, and invents none. Every figure on the page is one
 * sitting (`components/simulation/sitting.ts`), the same one the landing's
 * film plays: CKE's May 2025 basic maths paper, 42 of 50 points in 141 minutes.
 */

export default function SimulationPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Symulacja egzaminu", path: "/simulation" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <SimulationHero />
        <ExamBand />
        <SheetSection />
        <ReportSection />
        <StepsCarousel />
        <ToolsSection />
        {/* The reference's empty ruled strip between the last band and the CTA notch */}
        <GridSection innerClassName="h-12" />
        <CtaBand
          title="Poznaj egzamin, zanim go napiszesz"
          sub="Zrób pierwszy arkusz i zobacz swój poziom przygotowania."
          actions={[{ label: "Zacznij teraz", href: "/signup", primary: true }]}
        />
      </main>
      <Footer />
    </>
  );
}
