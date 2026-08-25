"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
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

const accentBg: Record<Accent, string> = {
  tangerine: "bg-tangerine",
  green: "bg-vivid-green",
  lavender: "bg-lavender",
  blue: "bg-electric-blue",
};

/* Stacked layout (<md): the accent moves from a left track to a top border. */
const accentTopBorder: Record<Accent, string> = {
  tangerine: "max-md:border-t-2 max-md:border-t-tangerine",
  green: "max-md:border-t-2 max-md:border-t-vivid-green",
  lavender: "max-md:border-t-2 max-md:border-t-lavender",
  blue: "max-md:border-t-2 max-md:border-t-electric-blue",
};

/**
 * The reference feature strip: an 800px-wide 3-column tab row on white below
 * the demo band. Every column carries a 1px grey track on its left edge; the
 * active column's track fills with the accent as a 4s progress indicator,
 * and the two inactive columns genuinely recede.
 */
export function FeatureTriad({
  accent,
  items,
  initialIndex,
}: {
  accent: Accent;
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
              isActive && accentTopBorder[accent],
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
                    "block h-full w-px",
                    accentBg[accent],
                    !hovered && !reducedMotion && "animate-triad-progress",
                  )}
                />
              ) : null}
            </span>
            <span
              aria-hidden
              className={cn(
                "block w-fit transition-colors duration-300",
                isActive ? accentStyles[accent].text : "text-silver",
              )}
            >
              {item.iconNode}
            </span>
            <h3
              className={cn(
                "mt-2 text-body-lg font-medium transition-colors duration-300",
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
                isActive ? accentStyles[accent].text : "text-smoke",
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
