"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealState = "static" | "hidden" | "visible";

/** Safety net: if the observer never fires, play the animation anyway. */
const FALLBACK_MS = 1200;

/**
 * Plays the reference's slide-up-fade as content enters the viewport.
 *
 * Fail-safe by construction, in four ways:
 *  1. the server renders children fully visible;
 *  2. the hidden state is applied on mount ONLY to elements still below the
 *     current viewport, so deep links and restored scroll positions are safe;
 *  3. the observer uses a generous rootMargin and a zero threshold, so tall
 *     sections and fast scrolling still trigger it;
 *  4. a timeout reveals the element regardless if the observer never fires.
 *
 * prefers-reduced-motion opts out entirely — see globals.css.
 */
export function Reveal({
  delay = 0,
  fade = false,
  className,
  children,
}: {
  /** Stagger offset in milliseconds. */
  delay?: number;
  /**
   * Fade only, without the 10px lift. For decorative marks scattered across a
   * surface, where a slide would read as the whole scatter sliding as a block.
   */
  fade?: boolean;
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
    const reveal = () => setState("visible");
    const timer = window.setTimeout(reveal, FALLBACK_MS);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.clearTimeout(timer);
        reveal();
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );
    observer.observe(node);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        state !== "static" && "reveal",
        state !== "static" && fade && "reveal-fade",
        state === "visible" && "is-visible",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
