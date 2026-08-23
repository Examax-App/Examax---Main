"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Icons arrive as pre-rendered nodes (not component references) so a server
 * component can pass them across the client boundary; color is applied here
 * via currentColor inheritance.
 */
export type TriadItem = {
  iconNode: React.ReactNode;
  title: string;
  description: string;
};

/**
 * The reference feature strip: an 800px-wide 3-column row below the demo
 * band. The divider system is deliberately neutral — a 1px #e5e5e5 rule on
 * every column, and a #171717 fill sliding down the active column's rule as a
 * 4s progress indicator. Colour lives in the section eyebrow, not here.
 */
export function FeatureTriad({
  items,
  initialIndex,
}: {
  items: TriadItem[];
  initialIndex: number;
}) {
  const [active, setActive] = useState(initialIndex);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-advance while the row is on screen and not hovered.
  useEffect(() => {
    if (!inView || hovered || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % items.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [inView, hovered, reducedMotion, items.length]);

  return (
    <div
      ref={wrapperRef}
      className="mx-auto grid w-full max-w-[800px] gap-y-8 px-5 py-8 md:grid-cols-3 md:gap-x-10"
      onMouseLeave={() => setHovered(false)}
    >
      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <article
            key={item.title}
            onMouseEnter={() => {
              setHovered(true);
              setActive(index);
            }}
            onFocus={() => setActive(index)}
            className={cn(
              "relative h-full border-t border-ash pt-4 md:border-t-0 md:pl-6 md:pr-2 md:pt-0",
              isActive && "max-md:border-t-2 max-md:border-t-charcoal",
            )}
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 hidden h-full w-px overflow-hidden bg-ash md:block"
            >
              {isActive ? (
                <span
                  key={`${active}-${hovered}`}
                  className={cn(
                    "block h-full w-px bg-charcoal",
                    !hovered && !reducedMotion && "animate-triad-progress",
                  )}
                />
              ) : null}
            </span>
            <span
              aria-hidden
              className={cn(
                "block w-fit transition-colors duration-300",
                isActive ? "text-silver" : "text-smoke",
              )}
            >
              {item.iconNode}
            </span>
            <h3
              className={cn(
                "mt-2 text-body font-medium transition-colors duration-300",
                isActive ? "text-charcoal" : "text-silver",
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "mt-2 text-body leading-5 transition-colors duration-300",
                isActive ? "text-fog" : "text-smoke",
              )}
            >
              {item.description}
            </p>
            <a
              href="#cennik"
              className={cn(
                "focus-ring group/link mt-3.5 inline-flex items-center gap-1 rounded-[4px] text-body font-medium transition-colors duration-300",
                isActive ? "text-charcoal" : "text-smoke",
              )}
            >
              Dowiedz się więcej
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5",
                  isActive && "translate-x-0.5",
                )}
                aria-hidden
              />
            </a>
          </article>
        );
      })}
    </div>
  );
}
