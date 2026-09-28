"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

export type FaqItem = { question: string; answer: React.ReactNode };

/**
 * The FAQ every product page carries before its closing CTA.
 *
 * Deliberately the landing page's two-column shape rather than /pricing's
 * centred one: it answers "how does this work" like the landing accordion
 * does, and after six centred bands a page needs a left-aligned one. The
 * chevron and the one-open-at-a-time behaviour are the landing accordion's
 * too, so the two feel like the same control.
 *
 * `id` namespaces the panel ids, so two accordions can share a page without
 * their `aria-controls` colliding.
 */
export function FaqAccordion({ id, faqs }: { id: string; faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="grid gap-10 py-20 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        <Reveal>
          <h2 id={`${id}-heading`} className={cn("text-charcoal", SECTION_H2)}>
            Częste pytania
          </h2>
          <p className="mt-4 max-w-sm text-body-lg text-fog">
            Masz inne pytanie?{" "}
            <Link href="/contact" className="link-underline font-medium text-charcoal">
              Napisz do nas
            </Link>
            .
          </p>
        </Reveal>

        <div className="border-t border-ash">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 40}>
                <div className="border-b border-ash">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`${id}-panel-${index}`}
                      id={`${id}-button-${index}`}
                      className="focus-ring flex w-full items-center justify-between gap-6 py-5 text-left text-body-lg font-medium text-charcoal transition-colors duration-150 hover:text-steel"
                    >
                      {faq.question}
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-fog transition-transform duration-150 ease-out",
                          open && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    id={`${id}-panel-${index}`}
                    role="region"
                    aria-labelledby={`${id}-button-${index}`}
                    hidden={!open}
                    className="pb-5"
                  >
                    <p className="max-w-2xl text-body text-fog">{faq.answer}</p>
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
