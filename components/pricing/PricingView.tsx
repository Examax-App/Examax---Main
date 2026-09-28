"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { CompareTable } from "@/components/pricing/CompareTable";
import { PlanCards } from "@/components/pricing/PlanCards";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { cn } from "@/lib/cn";

/**
 * The four bands of /pricing: hero, plan cards, comparison, FAQ.
 *
 * Owns the billing period for the whole page. The cards and the comparison
 * header both print prices, so the switch has to sit above both — which is
 * where the reference puts it too (Figma `105:1996`: inside the hero, 40px
 * under the text block).
 *
 * The heading and subheading arrive as `children` from the server page rather
 * than being written here: they are static copy with no reason to ship in the
 * client bundle, and this component only needs to own the band around them.
 */
/**
 * Section titles on this page sit at a flat 36px on a 40px line — the
 * reference's own ramp for them (`105:2497`, `105:3526`). Declared here rather
 * than reaching for the shared `SECTION_H2`, which climbs to 48px at `md` and
 * is what the landing page's sections use.
 */
export const PRICING_H2 =
  "font-satoshi text-3xl font-medium text-pretty sm:text-heading-lg";

export function PricingView({ children }: { children: React.ReactNode }) {
  // Yearly is the default: it is the better offer, so it is the one the page
  // opens on rather than something the reader has to go looking for.
  const [yearly, setYearly] = useState(true);

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="pricing-heading" className="col-rules bg-white">
        <Container className="pb-16 pt-20">
          {/* 672px is the reference's own measure for this block — wide enough
              for the headline to break where it wants, narrow enough that the
              subheading still reads as one column. */}
          <div className="max-w-2xl">{children}</div>

          <Reveal delay={80}>
            {/* One row, note left and switch right — the switch sits on the
                far edge of the column without changing the height it had when
                it was stacked. It wraps to two lines only when the note can no
                longer share the line. */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-body text-fog">
                Ceny w złotówkach, z VAT. Subskrypcję anulujesz jednym
                kliknięciem.
              </p>
              <BillingToggle yearly={yearly} onChange={setYearly} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 2. Plan cards ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="plans-heading"
        className="col-rules border-t border-ash bg-white"
      >
        <Container className="py-16">
          <h2 id="plans-heading" className="sr-only">
            Plany Examax
          </h2>
          <PlanCards yearly={yearly} />
        </Container>
      </section>

      {/* ── 3. Compare plans ────────────────────────────────────────────── */}
      <section
        id="compare"
        aria-labelledby="compare-heading"
        className="col-rules border-t border-ash bg-white"
      >
        <Container className="py-20">
          <Reveal>
            <h2
              id="compare-heading"
              className={cn("text-charcoal", PRICING_H2)}
            >
              Porównaj plany
            </h2>
            <p className="mt-4 max-w-md text-body-xl text-steel">
              Wszystko, co wchodzi w skład każdego planu — w jednym miejscu.
            </p>
          </Reveal>

          {/* No Reveal around the table: its transform would create a
              containing block and the sticky header would scroll away with
              the section instead of pinning under the navbar. */}
          <div className="mt-10">
            <CompareTable yearly={yearly} />
          </div>

          <Reveal delay={120}>
            <p className="mt-6 text-body text-fog">
              Uczysz w szkole lub prowadzisz organizację edukacyjną?{" "}
              <Link
                href="/contact"
                className="link-underline font-medium text-charcoal"
              >
                Napisz do nas
              </Link>{" "}
              — dobierzemy plan pod liczbę uczniów.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── 4. FAQ ──────────────────────────────────────────────────────── */}
      <PricingFaq />
    </>
  );
}
