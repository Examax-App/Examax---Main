"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { daysUntil, E8_DATE, MATURA_DATE } from "@/lib/examDates";
import { useInView, useReducedMotion } from "@/lib/hooks";

function subscribeToNothing() {
  return () => {};
}

/**
 * Client-clock value with a null server snapshot: the server (and first
 * hydration pass) renders a placeholder, the real number appears right after
 * hydration — no mismatch, no setState-in-effect.
 */
export function useDaysUntil(target: Date) {
  return useSyncExternalStore(
    subscribeToNothing,
    () => daysUntil(target),
    () => null,
  );
}

/** Count-up from ~92% of the target once the number scrolls into view. */
export function AnimatedDays({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;
    const start = Math.round(value * 0.92);
    const duration = 1200;
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {reducedMotion ? value : display}
    </span>
  );
}

/**
 * The live exam countdown — the page's strongest emotional asset. It sits in
 * the trust band directly under the hero, not beneath the hero CTAs.
 */
export function HeroCountdown() {
  const matura = useDaysUntil(MATURA_DATE);
  const e8 = useDaysUntil(E8_DATE);

  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-fog">
      Do matury zostało{" "}
      <span className="font-medium tabular-nums text-charcoal">
        {matura === null ? "—" : <AnimatedDays value={matura} />} dni
      </span>
      <span aria-hidden>·</span>
      do egzaminu ósmoklasisty{" "}
      <span className="font-medium tabular-nums text-charcoal">
        {e8 === null ? "—" : <AnimatedDays value={e8} />} dni
      </span>
    </p>
  );
}
