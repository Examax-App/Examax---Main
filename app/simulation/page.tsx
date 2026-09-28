import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Gauge, History, ShieldCheck, Timer } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Testimonial,
  PLACEHOLDER_QUOTES,
} from "@/components/sections/Testimonial";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProofBand } from "@/components/sections/ProofBand";
import { FeatureTrio } from "@/components/sections/FeatureTrio";
import { FeatureDuo } from "@/components/sections/FeatureDuo";
import { FeatureQuad } from "@/components/sections/FeatureQuad";
import { CompareGrid } from "@/components/sections/CompareGrid";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { SimulationHero } from "@/components/simulation/SimulationHero";
import { ExamRun } from "@/components/simulation/ExamRun";
import { SheetBuilder } from "@/components/simulation/SheetBuilder";
import { ReadinessReport } from "@/components/simulation/ReadinessReport";
import { SimulationStory } from "@/components/simulation/SimulationStory";
import { simulationFaqs } from "@/components/simulation/simulationFaqs";
import {
  ExamClockVisual,
  LiveScoreVisual,
  LostPointsVisual,
  PlanBackVisual,
  ReadinessVisual,
  RubricPointsVisual,
  SheetFormatVisual,
  WorkspaceVisual,
} from "@/components/simulation/SimulationVisuals";

export const metadata: Metadata = {
  title: "Symulacja egzaminu",
  description:
    "Pełny arkusz CKE na czas, punktacja według zasad oceniania i raport gotowości po ostatnim zadaniu. Symulacje Examax — wkrótce.",
  openGraph: {
    title: "Symulacja egzaminu — Examax",
    description:
      "Przeżyj egzamin, zanim zacznie się liczyć: pełny arkusz CKE, czas jak na sali i raport gotowości.",
    url: "https://examax.app/simulation",
  },
};

/**
 * The simulation route — the long form of the landing page's `#exam`
 * section, and the destination behind the navbar's "Symulacja egzaminu" entry.
 *
 * Same product-page anatomy as /training and /roadmap, so the three read as
 * one family. Three things are deliberately different:
 *
 *  - **The page is honest that this has not shipped.** The landing card and
 *    the landing FAQ both say simulations are in progress and land in the paid
 *    plans first; a product page that read as available would be the one
 *    dishonest surface on the site. So the hero carries a "Wkrótce" marker,
 *    every CTA signs up for the start rather than for the feature, and the FAQ
 *    opens on the date question without inventing a date.
 *  - **The hero wall does not move.** /training's drifts down and /roadmap's
 *    drifts right; an exam is the one thing in the product that holds still,
 *    so focus comes from contrast and the mask instead.
 *  - **The page runs warm.** Tangerine is reserved for this feature in
 *    `app/globals.css` — it is the only surface meant to read as an event
 *    rather than as a study screen.
 *
 * The figures, the sheet and the live score are the film's own simulation
 * fixture (`components/hero-film/demoData`), so the reel and this page
 * describe one sitting rather than two.
 */
