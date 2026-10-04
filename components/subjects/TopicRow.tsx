"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { topicsLabel } from "@/components/subjects/pieces";

/*
 * One of dub.co/marketplace's category rows: the name on the left, the count
 * and a pair of arrows on the right, then a strip of cards that runs off the
 * column's edge. The cards are drawn on the server (`TopicCard`) and come in
 * as children; this pages the strip by a card, greys the arrows out at
 * either end, and lets it scroll by touch.
 */

export function TopicRow({ id, name, count, children }: { id: string; name: string; count: number; children: React.ReactNode }) {
  const strip = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = strip.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-4">
        <h3 id={headingId} className="text-lg font-medium text-charcoal">
          {name}
        </h3>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-body text-fog">{topicsLabel(count)}</span>
          {([-1, 1] as const).map((direction) => {
            const disabled = direction === -1 ? edges.start : edges.end;
            const Icon = direction === -1 ? ChevronLeft : ChevronRight;
            return (
              <button
                key={direction}
                type="button"
                onClick={() => page(direction)}
                disabled={disabled}
                aria-label={direction === -1 ? `${name}: poprzednie tematy` : `${name}: następne tematy`}
                className="focus-ring grid size-8 cursor-pointer place-items-center rounded-md text-charcoal transition-colors hover:bg-canvas-muted disabled:cursor-default disabled:text-smoke disabled:hover:bg-transparent"
              >
                <Icon className="size-4" strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </div>

      {/* The strip runs out past the column's right edge, as dub's does */}
      <ul
        ref={strip}
        onScroll={measure}
        className="-mr-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pr-6 [scrollbar-width:none] sm:-mr-8 sm:pr-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </section>
  );
}
