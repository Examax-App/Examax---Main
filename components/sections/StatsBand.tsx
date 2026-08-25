"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useInView, useReducedMotion } from "@/lib/hooks";

/**
 * TODO: fill in the real figures before launch — never invent numbers.
 * A `null` value renders as an em-dash placeholder (no count-up).
 */
const stats: Array<{ label: string; value: number | null; suffix?: string }> = [
  { label: "Zadań w bazie", value: null },
  { label: "Arkuszy CKE", value: null },
  { label: "Tematów w roadmapach", value: null },
];

function CountUp({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;
    const duration = 1400;
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {(reducedMotion ? value : display).toLocaleString("pl-PL")}
    </span>
  );
}

/**
 * Quantitative-proof band — the "built on the real exam" spine. Numbers are
 * strictly real; unfilled slots show an honest placeholder until the actual
 * figures land (see TODO above).
 */
export function StatsBand() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="border-t border-ash bg-paper-mist"
    >
      <Container className="py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2
              id="stats-heading"
              className="max-w-sm font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
            >
              Zbudowany na prawdziwym egzaminie
            </h2>
            <p className="mt-5 max-w-md text-body-xl text-steel">
              Nie wymyślamy zadań — porządkujemy te, które naprawdę pojawiają
              się na egzaminach, i uczymy Cię je rozwiązywać.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <dl className="grid gap-px overflow-hidden rounded-largecards border border-ash bg-ash sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-7">
                  <dd className="font-geist-mono text-heading font-medium leading-none text-electric-blue sm:text-heading-lg">
                    {stat.value === null ? (
                      /* TODO: real figure pending */
                      <span aria-label="dane w przygotowaniu">—</span>
                    ) : (
                      <>
                        <CountUp value={stat.value} />
                        {stat.suffix}
                      </>
                    )}
                  </dd>
                  <dt className="mt-3 text-body font-medium text-steel">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[12px] text-fog">
              Liczby uzupełnimy po najbliższej aktualizacji bazy — nie
              publikujemy szacunków.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
