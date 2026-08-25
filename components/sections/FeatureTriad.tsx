"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/* Stacked layout (<md): the accent moves from a left bar to a top border. */
const accentTopBorder: Record<Accent, string> = {
  tangerine: "max-md:border-t-2 max-md:border-t-tangerine",
  green: "max-md:border-t-2 max-md:border-t-vivid-green",
  lavender: "max-md:border-t-2 max-md:border-t-lavender",
  blue: "max-md:border-t-2 max-md:border-t-electric-blue",
};

/**
 * The three-column feature row under each demo. Every column renders at full
 * contrast; the accent bar and colored icon mark the active column, following
 * hover and auto-advancing gently while in view. Never dims siblings —
 * emphasis is additive, not subtractive.
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
  const columnRefs = useRef<Array<HTMLElement | null>>([]);
  const [bar, setBar] = useState<{ left: number; top: number; height: number } | null>(null);

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

  // Auto-advance the accent while the row is on screen and not hovered.
  useEffect(() => {
    if (!inView || hovered || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % items.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [inView, hovered, reducedMotion, items.length]);

  const measure = useCallback(() => {
    const column = columnRefs.current[active];
    if (!column) return;
    setBar({
      left: column.offsetLeft,
      top: column.offsetTop,
      height: column.offsetHeight,
    });
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div
      ref={wrapperRef}
      className="relative mt-10 grid gap-10 sm:mt-12 md:grid-cols-3 md:gap-8"
      onMouseLeave={() => setHovered(false)}
    >
      {bar ? (
        <span
          aria-hidden
          className={cn(
            "absolute hidden w-0.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:block",
            accentBg[accent],
          )}
          style={{ left: bar.left, top: bar.top, height: bar.height }}
        />
      ) : null}

      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <article
            key={item.title}
            ref={(el) => {
              columnRefs.current[index] = el;
            }}
            onMouseEnter={() => {
              setHovered(true);
              setActive(index);
            }}
            onFocus={() => setActive(index)}
            className={cn(
              "h-full border-t border-ash pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0",
              isActive && accentTopBorder[accent],
            )}
          >
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
                "mt-4 text-body-lg font-medium transition-colors duration-300",
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
                "focus-ring group/link mt-4 inline-flex items-center gap-1 rounded-[4px] text-body font-medium transition-colors duration-300",
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
