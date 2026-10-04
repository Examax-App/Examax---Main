import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Tracks the user's prefers-reduced-motion setting, live. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Tracks a media query, live. The server snapshot is `false`, so a query
 * that should hold on the first paint must be written as its negation.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Observes whether the referenced element is on screen. Used to pause every
 * loop, counter, and scripted demo while its section is scrolled away.
 * With `once`, it latches: the first time the element is seen it stays
 * `true` and the observer lets go — for demos that play a single time.
 */
export function useInView<T extends Element>(threshold = 0.3, once = false) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (!entry.isIntersecting) return;
          setInView(true);
          observer.disconnect();
          return;
        }
        setInView(entry.isIntersecting);
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}
