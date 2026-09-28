"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { pricingFaqs } from "@/lib/pricing";
import { PRICING_H2 } from "@/components/pricing/PricingView";

/**
 * Pricing FAQ — the reference's closing accordion
 * (Figma `105:3522`: a 768px column centred in the 1080px grid, 80px of
 * vertical padding, a 36px heading with 40px beneath it, then 688px-wide items
 * at 56px of button height inside 12px of padding, each closed by a hairline).
 *
 * Deliberately not the landing page's `Faq`: that one runs a two-column
 * heading-beside-accordion layout and answers "what is Examax", where this one
 * is a single centred column answering "what am I paying for". They share the
 * one-open-at-a-time behaviour so the two accordions feel like one control.
 *
 * The toggle glyph is a plus that rotates into a minus rather than the
 * landing page's chevron — the reference's own affordance, and the rotation
 * keeps a single element doing both states instead of swapping icons.
 */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 18 18"
      className="size-5 shrink-0 text-fog"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
    >
      {/* Only the vertical stroke turns, so the shape reads as a plus easing
          into a minus rather than as a whole icon spinning. */}
      <line
        x1="9"
        y1="3.25"
        x2="9"
        y2="14.75"
        className={cn(
          "origin-center transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] motion-reduce:transition-none",
          open && "rotate-90",
        )}
      />
      <line x1="3.25" y1="9" x2="14.75" y2="9" />
    </svg>
  );
}

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="pricing-faq-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="pb-24 pt-20">
        <Reveal>
          <h2
            id="pricing-faq-heading"
            className={cn("text-charcoal", PRICING_H2)}
          >
            Częste pytania
          </h2>
        </Reveal>

        <div className="mt-10 max-w-3xl">
          {pricingFaqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 40}>
                {/* last:border-b-0 — the reference closes the stack on the
                    section's own rule rather than on a second hairline. */}
                <div className="border-b border-ash py-3 last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`pricing-faq-panel-${index}`}
                      id={`pricing-faq-button-${index}`}
                      className="focus-ring flex h-14 w-full items-center justify-between gap-6 py-4 text-left text-body-lg font-medium leading-6 text-graphite transition-colors duration-150 hover:text-steel"
                    >
                      {faq.question}
                      <PlusMinus open={open} />
                    </button>
                  </h3>
                  <div
                    id={`pricing-faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`pricing-faq-button-${index}`}
                    hidden={!open}
                    className="pb-4"
                  >
                    <p className="text-body-lg leading-6 text-fog">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
