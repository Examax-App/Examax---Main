import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingView } from "@/components/pricing/PricingView";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, faqStructuredData, pageMetadata } from "@/lib/seo";
import { pricingFaqs, tierPlans } from "@/lib/pricing";

/** "Free 0 zł, Pro 49 zł, Max 79 zł", read from lib/pricing so the snippet follows a price change. */
const PRICE_LIST = tierPlans.map((plan) => `${plan.name} ${plan.monthly} zł`).join(", ");

export const metadata: Metadata = pageMetadata({
  title: `Cennik: ${PRICE_LIST}`,
  description: `Plany Examax: ${PRICE_LIST} miesięcznie, Free bez karty i Enterprise dla szkół. Te same ceny dla matury i egzaminu ósmoklasisty.`,
  path: "/pricing",
  keywords: [
    "cennik Examax",
    "aplikacja do nauki do matury cena",
    "darmowa aplikacja do matury",
    "przygotowanie do egzaminu ósmoklasisty cena",
    "alternatywa dla korepetycji",
  ],
});

/**
 * The standalone pricing page — dub.co/pricing rebuilt for Examax.
 *
 * One set of prices for every exam; the exam switch in `PricingView` only
 * changes which plan is recommended.
 *
 * The heading and subheading are passed into it as children rather than
 * rendered inside it — static copy, no reason to ship them to the client.
 */
export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Cennik", path: "/pricing" }])} />
      <JsonLd data={faqStructuredData(pricingFaqs)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="relative flex-1 bg-white">
        <PricingView>
          <h1
            id="pricing-heading"
            className="animate-slide-up-fade [--offset:20px] mt-5 text-balance text-left font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
          >
            Wybierz plan dopasowany do Twojego przygotowania
          </h1>
          <p
            style={{ "--delay": "100ms" } as React.CSSProperties}
            className="animate-slide-up-fade [--offset:10px] mt-4 text-lg text-steel sm:text-xl"
          >
            Zadania CKE, roadmapa nauki, arkusze egzaminacyjne i Korepetytor AI{" "}
            {/* Unlike dub.co's, the second half stays on small screens too:
                "everything you need before the exam" is the page's key fact.
                Only the break is dropped. The dash opens the second line, so
                it never hangs on a line of its own. */}
            <br className="hidden md:inline" />
            —&nbsp;wszystko, czego potrzebujesz przed egzaminem.
          </p>
        </PricingView>
      </main>
      <Footer />
    </>
  );
}
