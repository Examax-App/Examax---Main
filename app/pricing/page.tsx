import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingView } from "@/components/pricing/PricingView";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cennik",
  description:
    "Plany Examax — Free, Pro, Max i Enterprise, w tych samych cenach dla matury i egzaminu ósmoklasisty. Zacznij za darmo i zmień plan, gdy potrzebujesz więcej.",
  path: "/pricing",
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
