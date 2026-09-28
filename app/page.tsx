import {
  BadgePercent,
  CloudCheck,
  FileInput,
  Gauge,
  Layers,
  Library,
  LineChart,
  ListChecks,
  Map,
  PencilLine,
  QrCode,
  Route,
  ScanFace,
  ScanSearch,
  Target,
  Timer,
  Workflow,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { Editorial } from "@/components/sections/Editorial";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { TutoringCompare } from "@/components/sections/TutoringCompare";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { LiveProgress, ProgressFunnel, ProgressProfile } from "@/components/mockups/ProgressStage";
import { NewSet, QuestionRows, TopicTiles } from "@/components/mockups/PracticeStage";
import { AgentShowcase } from "@/components/mockups/AgentShowcase";
import { SimulationShowcase } from "@/components/mockups/SimulationShowcase";
import { ProMark } from "@/components/ui/ProMark";
import { ReadinessDashboard, TopicFeed, WeakSpots } from "@/components/mockups/ReadinessStage";
import { KnowledgeSync, SheetFlow, SubjectWindow } from "@/components/mockups/PlatformStage";

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
      <main id="main" className="flex-1">
        <Hero />
        <ProofBar />
        <Editorial />

        <FeatureSection
          id="practice"
          accent="green"
          eyebrowIcon={PencilLine}
          eyebrowLabel="Inteligentny trening"
          heading="Ćwicz na zadaniach z arkuszy CKE"
          sub="Oficjalne zadania egzaminacyjne i quizy do każdego tematu z roadmapy. Odpowiadasz, od razu widzisz wynik — a Twój postęp aktualizuje się sam."
          ctaLabel="Zobacz zadania"
          showcases={[<QuestionRows key="rows" />, <TopicTiles key="tiles" />, <NewSet key="set" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: ScanSearch,
              title: "Zadania z prawdziwych arkuszy",
              description:
                "Trenujesz w formacie, który zobaczysz na sali — te same typy zadań, te same polecenia.",
            },
            {
              icon: Layers,
              title: "Cały materiał z 6 lat",
              description:
                "Arkusze CKE z ostatnich sześciu lat w jednym zestawie zadań — temat po temacie.",
            },
            {
              icon: QrCode,
              title: "Własne zestawy",
              description:
                "Ułóż zestaw z wybranym poziomem trudności i tagami, a potem udostępnij go linkiem albo kodem QR.",
            },
          ]}
        />

        <FeatureSection
          id="roadmap"
          accent="blue"
          eyebrowIcon={Route}
          eyebrowLabel="Roadmapa nauki"
          heading="Wiesz dokładnie, czego się uczyć"
          sub="Cały materiał egzaminu rozpisany na tematy i kroki. Widzisz, co masz opanowane, nad czym pracujesz i co jeszcze przed Tobą — aż do dnia egzaminu."
          ctaLabel="Zobacz roadmapę"
          showcases={[<ProgressFunnel key="funnel" />, <LiveProgress key="live" />, <ProgressProfile key="profile" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: Map,
              title: "Postęp w całym materiale",
              description:
                "Wszystkie tematy egzaminu i to, ile z nich masz już przerobione i opanowane.",
            },
            {
              icon: ListChecks,
              title: "Wyniki na żywo",
              description:
                "Każde rozwiązane zadanie od razu trafia do statystyk — z tematem, źródłem i punktami.",
            },
            {
              icon: ScanFace,
              title: "Twój profil postępów",
              description:
                "Cel, seria, średni wynik i historia nauki — cały Twój postęp w jednym miejscu.",
            },
          ]}
        />

        <FeatureSection
          id="progress"
          accent="tangerine"
          eyebrowIcon={BadgePercent}
          eyebrowLabel="Śledzenie postępów"
          heading="Wiedz, na czym stoisz"
          sub="Każda odpowiedź buduje obraz Twojego przygotowania: opanowanie tematów, skuteczność i gotowość do egzaminu — na bieżąco, bez zgadywania."
          ctaLabel="Zobacz postępy"
          showcases={[<TopicFeed key="feed" />, <WeakSpots key="spots" />, <ReadinessDashboard key="dashboard" />]}
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

        <FeatureSection
          id="exam"
          accent="lavender"
          eyebrowIcon={Timer}
          eyebrowLabel="Symulacja egzaminu"
          heading="Przećwicz egzamin, zanim się zacznie"
          sub="Pełny arkusz na czas, w formacie CKE. Liczysz w brudnopisie jak na sali, zaznaczasz odpowiedź, a Agent od razu ją sprawdza i pokazuje, gdzie jest błąd."
          ctaLabel="Zobacz symulację"
          ctaHref="/simulation"
          showcase={<SimulationShowcase />}
        />

        <FeatureSection
          id="agent"
          accent="yellow"
          eyebrowIcon={Zap}
          eyebrowLabel="Agent Examax"
          eyebrowBadge={<ProMark />}
          heading="Zrozum błędy i ucz się szybciej"
          sub="Agent zna Twoją roadmapę i Twoje odpowiedzi. Tłumaczy zadania krok po kroku, pokazuje, skąd wziął się błąd, i podpowiada, co ćwiczyć dalej."
          ctaLabel="Poznaj Agenta"
          showcase={<AgentShowcase />}
        />

        <FeatureSection
          id="platform"
          accent="sapphire"
          eyebrowIcon={Workflow}
          eyebrowLabel="Jak działa Examax"
          heading="Oficjalne arkusze, zamienione w naukę"
          sub="Examax bierze oryginalne zadania CKE i aktualizuje się z każdym nowym arkuszem. Twoje odpowiedzi i postępy zapisują się na Twoim koncie — w każdym przedmiocie egzaminu."
          ctaLabel="Zobacz, jak to działa"
          showcases={[<SheetFlow key="sheets" />, <KnowledgeSync key="sync" />, <SubjectWindow key="subjects" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: FileInput,
              title: "Zawsze aktualne arkusze CKE",
              description:
                "Każdy nowy arkusz CKE — matura, rozszerzenie, ósmoklasista — od razu trafia do Examaxa. Baza zadań stale się aktualizuje.",
            },
            {
              icon: CloudCheck,
              title: "Wszystko na Twoim koncie",
              description:
                "Rozwiązane zadania i wyniki zapisują się na Twoim koncie, a Examax na bieżąco śledzi postęp w każdym temacie.",
            },
            {
              icon: Library,
              title: "Każdy przedmiot egzaminu",
              description:
                "Matematyka, polski i angielski — na maturze i egzaminie ósmoklasisty, w formacie, który zobaczysz na sali.",
            },
          ]}
        />

        <TutoringCompare />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
