"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/** The library's pill is 45×25 at scale 1. */
const BADGE = { width: 45, height: 25 };

/**
 * How fast the metal drifts, as a multiple of the library's own pace. At 1
 * the stripes race across so small a pill; half speed reads as a slow sheen.
 */
const SHEEN_SPEED = 0.5;

let keeperCreated = false;

/**
 * Every badge shares one shader, so its pace is set once, globally: the
 * chromatic light preset the badge already uses, slowed to `SHEEN_SPEED`.
 */
function slowSharedSheen(metal: typeof import("metal-fx")) {
  if (!metal.isMetalFxSupported()) return;
  metal.setSharedPresetMode({ ...metal.PRESETS.chromatic.modes.light, speed: SHEEN_SPEED });
}

/**
 * metal-fx shares one WebGL context between every badge and tears it down
 * when its last instance unmounts. The torn-down context's "lost" event then
 * lands on the *next* context and marks it lost, so the metal paints one
 * frame and never moves again. React's development double mount triggers
 * exactly that, and so can leaving the page and coming back.
 *
 * One tiny, paused, off-DOM instance registered before any badge mounts
 * keeps the count above zero, so the context is never torn down. Paused, it
 * costs a single frame and nothing after.
 */
function keepSharedContextAlive(metal: typeof import("metal-fx")) {
  if (keeperCreated || !metal.isMetalFxSupported()) return;
  keeperCreated = true;
  metal.createInstance({
    hostCanvas: document.createElement("canvas"),
    cssWidth: 1,
    cssHeight: 1,
    cornerRadius: 0,
    kind: "pill",
    paused: true,
  });
}

/**
 * metal-fx renders its fallback on the server and the WebGL version in the
 * browser, which React reports as a hydration mismatch, so the badge loads
 * in the browser only. Until it does, a plain pill of the same size holds
 * its place, so nothing shifts when the metal arrives.
 */
const MetalBadge = dynamic(
  () =>
    import("metal-fx").then((metal) => {
      slowSharedSheen(metal);
      keepSharedContextAlive(metal);
      return metal.MetalBadge;
    }),
  { ssr: false, loading: () => <Placeholder scale={0.8} /> },
);

function Placeholder({ scale }: { scale: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full border border-ash bg-white text-[10px] font-medium text-charcoal"
      style={{ width: BADGE.width * scale, height: BADGE.height * scale }}
    >
      Pro
    </span>
  );
}

/**
 * The Pro mark: metal-fx's liquid-metal pill (the library's "New" badge)
 * relabelled "Pro", for features that need a paid plan.
 *
 * Pinned to the light theme because the page is always light; `auto` would
 * paint the dark metal for a visitor whose OS is in dark mode. Browsers
 * without WebGL2 get the library's plain pill.
 *
 * The library also floats a halo and catch-light around the pill's edge,
 * which flash outside the box; that layer is hidden, so all the motion stays
 * inside the pill.
 *
 * `scale` is the library's own size multiplier on its 45×25 pill; 0.8 sits
 * on the 20px line of a section eyebrow.
 */
export function ProMark({ scale = 0.8 }: { scale?: number }) {
  // The metal (a WebGL library) loads only once the mark nears the screen:
  // set up at page load it was the single most expensive script on the
  // landing page, for a pill far below the fold. Until then the plain pill
  // of the same size holds its place.
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="inline-flex shrink-0 items-center [&_.metal-fx-glow-svg]:hidden" role="img" aria-label="Funkcja Pro">
      {near ? (
        <MetalBadge theme="light" scale={scale}>
          Pro
        </MetalBadge>
      ) : (
        <Placeholder scale={scale} />
      )}
    </span>
  );
}
