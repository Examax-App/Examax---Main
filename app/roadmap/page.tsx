import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, GitBranch, RefreshCcw, Route, Smartphone } from "lucide-react";
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
import { RoadmapHero } from "@/components/roadmap/RoadmapHero";
import { ProgressGlance } from "@/components/roadmap/ProgressGlance";
import { ActivityStream } from "@/components/roadmap/ActivityStream";
import { PlanRun } from "@/components/roadmap/PlanRun";
import { SubjectMap } from "@/components/roadmap/SubjectMap";
import { RoadmapStory } from "@/components/roadmap/RoadmapStory";
import { roadmapFaqs } from "@/components/roadmap/roadmapFaqs";
import {
  DateShiftVisual,
  GapsVisual,
  MasteryFromAnswersVisual,
  ReviewInjectVisual,
  StagesVisual,
  StatusListVisual,
  SyllabusVisual,
  WeightingVisual,
} from "@/components/roadmap/RoadmapVisuals";

export const metadata: Metadata = {
  title: "Roadmapa nauki",
  description:
    "Cały materiał egzaminu rozpisany na tematy, etapy i tygodnie — z planem liczonym do dnia egzaminu CKE i statusem każdego tematu.",
  openGraph: {
    title: "Roadmapa nauki — Examax",
    description:
      "Wymagania CKE ułożone w kolejności, która ma sens. Widzisz, co masz opanowane i co robić dziś.",
    url: "https://examax.app/roadmap",
  },
};

/**
 * The roadmap route — the long form of the landing page's `#roadmap` section,
 * and the destination behind the navbar's "Roadmapa nauki" card.
 *
 * Structure is the same product-page anatomy /training runs on, so the two
 * read as one family: washed hero over a wall of product objects, a proof band
 * second, three hairline-divided feature trios, one promoted quote, a single
 * moving panel, the product's own browser screen, then comparison → sources →
 * FAQ → price before the shared closing CTA.
 *
 * What differs is what a roadmap actually is. The hero wall runs horizontally
 * rather than vertically, because a plan runs along a time axis; the one live
 * element is a real countdown to the CKE date rather than a stopwatch; and the
 * page leads on blue, where Trening leads on green.
 */
