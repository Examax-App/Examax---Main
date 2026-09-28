import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Testimonial,
  PLACEHOLDER_QUOTES,
} from "@/components/sections/Testimonial";
import { CtaBand } from "@/components/sections/CtaBand";
import { TrainingHero } from "@/components/training/TrainingHero";
import { ProofBand } from "@/components/sections/ProofBand";
import { FeatureTrio } from "@/components/sections/FeatureTrio";
import { TimedRun } from "@/components/training/TimedRun";
import { TaskLibrary } from "@/components/training/TaskLibrary";
import { PencilLine } from "lucide-react";
import { CompareGrid } from "@/components/sections/CompareGrid";
import { TrainingStory } from "@/components/training/TrainingStory";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { trainingFaqs } from "@/components/training/trainingFaqs";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import {
  AgentExplainVisual,
  FlaggedVisual,
  InstantScoreVisual,
  MasteryChartVisual,
  QuizBuilderVisual,
  RoadmapSyncVisual,
  RubricVisual,
  SheetTaskVisual,
  SpacedReviewVisual,
} from "@/components/training/TrainingVisuals";

export const metadata: Metadata = {
  title: "Trening zadań",
  description:
    "Trenuj na zadaniach z oficjalnych arkuszy CKE: quizy do każdego tematu, tryb na czas, punktacja według zasad CKE i wyjaśnienie każdego błędu.",
  openGraph: {
    title: "Trening zadań — Examax",
    description:
      "Zadania z arkuszy CKE, quizy do każdego tematu i sprawdzanie z wyjaśnieniem — dobierane do tego, na czym stoisz.",
    url: "https://examax.app/training",
  },
};

/**
 * The training route — the long form of the landing page's `#practice`
 * section, and the destination behind the navbar's "Trening zadań" card.
 *
 * Structure follows the reference's product-page anatomy (measured off
 * `DesignRules/ExporttoFigma _ dub.co _ Dub Partners …png`), with three
 * deliberate departures, all of them the reference's own habits rather than
 * mine:
 *
 *  - **Proof second.** The reference puts its logo wall directly under the
 *    hero and states its scale numbers flat. Both live in one band here, at
 *    the top, because the numbers are the most persuasive thing on the page.
 *  - **One quote, not three.** The reference gives a quote a section of its
 *    own. Three thin bands at even intervals are speed bumps, not proof.
 *  - **A closing run of comparison → sources → FAQ → price.** The reference
 *    carries all four; skipping them leaves the last third of the page with
 *    nothing to answer and nothing to click.
 *
 * Sections are composed here rather than inside a view component: they are
 * static server components with no shared state, exactly as the landing page
 * composes its own.
 */
