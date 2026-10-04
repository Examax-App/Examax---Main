"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Where "Dowiedz się więcej" goes — the section's own page; pricing if left out. */
  href?: string;
};

/**
 * The reference feature strip: a 3-column row below the demo band, spanning
 * the full 1080px content column so its dividers line up with the page rules
 * instead of cutting across the middle of the band. The divider system is deliberately neutral — a 1px #e5e5e5 rule on
 * every column, and a #171717 fill sliding down the active column's rule as a
 * 4s progress indicator. Colour lives in the section eyebrow, not here.
 */
export function FeatureTriad({
  items,
  initialIndex,
  active: controlledActive,
  onActiveChange,
}: {
  items: TriadItem[];
  initialIndex: number;
  /**
   * Optional control from above, for a demo band that swaps its picture with
   * the active column (see FeatureStage). Left out, the strip runs itself.
   */
  active?: number;
  onActiveChange?: (index: number) => void;
}) {
  const [ownActive, setOwnActive] = useState(initialIndex);
  const active = controlledActive ?? ownActive;
  const setActive = useCallback(
    (value: number) => {
      setOwnActive(value);
      onActiveChange?.(value);
    },
    [onActiveChange],
  );
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

  // Auto-advance while the row is on screen and not hovered. The timer
  // restarts whenever the column changes, in step with the progress rule.
  useEffect(() => {
    if (!inView || hovered || reducedMotion) return;
    const timer = window.setTimeout(() => setActive((active + 1) % items.length), 4000);
    return () => window.clearTimeout(timer);
  }, [active, inView, hovered, reducedMotion, items.length, setActive]);

  return (
    <div
      ref={wrapperRef}
      className="mx-auto grid w-full max-w-[1080px] gap-y-8 px-5 py-10 sm:px-10 md:grid-cols-3 md:gap-x-12"
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
              // The whole column is the hover target that drives the strip, so
              // it takes the pointer even though only the link inside it
              // navigates.
              "relative h-full cursor-pointer border-t border-ash pt-4 md:border-t-0 md:pl-6 md:pr-2 md:pt-0",
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
                // The reference draws these near-black and dims the whole
                // column when inactive, which is what gives them weight. Only
                // side by side, though: stacked on a phone the picture they
                // drive is off-screen, so dimmed entries would just look
                // switched off — there every entry stays at full contrast.
                "block w-fit transition-colors duration-300",
                isActive ? "text-charcoal" : "text-charcoal md:text-charcoal/35",
              )}
            >
              {item.iconNode}
            </span>
            <h3
              className={cn(
                "mt-2 text-body font-medium transition-colors duration-300",
                isActive ? "text-charcoal" : "text-charcoal md:text-silver",
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "mt-2 text-body leading-5 transition-colors duration-300",
                isActive ? "text-fog" : "text-fog md:text-smoke",
              )}
            >
              {item.description}
            </p>
            <a
              href={item.href ?? "/pricing"}
              className={cn(
                "focus-ring group/link mt-3.5 inline-flex items-center gap-1 rounded-[4px] text-body font-medium transition-colors duration-300",
                isActive ? "text-charcoal" : "text-charcoal md:text-smoke",
              )}
            >
              Dowiedz się więcej
              {/* A small, smooth nudge to the right on hover — nothing else. */}
              <ChevronRight
                className="size-4 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
          </article>
        );
      })}
    </div>
  );
}
