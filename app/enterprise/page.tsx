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
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dla szkół i placówek",
  description:
    "Roadmapy, zadania CKE i postępy każdego ucznia w jednym panelu nauczyciela. Licencja dla szkół i placówek, z miesiącem pilotażu za darmo.",
  path: "/enterprise",
  social: {
    title: "Examax dla szkół — Enterprise",
    description: "Przygotuj całą szkołę do egzaminu ósmoklasisty i matury.",
  },
});

/** PLACEHOLDER COPY — terms of the pilot and the licence are illustrative. */
const FAQS = [
  {
    question: "Kto może skorzystać z Examax dla szkół?",
    answer: "Examax jest dla szkół podstawowych, liceów, techników oraz innych placówek przygotowujących uczniów do egzaminów CKE — od egzaminu ósmoklasisty po maturę.",
  },
  {
    question: "Jak wygląda pilotaż?",
    answer: "Pilotaż zaczynamy od wybranej klasy lub grupy uczniów. Przez 30 dni szkoła może sprawdzić platformę, pracę uczniów i narzędzia dla nauczycieli przed wdrożeniem na większą skalę.",
  },
  {
    question: "Jak liczona jest cena?",
    answer: "Cena zależy od liczby uczniów, klas oraz zakresu wdrożenia. Przygotowujemy indywidualną ofertę na cały okres przygotowania do egzaminów.",
  },
  {
    question: "Jak chronicie dane uczniów?",
    answer: "Dane uczniów przetwarzamy zgodnie z RODO. Zakres danych ograniczamy do informacji potrzebnych do działania platformy, a szkoła zachowuje kontrolę nad dostępem do kont i wyników.",
  },
  {
    question: "Czy uczniowie potrzebują osobnych kont?",
    answer: "Uczniowie korzystają z własnych kont Examax lub kont szkolnych — zależnie od sposobu wdrożenia wybranego przez placówkę.",
  },
  {
    question: "Czy nauczyciel widzi rozmowy ucznia z Korepetytorem AI?",
    answer: "Nie. Nauczyciele widzą wyniki nauki, aktywność i postępy uczniów, ale prywatne rozmowy z Korepetytorem AI pozostają prywatne.",
  },
  {
    question: "Co się dzieje po roku szkolnym?",
    answer: "Po zakończeniu roku szkolnego szkoła może przedłużyć licencję na kolejny okres przygotowań. Historia nauki uczniów pozostaje dostępna zgodnie z zasadami korzystania z platformy.",
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
      <JsonLd data={breadcrumbStructuredData([{ name: "Dla szkół", path: "/enterprise" }])} />
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