export default function RoadmapPage() {
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
        <RoadmapHero />

        <ProofBand
          accent="blue"
          heading="Ułożone według wymagań CKE"
          sub="Kolejność wynika z wymagań i z daty egzaminu, nie z układu podręcznika."
          figures={[
            { value: "1 240", label: "tematów w roadmapach" },
            { value: "412 tys.", label: "kroków zaliczonych przez uczniów" },
            { value: "6", label: "roadmap · E8 i matura" },
          ]}
        />

        <ProgressGlance />

        {/* Wide first, then compact — the reference alternates densities
            rather than stacking three identical trios, and these two blocks
            are the ones that actually need the extra width. */}
        <FeatureDuo
          id="syllabus"
          accent="blue"
          eyebrowIcon={Route}
          eyebrowLabel="Zakres roadmapy"
          heading="Cały egzamin na jednej mapie"
          sub="Wymagania CKE ułożone w kolejności, która ma sens — bez zgadywania, od czego zacząć."
          cards={[
            {
              title: "Wszystkie wymagania CKE",
              description: (
                <>
                  Każdy punkt podstawy rozpisany na tematy, które go zamykają —
                  nic nie zostaje poza mapą. Zakres bierzemy z{" "}
                  <Link href="#sources" className="font-medium text-charcoal underline decoration-smoke underline-offset-2 transition-colors duration-150 hover:decoration-charcoal">
                    informatorów i wymagań egzaminacyjnych
                  </Link>
                  , nie ze spisu treści podręcznika.
                </>
              ),
              ctaLabel: "Zobacz roadmapę",
              ctaHref: "#map",
              visual: <SyllabusVisual />,
            },
            {
              title: "Rozpisane na etapy i tygodnie",
              description: (
                <>
                  Rok podzielony na trzy etapy z własnym zakresem, żeby maj nie
                  był jednym wielkim nadrabianiem. Liczba tematów na tydzień
                  wynika z{" "}
                  <Link href="#plan" className="font-medium text-charcoal underline decoration-smoke underline-offset-2 transition-colors duration-150 hover:decoration-charcoal">
                    liczby tygodni, które faktycznie zostały
                  </Link>
                  .
                </>
              ),
              ctaLabel: "Zobacz plan",
              ctaHref: "#plan",
              visual: <StagesVisual />,
            },
          ]}
        />

        <FeatureQuad
          label="Pozostałe możliwości roadmapy"
          cards={[
            {
              icon: GitBranch,
              accent: "blue",
              title: "Kolejność z zależności",
              description:
                "Temat wchodzi dopiero wtedy, gdy masz już czym go zrozumieć.",
              ctaLabel: "Skąd ta kolejność",
              ctaHref: "#sources",
            },
            {
              icon: Gauge,
              accent: "sapphire",
              title: "Własne tempo",
              description:
                "Ustawiasz, ile godzin w tygodniu realnie masz. Plan liczy się od tego.",
              ctaLabel: "Ułóż roadmapę",
              ctaHref: "/signup",
            },
            {
              icon: RefreshCcw,
              accent: "lavender",
              title: "Powtórki w tle",
              description:
                "Stary materiał wraca sam, bez dopisywania go do listy.",
              ctaLabel: "Zobacz trening",
              ctaHref: "/training",
            },
            {
              icon: Smartphone,
              accent: "green",
              title: "Plan na telefonie",
              description:
                "Ten sam plan w kieszeni; postęp synchronizuje się między urządzeniami.",
              ctaLabel: "Załóż konto",
              ctaHref: "/signup",
            },
          ]}
        />

        <FeatureTrio
          id="status"
          heading="Zawsze wiesz, na czym stoisz"
          sub="Status każdego tematu liczony z Twoich odpowiedzi, nie z tego, co odhaczysz ręcznie."
          cards={[
            {
              title: "Status każdego tematu",
              description:
                "Opanowane, w trakcie, do powtórki, zablokowane. Jedno spojrzenie i wiesz, gdzie jesteś.",
              ctaLabel: "Załóż konto",
              ctaHref: "/signup",
              visual: <StatusListVisual />,
            },
            {
              title: "Opanowanie liczone z odpowiedzi",
              description:
                "Temat zmienia status, kiedy naprawdę zaczyna Ci wychodzić — a nie kiedy go przeczytasz.",
              ctaLabel: "Zobacz trening",
              ctaHref: "/training",
              visual: <MasteryFromAnswersVisual />,
            },
            {
              title: "Braki wychodzą same",
              description:
                "Examax pilnuje tematów, które cicho osuwają się w dół, i wpisuje je z powrotem do planu.",
              ctaLabel: "Zobacz analitykę",
              ctaHref: "/#progress",
              visual: <GapsVisual />,
            },
          ]}
        />

        {/* The page's one quote, with a section to itself and somewhere to go
            after it. */}
        <Testimonial
          {...PLACEHOLDER_QUOTES.roadmap}
          layout="feature"
          story="/reviews"
        />

        <PlanRun />

        <FeatureTrio
          id="adapt"
          heading="Plan, który zmienia się razem z Tobą"
          sub="Przesunięty termin, słabszy tydzień, zaległy temat — roadmapa przelicza się sama."
          cards={[
            {
              title: "Zmieniasz termin, plan się przelicza",
              description:
                "Inna data egzaminu to inne tempo — materiał rozkłada się na tyle tygodni, ile faktycznie zostało.",
              ctaLabel: "Ułóż roadmapę",
              ctaHref: "/signup",
              visual: <DateShiftVisual />,
            },
            {
              title: "Słabe tematy dostają więcej miejsca",
              description:
                "Tydzień dzieli się według tego, gdzie tracisz punkty, a nie po równo między tematy.",
              ctaLabel: "Zobacz plan tygodnia",
              ctaHref: "#plan",
              visual: <WeightingVisual />,
            },
            {
              title: "Powtórki wpinają się same",
              description:
                "Stary materiał wraca w wolne miejsca, zanim zdąży wypaść Ci z głowy.",
              ctaLabel: "Zobacz trening",
              ctaHref: "/training",
              visual: <ReviewInjectVisual />,
            },
          ]}
        />

        <ActivityStream />

        <SubjectMap />

        <CompareGrid
          id="compare"
          icon={Route}
          accent="blue"
          heading="Dlaczego nie po prostu spis treści podręcznika"
          sub="Listę tematów znajdziesz w każdym podręczniku. Różnica jest w tym, czy plan wie, gdzie jesteś."
          caption="Porównanie roadmapy Examaxa ze spisem treści podręcznika, własnym planem i korepetytorem"
          columns={[
            "Examax",
            "Spis treści podręcznika",
            "Plan w zeszycie",
            "Korepetytor",
          ]}
          rows={[
            {
              label: "Pełne wymagania CKE na Twój poziom",
              cells: [true, "część", "zależy", true],
            },
            {
              label: "Kolejność wynika z zależności między tematami",
              cells: [true, true, false, true],
            },
            {
              label: "Przeliczony do dnia egzaminu",
              cells: [true, false, "raz, na start", "częściowo"],
            },
            {
              label: "Wie, co masz opanowane",
              cells: [true, false, false, true],
            },
            {
              label: "Przelicza się, gdy wypadniesz z rytmu",
              cells: [true, false, false, true],
            },
            {
              label: "Dostępny o 22:00 w niedzielę",
              cells: [true, true, true, false],
            },
            {
              label: "Koszt miesięcznie",
              cells: ["0–59 zł", "~50 zł raz", "0 zł", "400–800 zł"],
            },
          ]}
        />

        <RoadmapStory />
        <FaqAccordion id="roadmap-faq" faqs={roadmapFaqs} />
        <PricingTeaser
          heading="Pierwsza roadmapa jest za darmo"
          sub="Jeden przedmiot, pełny plan, bez karty. Kolejne dokładasz wtedy, kiedy będą potrzebne."
        />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
