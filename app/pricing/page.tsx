import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Plany Examax — Free, Pro, Max i Enterprise. Zacznij za darmo i zmień plan wtedy, kiedy zaczniesz potrzebować więcej.",
};

/**
 * The standalone pricing page.
 *
 * The landing page keeps its own short pricing section; this is the long form,
 * with all four tiers, the full comparison and the pricing FAQ.
 *
 * `PricingView` owns the billing period, so it owns every band that prints a
 * price. The heading and subheading are passed into it as children rather than
 * rendered inside it — static copy, no reason to ship them to the client.
 */
export default function PricingPage() {
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
        <PricingView>
          <h1
            id="pricing-heading"
            className="font-satoshi text-heading-lg font-medium text-pretty text-charcoal sm:text-display"
          >
            Plany, które rosną razem z Tobą
          </h1>
          {/* 16px under the headline — the reference's gap for this pair. */}
          <p className="mt-4 text-subheading text-steel">
            Zacznij za darmo, bez podawania karty. Kiedy dojdzie kolejny
            przedmiot albo zbliży się termin CKE, przechodzisz wyżej — i
            schodzisz z powrotem, gdy przestaje być potrzebny.
          </p>
        </PricingView>
      </main>
      <Footer />
    </>
  );
}
