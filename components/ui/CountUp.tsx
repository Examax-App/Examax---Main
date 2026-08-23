"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";

/**
 * Counts up to `value` once the number scrolls into view, then holds.
 * prefers-reduced-motion renders the final figure immediately.
 *
 * Grouping happens here rather than through a `format` prop: this is a client
 * component, and functions cannot cross the server boundary.
 */
const groupPl = (value: number) =>
  value.toLocaleString("pl-PL").replace(/\u00a0/g, "\u202f");

export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;
    const duration = 1600;
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setDisplay(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {groupPl(reducedMotion ? value : display)}
    </span>
  );
}
