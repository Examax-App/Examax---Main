"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/*
 * dub.co/marketplace's featured carousel: one large card at a time with a
 * row of dots under it, the current one a wide pill. The slides themselves
 * are drawn on the server (`FeaturedSlide`); this only moves between them.
 *
 * It moves on every four seconds and does not stop under the pointer. It
 * holds only while keyboard focus is inside it, and stays put under reduced
 * motion. Picking a dot restarts the count from that slide.
 */

const INTERVAL = 4000;

export function FeaturedTopics({ slides, labels }: { slides: React.ReactNode[]; labels: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (reduced || held) return;
    const timer = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [index, held, reduced, go]);

  return (
    <div
      role="region"
      aria-roledescription="karuzela"
      aria-label="Wybrane tematy"
      onFocusCapture={(event) => setHeld((event.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="relative overflow-hidden rounded-xl border border-ash bg-white">
        <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div
              key={labels[i]}
              role="group"
              aria-roledescription="slajd"
              aria-label={`${i + 1} z ${slides.length}: ${labels[i]}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className="w-full shrink-0"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* 24px-tall targets, 24px apart dot to dot (WCAG 2.5.8); mt-2 keeps the dots where the old 16px row put them. */}
      <div className="mt-2 flex items-center justify-center gap-3.5" role="group" aria-label="Wybierz temat">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => go(i)}
            aria-label={label}
            aria-current={i === index}
            className="focus-ring grid h-6 cursor-pointer place-items-center rounded-full px-0.5"
          >
            <span className={cn("block h-1.5 rounded-full transition-all duration-300", i === index ? "w-6 bg-charcoal" : "w-1.5 bg-smoke hover:bg-fog")} />
          </button>
        ))}
      </div>
    </div>
  );
}
