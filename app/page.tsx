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
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { Editorial } from "@/components/sections/Editorial";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { Testimonial } from "@/components/sections/Testimonial";
import { Simulation } from "@/components/sections/Simulation";
import { Countdown } from "@/components/sections/Countdown";
import { AudienceWall } from "@/components/sections/AudienceWall";
import { Changelog } from "@/components/sections/Changelog";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Sparkline } from "@/components/ui/Sparkline";
import { RoadmapShowcase } from "@/components/mockups/RoadmapShowcase";
import { PracticeShowcase } from "@/components/mockups/PracticeShowcase";
import { AgentShowcase } from "@/components/mockups/AgentShowcase";
import { AnalyticsShowcase } from "@/components/mockups/AnalyticsShowcase";

/* Right-hand header payloads — compact mini-visuals so no section header
   leaves a dead column. Content is illustrative product-mock data. */

function RoadmapAside() {
  return (
    <div className="w-64 -rotate-2 rounded-cards border border-ash bg-white p-4 shadow-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-fog">
        Twój następny temat
      </p>
      <p className="mt-2 text-body-lg font-semibold text-charcoal">Procenty</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-mist">
        <div className="h-full w-[68%] rounded-full bg-lavender" />
      </div>
      <p className="mt-2 text-[12px] text-fog">
        68% opanowania · potem: Równania
      </p>
    </div>
  );
}

function TreningAside() {
  return (
    <div className="w-64 rotate-2 rounded-cards border border-ash bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-fog">
          Zadanie 14 z 19
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ash px-2 py-1 text-[11px] font-medium text-charcoal">
          <Timer className="size-3 text-lavender" aria-hidden />
          <span className="font-geist-mono tabular-nums">24:36</span>
        </span>
      </div>
      <p className="mt-2.5 text-body font-medium text-charcoal">
        Cena biletu wzrosła o 20%…
      </p>
      <p className="mt-1.5 text-[12px] text-fog">Arkusz CKE 2024 · Matematyka</p>
    </div>
  );
}

function AgentAside() {
  return (
    <div className="w-64 -rotate-2 rounded-cards border border-ash bg-white p-4 shadow-md">
      <p className="ml-auto w-fit max-w-full rounded-cards rounded-br-[4px] bg-midnight-ink px-3 py-1.5 text-[12px] text-white">
        Dlaczego 36, a nie 24?
      </p>
      <p className="mt-2 flex w-fit items-center gap-1.5 rounded-cards rounded-tl-[4px] border border-ash px-3 py-1.5 text-[12px] text-slate">
        <Sparkles className="size-3 text-lavender" aria-hidden />
        Wyjaśnienie w 3 krokach…
      </p>
      <p className="mt-2.5 text-[12px] text-fog">
        Agent zna Twoje wcześniejsze błędy
      </p>
    </div>
  );
}

function PostepyAside() {
  return (
    <div className="w-64 rotate-2 rounded-cards border border-ash bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-fog">
            Gotowość do egzaminu
          </p>
          <p className="mt-1 font-geist-mono text-heading-sm font-medium leading-none text-charcoal">
            76%
          </p>
        </div>
        <Sparkline className="h-10 w-20" />
      </div>
      <p className="mt-2.5 text-[12px] text-fog">+9 p.p. w ostatnim miesiącu</p>
    </div>
  );
}

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
        <div className="relative mx-auto w-full max-w-[1200px] bg-white">
          <Hero />
          <LogoCloud />
          <Editorial />

          <FeatureSection
            id="roadmapa"
            accent="lavender"
            eyebrowIcon={Route}
            eyebrowLabel="Roadmapa nauki"
            heading="Wiesz dokładnie, czego się uczyć"
            sub="Cały materiał egzaminu rozpisany na tematy i kroki. Widzisz, co masz opanowane, nad czym pracujesz i co jeszcze przed Tobą — aż do dnia egzaminu."
            ctaLabel="Zobacz roadmapę"
            showcase={<RoadmapShowcase />}
            highlightIndex={0}
            aside={<RoadmapAside />}
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

          {/* TODO: replace with a real, consented beta-user quote */}
          <Testimonial
            quote={
              <>
                Najbardziej pomogło mi to, że w końcu wiedziałam, czego się
                uczyć. Otwieram Examax, widzę kolejny krok z roadmapy i po
                prostu go robię — bez godziny szukania materiałów.
              </>
            }
            attribution="Uczennica, klasa maturalna"
            context="opinia z testów bety"
          />

          <FeatureSection
            id="trening"
            accent="lavender"
            eyebrowIcon={PencilLine}
            eyebrowLabel="Inteligentny trening"
            heading="Ćwicz na zadaniach z arkuszy CKE"
            sub="Oficjalne zadania egzaminacyjne i quizy do każdego tematu z roadmapy. Odpowiadasz, od razu widzisz wynik — a Twój postęp aktualizuje się sam."
            ctaLabel="Wypróbuj trening"
            showcase={<PracticeShowcase />}
            highlightIndex={1}
            aside={<TreningAside />}
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
            aside={<AgentAside />}
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

          {/* TODO: replace with a real, consented tutor quote */}
          <Testimonial
            quote={
              <>
                Pierwsze narzędzie, które pokazuje uczniom egzamin jako plan, a
                nie stos zadań. Uczniowie w końcu wiedzą, po co robią kolejne
                zadanie.
              </>
            }
            attribution="Korepetytor matematyki"
            context="opinia z testów bety"
          />

          <FeatureSection
            id="postepy"
            accent="lavender"
            eyebrowIcon={LineChart}
            eyebrowLabel="Śledzenie postępów"
            heading="Wiedz, na czym stoisz"
            sub="Każda odpowiedź buduje obraz Twojego przygotowania: opanowanie tematów, skuteczność i gotowość do egzaminu — na bieżąco, bez zgadywania."
            ctaLabel="Zobacz analitykę"
            showcase={<AnalyticsShowcase />}
            highlightIndex={1}
            aside={<PostepyAside />}
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

          <Simulation />
          <Countdown />
          <AudienceWall />
          <Changelog />
          <Pricing />
          <Faq />
        </div>
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
