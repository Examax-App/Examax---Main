"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealState = "static" | "hidden" | "visible";

/**
 * Fades content in with a slight upward drift as it enters the viewport.
 *
 * Fail-safe by construction: the server renders children fully visible, and
 * the pre-reveal (hidden) state is applied on mount ONLY to elements still
 * below the current viewport. Deep links (#cennik), restored scroll
 * positions, above-fold content, disabled JS, and prefers-reduced-motion all
 * see finished, fully-opaque content — never a blank region.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  /** Stagger offset in milliseconds. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Anything at or above the current viewport stays static — hiding it
    // after paint would flash, and elements above a restored scroll position
    // would otherwise never intersect and stay invisible forever.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.95) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        state !== "static" && "reveal",
        state === "visible" && "is-visible",
        className,
      )}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