export default function SimulationPage() {
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
        <SimulationHero />

        {/* The feature has no usage numbers yet and inventing them would be
            the one lie on the page. These three describe the artefact, which
            does exist and is the thing worth trusting. */}
        <ProofBand
          accent="tangerine"
          heading="Arkusz, nie zestaw pytań"
          sub="Symulacja odtwarza arkusz CKE co do formatu, czasu i punktacji."
          figures={[
            { value: "41", label: "arkuszy w formacie CKE" },
            { value: "1:1", label: "zgodność z arkuszem egzaminacyjnym" },
            { value: "0", label: "zadań generowanych automatycznie" },
          ]}
        />

        <FeatureTrio
          id="sheet"
          heading="Arkusz taki, jaki dostaniesz na sali"
          sub="Te same zadania, ten sam czas i to samo miejsce na rozpisanie odpowiedzi."
          cards={[
            {
              title: "Format 1:1 z arkuszem",
              description:
                "Cały arkusz z danej sesji, w kolejności — bez skracania i bez wybierania łatwiejszych zadań.",
              ctaLabel: "Skąd te arkusze",
              ctaHref: "#sources",
              visual: <SheetFormatVisual />,
            },
            {
              title: "Czas liczony jak na sali",
              description:
                "Limit przepisany z arkusza. Bez pauzy, bez podpowiedzi i bez cofania się po czasie.",
              ctaLabel: "Zobacz arkusz na czas",
              ctaHref: "#run",
              visual: <ExamClockVisual />,
            },
            {
              title: "Miejsce na rozpisanie",
              description:
                "Brudnopis przy każdym zadaniu otwartym, zapisywany na bieżąco razem z odpowiedzią.",
              ctaLabel: "Zapisz się na start",
              ctaHref: "/signup",
              visual: <WorkspaceVisual />,
            },
          ]}
        />

        {/* The grading pair gets the wide block: both fragments are two-pane
            screens that a third of the column crops badly. The compact row
            under it carries the exam-room details that are real but do not
            each need a screenshot — the reference's own alternation. */}
        <FeatureDuo
          id="grading"
          accent="tangerine"
          eyebrowIcon={Timer}
          eyebrowLabel="Punktacja"
          heading="Punkty liczone od pierwszego zadania"
          sub="Nie po tygodniu i nie na oko — według zasad oceniania z tej samej sesji."
          cards={[
            {
              title: "Ocena na bieżąco",
              description: (
                <>
                  Widzisz, ile punktów masz zabukowanych, zanim skończysz
                  arkusz — i ile jeszcze jest w grze. Ten sam licznik zamyka się
                  potem w{" "}
                  <Link href="#report" className="font-medium text-charcoal underline decoration-smoke underline-offset-2 transition-colors duration-150 hover:decoration-charcoal">
                    raporcie gotowości
                  </Link>
                  .
                </>
              ),
              ctaLabel: "Zobacz podgląd",
              ctaHref: "#run",
              visual: <LiveScoreVisual />,
            },
            {
              title: "Zadania otwarte po kryteriach",
              description: (
                <>
                  Metoda, obliczenia i odpowiedź osobno — widzisz, za co punkt
                  jest, a za co go zabrakło. Kryteria pochodzą z{" "}
                  <Link href="#sources" className="font-medium text-charcoal underline decoration-smoke underline-offset-2 transition-colors duration-150 hover:decoration-charcoal">
                    zasad oceniania tej samej sesji
                  </Link>
                  .
                </>
              ),
              ctaLabel: "Zobacz raport",
              ctaHref: "#report",
              visual: <RubricPointsVisual />,
            },
          ]}
        />

        <FeatureQuad
          label="Pozostałe elementy symulacji"
          cards={[
            {
              icon: Gauge,
              accent: "tangerine",
              title: "Tempo pilnowane na bieżąco",
              description:
                "Widzisz, gdzie zegar zaczyna uciekać — dopóki da się jeszcze coś z tym zrobić.",
              ctaLabel: "Zobacz podgląd",
              ctaHref: "#run",
            },
            {
              icon: Flag,
              accent: "blue",
              title: "Flagowanie zadań",
              description:
                "Odkładasz zadanie i wracasz do niego, zanim czas się skończy.",
              ctaLabel: "Zobacz trening",
              ctaHref: "/training",
            },
            {
              icon: History,
              accent: "lavender",
              title: "Historia podejść",
              description:
                "Każde podejście zapisuje się osobno — widzisz, jak zmienia się wynik i tempo.",
              ctaLabel: "Zobacz raport",
              ctaHref: "#report",
            },
            {
              icon: ShieldCheck,
              accent: "green",
              title: "Zapis na bieżąco",
              description:
                "Arkusz zapisuje się sam, więc przerwane podejście nic nie kosztuje.",
              ctaLabel: "Częste pytania",
              ctaHref: "#simulation-faq",
            },
          ]}
        />

        {/* The page's one quote. It is about the arkusz format rather than
            about simulations, deliberately: the feature has not shipped, so
            nobody can honestly have an opinion about using it yet. */}
        <Testimonial
          {...PLACEHOLDER_QUOTES.practice}
          layout="feature"
          story="/reviews"
        />

        <SheetBuilder />

        <ExamRun />

        <FeatureTrio
          id="after"
          heading="Najważniejsze dzieje się po ostatnim zadaniu"
          sub="Arkusz kończy się raportem, a raport kończy się planem na przyszły tydzień."
          cards={[
            {
              title: "Jeden wskaźnik gotowości",
              description:
                "Wynik, tempo i pokrycie materiału złożone w jedną liczbę, którą da się porównać z poprzednim arkuszem.",
              ctaLabel: "Zobacz raport",
              ctaHref: "#report",
              visual: <ReadinessVisual />,
            },
            {
              title: "Widzisz, gdzie poszły punkty",
              description:
                "Temat po temacie, z powodem — inaczej wygląda błąd rachunkowy, a inaczej zadanie, na które zabrakło czasu.",
              ctaLabel: "Zobacz analitykę",
              ctaHref: "/#progress",
              visual: <LostPointsVisual />,
            },
            {
              title: "Raport wraca do roadmapy",
              description:
                "Braki z arkusza wchodzą do planu na kolejny tydzień same — nie zostają w PDF-ie, o którym zapomnisz.",
              ctaLabel: "Zobacz roadmapę",
              ctaHref: "/roadmap",
              visual: <PlanBackVisual />,
            },
          ]}
        />

        <ReadinessReport />

        <CompareGrid
          id="compare"
          icon={Timer}
          accent="tangerine"
          heading="Dlaczego nie po prostu arkusz z PDF-a"
          sub="Arkusze są darmowe i publiczne. Różnica zaczyna się, gdy odłożysz długopis."
          caption="Porównanie symulacji Examaxa z arkuszem z PDF-a, próbną w szkole i brakiem próbnej"
          columns={[
            "Examax",
            "Arkusz z PDF-a",
            "Próbna w szkole",
            "Bez próbnej",
          ]}
          rows={[
            {
              label: "Pełny arkusz CKE",
              cells: [true, true, true, false],
            },
            {
              label: "Czas liczony automatycznie",
              cells: [true, false, true, false],
            },
            {
              label: "Punktacja według zasad oceniania",
              cells: [true, "sam sprawdzasz", true, false],
            },
            {
              label: "Wynik tego samego dnia",
              cells: [true, false, "po tygodniach", false],
            },
            {
              label: "Raport, co konkretnie poprawić",
              cells: [true, false, "częściowo", false],
            },
            {
              label: "Podchodzisz, kiedy chcesz",
              cells: [true, true, false, false],
            },
            {
              label: "Braki wracają do planu nauki",
              cells: [true, false, false, false],
            },
          ]}
        />

        <SimulationStory />
        <FaqAccordion id="simulation-faq" faqs={simulationFaqs} />
        <PricingTeaser
          heading="Symulacje wchodzą do planów Pro i Max"
          sub="Konto zakładasz za darmo już teraz — plan podnosisz dopiero, kiedy arkusze ruszą."
        />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