export default function TrainingPage() {
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
        <TrainingHero />
        <ProofBand
          accent="green"
          heading="Sprawdzone na milionach odpowiedzi"
          sub="Examax sprawdza odpowiedzi i przelicza punkty codziennie, przy każdym zadaniu."
          figures={[
            { value: "18 420", label: "zadań w bazie" },
            { value: "2,9 mln", label: "sprawdzonych odpowiedzi" },
            { value: "41", label: "arkuszy CKE · 2015–2025" },
          ]}
        />

        <FeatureTrio
          id="matching"
          heading="Zadania dobrane pod to, czego jeszcze nie umiesz"
          sub="Examax patrzy, gdzie tracisz punkty, i podsuwa zadania, które to naprawią — nie losową serię."
          cards={[
            {
              title: "Zadania z arkuszy CKE",
              description:
                "Trenujesz na oryginalnych zadaniach z poprzednich sesji — te same polecenia, ten sam format, ta sama punktacja.",
              ctaLabel: "Zobacz bazę",
              ctaHref: "#library",
              visual: <SheetTaskVisual />,
            },
            {
              title: "Quiz do każdego tematu",
              description:
                "Krótka seria od podstaw po poziom egzaminacyjny. Dziesięć minut między lekcjami wystarczy, żeby ruszyć temat do przodu.",
              ctaLabel: "Wypróbuj za darmo",
              ctaHref: "/signup",
              visual: <QuizBuilderVisual />,
            },
            {
              title: "Powtórki wracają same",
              description:
                "Temat, który zaczynasz zapominać, wraca do kolejki kilka dni przed tym, jak wyleciałby Ci z głowy.",
              ctaLabel: "Zobacz roadmapę",
              ctaHref: "/roadmap",
              visual: <SpacedReviewVisual />,
            },
          ]}
        />

        <FeatureTrio
          id="feedback"
          heading="Sprawdzanie, które tłumaczy, a nie tylko ocenia"
          sub="Odpowiadasz i od razu wiesz, ile punktów dostałaby ta odpowiedź — i czego w niej zabrakło."
          cards={[
            {
              title: "Wynik w tej samej sekundzie",
              description:
                "Bez odsyłania pracy i bez czekania na sprawdzenie. Klikasz odpowiedź, widzisz wynik, idziesz dalej.",
              ctaLabel: "Zacznij za darmo",
              ctaHref: "/signup",
              visual: <InstantScoreVisual />,
            },
            {
              title: "Punktacja według zasad CKE",
              description:
                "Zadania otwarte rozbite na kryteria — widzisz, za co punkt jest, a za co go zabrakło.",
              ctaLabel: "Zobacz przykład",
              ctaHref: "#timed",
              visual: <RubricVisual />,
            },
            {
              title: "Agent tłumaczy Twój błąd",
              description:
                "Nie dostajesz gotowej odpowiedzi, tylko drogę do niej — i kilka podobnych zadań na sprawdzenie, czy weszło.",
              ctaLabel: "Poznaj Agenta",
              ctaHref: "/#agent",
              visual: <AgentExplainVisual />,
            },
          ]}
        />

        {/* The page's one quote, with a section to itself and somewhere to go
            after it. */}
        <Testimonial
          {...PLACEHOLDER_QUOTES.practice}
          layout="feature"
          story="/reviews"
        />

        <TimedRun />

        <FeatureTrio
          id="connected"
          heading="Trening wpięty w resztę Examaxa"
          sub="Trening nie jest osobną aplikacją. Każda odpowiedź wraca do roadmapy, statystyk i agenta."
          cards={[
            {
              title: "Roadmapa aktualizuje się sama",
              description:
                "Temat zmienia status, kiedy naprawdę go opanujesz — nie wtedy, gdy odhaczysz go ręcznie.",
              ctaLabel: "Zobacz roadmapę",
              ctaHref: "/roadmap",
              visual: <RoadmapSyncVisual />,
            },
            {
              title: "Postępy temat po temacie",
              description:
                "Opanowanie, skuteczność i tempo w jednym miejscu. Widać, co rośnie, a co od tygodnia stoi.",
              ctaLabel: "Zobacz analitykę",
              ctaHref: "/#progress",
              visual: <MasteryChartVisual />,
            },
            {
              title: "Nic nie ginie po drodze",
              description:
                "Oflagowane zadania czekają tam, gdzie je zostawiłeś — razem z tym, co wtedy zaznaczyłeś.",
              ctaLabel: "Załóż konto",
              ctaHref: "/signup",
              visual: <FlaggedVisual />,
            },
          ]}
        />

        <TaskLibrary />
        <CompareGrid
          id="compare"
          icon={PencilLine}
          accent="green"
          heading="Dlaczego nie po prostu ksero arkuszy"
          sub="Zadania zdobędziesz na kilka sposobów. Różnica zaczyna się po tym, jak zaznaczysz odpowiedź."
          caption="Porównanie Examaxa z ksero arkuszy, losowymi quizami i korepetycjami"
          columns={["Examax", "Ksero arkuszy", "Losowe quizy", "Korepetycje"]}
          rows={[
            {
              label: "Zadania z oficjalnych arkuszy CKE",
              cells: [true, true, false, "zależy"],
            },
            {
              label: "Punktacja według zasad oceniania",
              cells: [true, "sam sprawdzasz", false, true],
            },
            {
              label: "Wyjaśnienie, skąd wziął się błąd",
              cells: [true, false, false, true],
            },
            {
              label: "Podpowiada, co ćwiczyć dalej",
              cells: [true, false, false, true],
            },
            {
              label: "Pamięta, na czym stanąłeś",
              cells: [true, false, false, "częściowo"],
            },
            {
              label: "Dostępne o 22:00 w niedzielę",
              cells: [true, true, true, false],
            },
            {
              label: "Koszt miesięcznie",
              cells: ["0–59 zł", "~30 zł", "0 zł", "400–800 zł"],
            },
          ]}
        />
        <TrainingStory />
        <FaqAccordion id="training-faq" faqs={trainingFaqs} />
        <PricingTeaser
          heading="Trening zaczyna się na darmowym planie"
          sub="20 zadań dziennie, bez karty. Limit zdejmujesz wtedy, kiedy zaczyna Ci przeszkadzać."
        />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
