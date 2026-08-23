import {
  Bot,
  Brain,
  CheckCircle2,
  Compass,
  Gauge,
  Layers,
  Lightbulb,
  LineChart,
  ListChecks,
  Map,
  MessagesSquare,
  PencilLine,
  Route,
  ScanSearch,
  Target,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { Editorial } from "@/components/sections/Editorial";
import { FeatureSection } from "@/components/sections/FeatureSection";
import {
  Testimonial,
  PLACEHOLDER_QUOTES,
} from "@/components/sections/Testimonial";
import { Integrations } from "@/components/sections/Integrations";
import { Stats } from "@/components/sections/Stats";
import { Simulation } from "@/components/sections/Simulation";
import { Countdown } from "@/components/sections/Countdown";
import { AudienceWall } from "@/components/sections/AudienceWall";
import { Changelog } from "@/components/sections/Changelog";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { RoadmapShowcase } from "@/components/mockups/RoadmapShowcase";
import { PracticeShowcase } from "@/components/mockups/PracticeShowcase";
import { AgentShowcase } from "@/components/mockups/AgentShowcase";
import { AnalyticsShowcase } from "@/components/mockups/AnalyticsShowcase";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 pt-[72px]">
        <Hero />
        <ProofBar />
        <Editorial />

        <FeatureSection
          id="roadmapa"
          accent="tangerine"
          eyebrowIcon={Route}
          eyebrowLabel="Roadmapa nauki"
          heading="Wiesz dokładnie, czego się uczyć"
          sub="Cały materiał egzaminu rozpisany na tematy i kroki. Widzisz, co masz opanowane, nad czym pracujesz i co jeszcze przed Tobą — aż do dnia egzaminu."
          ctaLabel="Zobacz roadmapę"
          showcase={<RoadmapShowcase />}
          highlightIndex={0}
          subFeatures={[
            {
              icon: Map,
              title: "Cały egzamin na jednej mapie",
              description:
                "Wszystkie wymagania CKE ułożone w kolejności, która ma sens — bez zgadywania, od czego zacząć.",
            },
            {
              icon: ListChecks,
              title: "Status każdego tematu",
              description:
                "Opanowane, w trakcie, do powtórki — zawsze wiesz, na czym stoisz.",
            },
            {
              icon: Compass,
              title: "Następny krok zawsze gotowy",
              description:
                "Roadmapa wskazuje, co zrobić dziś, żeby wynik ruszył do przodu.",
            },
          ]}
        />

        <Testimonial {...PLACEHOLDER_QUOTES.roadmapa} />

        <FeatureSection
          id="trening"
          accent="green"
          eyebrowIcon={PencilLine}
          eyebrowLabel="Inteligentny trening"
          heading="Ćwicz na zadaniach z arkuszy CKE"
          sub="Oficjalne zadania egzaminacyjne i quizy do każdego tematu z roadmapy. Odpowiadasz, od razu widzisz wynik — a Twój postęp aktualizuje się sam."
          ctaLabel="Wypróbuj trening"
          showcase={<PracticeShowcase />}
          highlightIndex={1}
          subFeatures={[
            {
              icon: ScanSearch,
              title: "Zadania z prawdziwych arkuszy",
              description:
                "Trenujesz w formacie, który zobaczysz na sali — te same typy zadań, te same polecenia.",
            },
            {
              icon: Layers,
              title: "Quiz do każdego tematu",
              description:
                "Krótkie serie zadań od podstaw po poziom egzaminacyjny — idealne między lekcjami.",
            },
            {
              icon: CheckCircle2,
              title: "Wynik od razu",
              description:
                "Natychmiastowe sprawdzenie i wyjaśnienie — wiesz, co poszło dobrze i dlaczego.",
            },
          ]}
        />

        <Testimonial {...PLACEHOLDER_QUOTES.trening} />

        <FeatureSection
          id="agent"
          accent="lavender"
          eyebrowIcon={Bot}
          eyebrowLabel="Agent Examax"
          heading="Zrozum błędy i ucz się szybciej"
          sub="Agent zna Twoją roadmapę i Twoje odpowiedzi. Tłumaczy zadania krok po kroku, pokazuje, skąd wziął się błąd, i podpowiada, co ćwiczyć dalej."
          ctaLabel="Poznaj Agenta"
          showcase={<AgentShowcase />}
          highlightIndex={0}
          subFeatures={[
            {
              icon: MessagesSquare,
              title: "Wyjaśnienia krok po kroku",
              description:
                "Każde zadanie rozłożone na czynniki pierwsze — prostym językiem, bez wykładu.",
            },
            {
              icon: Brain,
              title: "Rozumie Twoje błędy",
              description:
                "Agent widzi Twoje odpowiedzi i tłumaczy dokładnie to, co sprawia trudność.",
            },
            {
              icon: Lightbulb,
              title: "Podpowiada następny ruch",
              description:
                "Po każdej rozmowie wiesz, co przećwiczyć, żeby błąd się nie powtórzył.",
            },
          ]}
        />

        <Testimonial {...PLACEHOLDER_QUOTES.agent} />

        <FeatureSection
          id="postepy"
          accent="blue"
          eyebrowIcon={LineChart}
          eyebrowLabel="Śledzenie postępów"
          heading="Wiedz, na czym stoisz"
          sub="Każda odpowiedź buduje obraz Twojego przygotowania: opanowanie tematów, skuteczność i gotowość do egzaminu — na bieżąco, bez zgadywania."
          ctaLabel="Zobacz analitykę"
          showcase={<AnalyticsShowcase />}
          highlightIndex={1}
          subFeatures={[
            {
              icon: LineChart,
              title: "Opanowanie tematów",
              description:
                "Każdy temat od pierwszej próby do pełnego opanowania — na jednym wykresie.",
            },
            {
              icon: Target,
              title: "Wykrywanie słabych punktów",
              description:
                "Examax znajduje tematy, które kosztują punkty — zanim znajdzie je egzaminator.",
            },
            {
              icon: Gauge,
              title: "Wskaźnik gotowości",
              description:
                "Jeden wynik, który pokazuje, jak blisko jesteś egzaminacyjnej formy.",
            },
          ]}
        />

        <Testimonial {...PLACEHOLDER_QUOTES.postepy} />

        <Integrations />
        <Simulation />
        <Countdown />
        <AudienceWall />
        <Stats />
        <Changelog />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
