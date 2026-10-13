"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { landingFaqs, type FaqItem } from "@/components/sections/faqs";

/**
 * The FAQ, as dub.co/startups sets its own (`container.png`, read off the
 * live page): one centred 768px column, the heading above, then a quiet
 * list — each question on a hairline, a "+" that turns to "×" as the answer
 * slides open. Everything starts closed, and one answer is open at a time.
 *
 * The landing page renders it as-is. /pricing passes its own questions —
 * dub.co/pricing closes on this same accordion — and a `className` for its
 * column rules.
 */
export function Faq({
  items = landingFaqs,
  heading = "Najczęściej zadawane pytania",
  className,
}: {
  items?: FaqItem[];
  heading?: string;
  className?: string;
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-heading" className={cn("col-rules border-t border-ash bg-white", className)}>
      <Container>
        <div className="relative mx-auto w-full max-w-screen-md px-3 py-14 sm:py-20 lg:px-10">
          <Reveal>
            <h2 id="faq-heading" className="mb-10 font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
              {heading}
            </h2>
          </Reveal>

          <div className="px-3 sm:px-0">
            {items.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-ash py-3 last:border-none">
                  <h3 className="flex">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-button-${index}`}
                      className="focus-ring flex flex-1 cursor-pointer items-center justify-between gap-6 rounded-sm py-4 text-left text-body-lg font-medium text-charcoal"
                    >
                      {faq.question}
                      {/* Dub's own "+", 1.5 stroke; a quarter-turn short of
                          a half makes it the "×" that closes the answer. */}
                      <svg
                        viewBox="0 0 18 18"
                        aria-hidden
                        className={cn(
                          "size-5 flex-none text-charcoal transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          open && "rotate-45",
                        )}
                      >
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                          <line x1="9" x2="9" y1="3.25" y2="14.75" />
                          <line x1="3.25" x2="14.75" y1="9" y2="9" />
                        </g>
                      </svg>
                    </button>
                  </h3>
                  {/* The answer slides open from 0fr to 1fr; closed, it is inert. */}
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    aria-hidden={!open}
                    inert={!open}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="space-y-3 pb-4 pr-11 text-body-sm text-fog sm:text-body-lg">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
