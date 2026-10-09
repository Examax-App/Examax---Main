import type { Metadata } from "next";
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
import { ProMark } from "@/components/ui/ProMark";
import { EXAMAX_SOCIALS } from "@/components/ui/SocialIcons";
import { JsonLd } from "@/components/layout/JsonLd";
import { CONTACT_EMAIL } from "@/lib/contact";
import { siteStructuredData } from "@/lib/seo";
// The pictures load as lazy islands — see components/landing/LazyVisuals.
import {
  AgentShowcase,
  KnowledgeSync,
  LiveProgress,
  NewSet,
  ProgressFunnel,
  ProgressProfile,
  QuestionRows,
  ReadinessDashboard,
  SheetFlow,
  SimulationShowcase,
  SubjectWindow,
  TopicFeed,
  TopicTiles,
  WeakSpots,
} from "@/components/landing/LazyVisuals";

/* Title, description and share cards are the root layout's; the landing page adds its canonical URL. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <JsonLd data={siteStructuredData({ email: CONTACT_EMAIL, sameAs: EXAMAX_SOCIALS.map((social) => social.href) })} />
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
          eyebrowLabel="Trening dopasowany do Twoich wyników"
          heading="Ćwicz na zadaniach z arkuszy CKE"
          sub="Od razu sprawdzasz wynik, a każda odpowiedź aktualizuje Twój postęp w danym temacie."
          ctaLabel="Zobacz zadania"
          ctaHref="/training"
          showcases={[<QuestionRows key="rows" />, <TopicTiles key="tiles" />, <NewSet key="set" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: ScanSearch,
              title: "Zadania z prawdziwych arkuszy",
              description:
                "Te same typy zadań i te same polecenia co w arkuszach CKE.",
            },
            {
              icon: Layers,
              title: "Arkusze z 6 lat",
              description:
                "Arkusze CKE z ostatnich sześciu lat, uporządkowane temat po temacie.",
            },
            {
              icon: QrCode,
              title: "Własne zestawy",
              description:
                "Wybierz poziom trudności i tagi, a gotowy zestaw udostępnij linkiem albo kodem QR.",
            },
          ]}
        />

        <FeatureSection
          id="roadmap"
          accent="blue"
          eyebrowIcon={Route}
          eyebrowLabel="Roadmapa nauki"
          heading="Zawsze wiesz, jaki jest następny krok"
          sub="Cały materiał egzaminu rozpisany na tematy i kroki. Widzisz, co masz opanowane, nad czym pracujesz i co jeszcze przed Tobą."
          ctaLabel="Zobacz roadmapę"
          ctaHref="/roadmap"
          showcases={[<ProgressFunnel key="funnel" />, <LiveProgress key="live" />, <ProgressProfile key="profile" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: Map,
              title: "Postęp w całym materiale",
              description:
                "Ile tematów egzaminu masz już przerobionych i opanowanych.",
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
                "Cel, seria, średni wynik i historia nauki w jednym miejscu.",
            },
          ]}
        />

        <FeatureSection
          id="progress"
          accent="tangerine"
          eyebrowIcon={BadgePercent}
          eyebrowLabel="Śledzenie postępów"
          heading="Zobacz, jak rośnie Twoje przygotowanie"
          sub="Każda odpowiedź aktualizuje opanowanie tematów, skuteczność i szacowaną gotowość do egzaminu."
          ctaLabel="Zobacz postępy"
          ctaHref="/progress"
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
                "Examax wskazuje tematy, w których najczęściej tracisz punkty.",
            },
            {
              icon: Gauge,
              title: "Wskaźnik gotowości",
              description:
                "Szacunek oparty na Twoich wynikach z zadań i arkuszy.",
            },
          ]}
        />

        <FeatureSection
          id="exam"
          accent="lavender"
          eyebrowIcon={Timer}
          eyebrowLabel="Symulacja egzaminu"
          heading="Sprawdź się w warunkach podobnych do prawdziwego egzaminu"
          wideHeading
          sub="Pełny arkusz CKE na czas, z brudnopisem jak na sali. Po oddaniu odpowiedzi są sprawdzane według zasad oceniania CKE, a Korepetytor AI pokazuje, gdzie pojawił się błąd."
          ctaLabel="Zobacz symulację"
          ctaHref="/simulation"
          showcase={<SimulationShowcase />}
        />

        <FeatureSection
          id="agent"
          accent="yellow"
          eyebrowIcon={Zap}
          eyebrowLabel="Korepetytor AI"
          eyebrowBadge={<ProMark />}
          heading="Zrozum, dlaczego popełniasz błędy"
          sub="Korepetytor AI korzysta z Twojej roadmapy i odpowiedzi. Tłumaczy zadania krok po kroku, pokazuje, skąd wziął się błąd, i podpowiada, co przećwiczyć."
          ctaLabel="Zobacz więcej"
          ctaHref="/agents"
          showcase={<AgentShowcase />}
        />

        <FeatureSection
          id="platform"
          accent="sapphire"
          eyebrowIcon={Workflow}
          eyebrowLabel="Jak wygląda nauka w Examax"
          heading="Oficjalne arkusze CKE przekształcone w codzienną naukę"
          wideHeading
          sub="Examax korzysta z oryginalnych zadań CKE, a Twoje odpowiedzi i postępy zapisują się na Twoim koncie."
          ctaLabel="Zobacz, jak to działa"
          ctaHref="/training#sources"
          showcases={[<SheetFlow key="sheets" />, <KnowledgeSync key="sync" />, <SubjectWindow key="subjects" />]}
          highlightIndex={0}
          subFeatures={[
            {
              icon: FileInput,
              title: "Aktualna baza arkuszy CKE",
              description:
                "Nowe arkusze matury i egzaminu ósmoklasisty dodajemy do bazy po ich publikacji.",
            },
            {
              icon: CloudCheck,
              title: "Wszystko na Twoim koncie",
              description:
                "Rozwiązane zadania i wyniki zostają na koncie, a postęp w każdym temacie aktualizuje się na bieżąco.",
            },
            {
              icon: Library,
              title: "Każdy przedmiot egzaminu",
              description:
                "Matematyka, polski i angielski — na maturze i egzaminie ósmoklasisty.",
            },
          ]}
        />

        <TutoringCompare />
        <Faq />
        <CtaBand
          wide
          title={
            <>
              Do egzaminu przygotowujesz się
              <br className="max-sm:hidden" /> krok po kroku.
            </>
          }
          sub="Zacznij od krótkiej diagnozy i zobacz, nad czym warto pracować."
        />
      </main>
      <Footer />
    </>
  );
}
