import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Faq } from "@/components/sections/Faq";
import { EnterpriseHero } from "@/components/enterprise/EnterpriseHero";
import { CoverageBand, OfferSection } from "@/components/enterprise/OfferSection";
import { ScaleSection } from "@/components/enterprise/ScaleSection";
import { ToolkitSection } from "@/components/enterprise/ToolkitSection";
import { CommunitySection, EligibilitySection, PlatformCanvas, SecuritySection } from "@/components/enterprise/TrustSections";
import { TrialBand } from "@/components/enterprise/TrialBand";

export const metadata: Metadata = {
  title: "Examax dla szkół",
  description:
    "Roadmapy, zadania CKE i postępy każdego ucznia w jednym panelu nauczyciela. Licencja dla szkół i placówek, z miesiącem pilotażu za darmo.",
  openGraph: {
    title: "Examax dla szkół — Enterprise",
    description: "Przygotuj całą szkołę do egzaminu ósmoklasisty i matury.",
    url: "https://examax.app/enterprise",
  },
};

/** PLACEHOLDER COPY — terms of the pilot and the licence are illustrative. */
const FAQS = [
  {
    question: "Kto może skorzystać z Examax dla szkół?",
    answer: "Szkoły podstawowe, licea, technika, szkoły językowe i samorządy — każda placówka, która przygotowuje uczniów do egzaminów CKE.",
  },
  {
    question: "Jak wygląda pilotaż?",
    answer: "Jedna klasa korzysta z pełnej wersji przez 30 dni bez opłat. Nauczyciel dostaje panel i raporty od pierwszego dnia.",
  },
  {
    question: "Jak liczona jest cena?",
    answer: "Cenę ustalamy indywidualnie, według liczby uczniów i klas, na cały rok szkolny — nie zmienia się aż do egzaminu.",
  },
  {
    question: "Jak chronicie dane uczniów?",
    answer: "Podpisujemy z placówką umowę powierzenia danych, przechowujemy dane w Unii Europejskiej i szyfrujemy je w spoczynku i w transmisji.",
  },
  {
    question: "Czy uczniowie potrzebują osobnych kont?",
    answer: "Nie. Importujemy listy klas, a uczniowie logują się kontem szkoły — Microsoft 365 albo Google Workspace.",
  },
  {
    question: "Czy nauczyciel widzi rozmowy ucznia z Korepetytorem AI?",
    answer: "Nie. Nauczyciel widzi postępy, wyniki i gotowość, ale rozmowy z Korepetytorem AI pozostają prywatne.",
  },
  {
    question: "Co się dzieje po roku szkolnym?",
    answer: "Licencję można przedłużyć na kolejny rocznik. Uczniowie, którzy zdali egzamin, zachowują dostęp do swojej historii nauki.",
  },
];

/**
 * The enterprise route — "Dla Instytucji" in the navbar. dub.co/startups and
 * dub.co/enterprise merged into one page (`DesignRules/forInstitutions.png`,
 * both pages read off their live DOM on 2026-10-01):
 *
 *   startups   hero + "Acme" canvas        → EnterpriseHero
 *   startups   "Migrated off …" band       → CoverageBand
 *   startups   plan box + day-strip terms  → OfferSection #offer
 *   enterprise scalability, support, SSO   → ScaleSection #scale
 *   startups   partner program stack       → ToolkitSection #toolkit
 *   enterprise data security               → SecuritySection #security
 *   enterprise open source                 → CommunitySection #community
 *   startups   program eligibility         → EligibilitySection #eligibility
 *   startups   "Start where great …" canvas→ PlatformCanvas
 *   startups   FAQ                         → Faq
 *   enterprise trial band (form left out)  → TrialBand #trial
 *
 * The references' customer quotes are left out (no real testimonials yet).
 */
export default function EnterprisePage() {
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
        <EnterpriseHero />
        <CoverageBand />
        <OfferSection />
        <ScaleSection />
        <ToolkitSection />
        <SecuritySection />
        <CommunitySection />
        <EligibilitySection />
        <PlatformCanvas />
        <Faq items={FAQS} className="col-rules-fade" />
        <TrialBand />
      </main>
      <Footer />
    </>
  );
}
