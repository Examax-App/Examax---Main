"use client";

import { useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * A single digit that spins into place like a slot reel: once, the first
 * time it scrolls into view, it runs a full turn of 0–9 and settles on
 * `value`. Reduced motion shows the digit at rest.
 */
export function SpinNumber({ value, className }: { value: number; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const reducedMotion = useReducedMotion();
  const [spun, setSpun] = useState(false);

  // Latch: the reel turns once, not every time the section re-enters view.
  // Set during render (React's pattern for state derived from a change), so
  // no extra effect pass.
  if (inView && !spun) setSpun(true);

  // One full turn, then on to the value: 0…9, 0…value.
  const reel = [...Array.from({ length: 10 }, (_, i) => i), ...Array.from({ length: value + 1 }, (_, i) => i)];
  const stop = reel.length - 1;
  const at = reducedMotion || spun ? stop : 0;

  return (
    <span ref={ref} className={cn("relative inline-flex h-[1lh] overflow-hidden align-top tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span
        aria-hidden
        className={cn("flex flex-col", !reducedMotion && "transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]")}
        style={{ transform: `translateY(${-at * 100}%)` }}
      >
        {reel.map((digit, i) => (
          <span key={i} className="h-[1lh]">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}
