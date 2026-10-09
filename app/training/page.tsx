import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureTrio } from "@/components/sections/FeatureTrio";
import { TrainingHero } from "@/components/training/TrainingHero";
import { ExamCoverage } from "@/components/training/ExamCoverage";
import { QueueScroll, ReadinessOrbit, TutorChat } from "@/components/training/AutopilotVisuals";
import { MarkingRules, OpenTaskCheck, ResultFeed } from "@/components/training/CheckingVisuals";
import { CoverageBand } from "@/components/training/CoverageBand";
import { FirstSteps, SetBuilder, TimedWindow } from "@/components/training/ToolsVisuals";
import { DiagnosticBand } from "@/components/training/DiagnosticBand";
import { SimilarTasks } from "@/components/training/SimilarTasks";
import { SourcesCarousel } from "@/components/training/SourcesCarousel";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Trening zadań z arkuszy CKE",
  description:
    "Trenuj na zadaniach z arkuszy CKE: wynik od razu według zasad oceniania, Korepetytor AI przy błędach i zadania dobierane do tego, gdzie tracisz punkty.",
  path: "/training",
  social: { description: "Zadania z arkuszy CKE, sprawdzane od razu i dobierane do tego, gdzie tracisz punkty." },
});

/**
 * The training route — the long form of the landing page's `#practice`
 * section, and the destination behind the navbar's "Trening zadań" card.
 *
 * Built as a one-to-one of dub.co/partners (read off its live DOM and
 * recorded frame by frame on 2026-09-30; the full-page capture is
 * `trainingZadan.png`), section for section and in the same order:
 *
 *   hero + card wall        → TrainingHero      (tasks for partners)
 *   "Migrated off…" logos   → ExamCoverage      (exams × subjects)
 *   Revenue on autopilot    → FeatureTrio #autopilot
 *   Effortless payouts      → FeatureTrio #checking
 *   Battle-tested + globe   → CoverageBand      (map of Poland)
 *   Seamless integration    → FeatureTrio #tools
 *   Reward viral content    → DiagnosticBand
 *   Partner discovery       → SimilarTasks
 *   Loved by SaaS companies → SourcesCarousel
 *   CTA band + footer       → CtaBand, Footer
 *
 * The reference runs five customer quotes between these. Examax has no real
 * testimonials yet, so the page carries none (removed at his request,
 * 2026-09-30) rather than placeholders.
 */
export default function TrainingPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Trening", path: "/training" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <TrainingHero />
        <ExamCoverage />

        <FeatureTrio
          id="autopilot"
          variant="open"
          heading="Trening dopasowany do Ciebie"
          sub="Examax widzi, gdzie tracisz punkty, i dobiera kolejne zadania. Ty tylko rozwiązujesz."
          cards={[
            {
              title: "Kolejka zadań na każdy dzień",
              description:
                "Zadania na dziś, powtórki na za dwa dni i arkusz na weekend — dobrane do tego, co jeszcze Ci nie wychodzi.",
              ctaLabel: "Dowiedz się więcej",
              ctaHref: "/roadmap",
              visual: <QueueScroll />,
            },
            {
              title: "Korepetytor AI przy każdym błędzie",
              description:
                "Tłumaczy krok po kroku, skąd wziął się błąd.",
              ctaLabel: "Poznaj Korepetytora AI",
              ctaHref: "/agents",
              visual: <TutorChat />,
            },
            {
              title: "Gotowość po każdym zadaniu",
              description:
                "Każda odpowiedź aktualizuje szacowaną gotowość do egzaminu — widzisz, ile dało dzisiejsze pół godziny.",
              ctaLabel: "Zobacz postępy",
              ctaHref: "/progress",
              visual: <ReadinessOrbit />,
            },
          ]}
        />

        <FeatureTrio
          id="checking"
          variant="open"
          heading="Sprawdzanie bez czekania"
          sub="Natychmiastowa informacja zwrotna według zasad oceniania CKE."
          cards={[
            {
              title: "Punkty zaraz po odpowiedzi",
              description:
                "Bez odsyłania pracy i bez czekania na sprawdzenie. Odpowiadasz, widzisz punkty, idziesz dalej.",
              ctaLabel: "Zacznij za darmo",
              ctaHref: "/signup",
              visual: <ResultFeed />,
            },
            {
              title: "Punktacja według zasad CKE",
              description:
                "Każde zadanie ma przypisane oficjalne zasady oceniania — punkt po punkcie.",
              ctaLabel: "Dowiedz się więcej",
              ctaHref: "#sources",
              visual: <MarkingRules />,
            },
            {
              title: "Zadania otwarte też sprawdzone",
              description:
                "Metoda, rachunki i wynik oceniane osobno — widzisz, za co jest punkt, a za co go zabrakło.",
              ctaLabel: "Dowiedz się więcej",
              ctaHref: "/contact",
              visual: <OpenTaskCheck />,
            },
          ]}
        />

        <CoverageBand />

        <FeatureTrio
          id="tools"
          variant="open"
          heading="Trenuj po swojemu"
          sub="Własne zestawy, tryb na czas i gotowy plan na start — bez ustawiania czegokolwiek od zera."
          cards={[
            {
              title: "Własny zestaw zadań w kilka sekund",
              description:
                "Wybierasz egzamin, temat i poziom — Examax składa zestaw z zadań CKE i daje mu własny link.",
              ctaLabel: "Dowiedz się więcej",
              ctaHref: "/pricing",
              visual: <SetBuilder />,
            },
            {
              title: "Tryb na czas, jak na sali",
              description:
                "Limit czasu, nawigator zadań i flagowanie na później. Po ostatnim kliknięciu — pełny raport.",
              ctaLabel: "Zobacz symulację",
              ctaHref: "/simulation",
              visual: <TimedWindow />,
            },
            {
              title: "Pierwszy trening w pięć minut",
              description: (
                <>
                  Wybierasz egzamin, robisz quiz diagnostyczny i zaczynasz. Plan
                  nauki dopasowany do Twoich wyników.
                </>
              ),
              ctaLabel: "Załóż konto",
              ctaHref: "/signup",
              visual: <FirstSteps />,
            },
          ]}
        />

        <DiagnosticBand />
        <SimilarTasks />
        <SourcesCarousel />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
