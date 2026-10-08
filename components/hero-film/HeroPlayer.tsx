"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { HeroPoster } from "@/components/hero-film/HeroPoster";
import type { FilmTab } from "@/components/hero-film/timeline";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Embeds the selected tab's loop.
 *
 * The poster — the loop's own first page, rendered on the server — is what
 * the hero shows first. The Remotion Player and the loops behind it load
 * once the visitor first moves, touches, scrolls or types (or after a few
 * seconds of stillness), so the first paint never waits on the film's code
 * and the page's opening seconds stay free for the visitor. The poster then
 * cross-fades into the playing loop, which looks the same at its first
 * frame.
 *
 * Playback is scroll-driven: the loop runs while the hero is on screen and
 * pauses once it scrolls out. Each loop plays through once and then reports
 * `onFinished`, which the tab strip uses to move on to the next tab; changing
 * tab mounts that tab's loop from its first frame. prefers-reduced-motion
 * keeps the poster.
 */
const LoopPlayer = lazy(() => import("@/components/hero-film/LoopPlayer").then((m) => ({ default: m.LoopPlayer })));

const ARM_EVENTS = ["pointermove", "pointerdown", "touchstart", "keydown", "scroll", "wheel"] as const;
/** If the visitor does nothing at all, the film starts on its own after this. */
const ARM_FALLBACK_MS = 8000;

/** True once the visitor has interacted with the page, or after the fallback. */
function useArmed() {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);
    const timer = window.setTimeout(arm, ARM_FALLBACK_MS);
    for (const type of ARM_EVENTS) window.addEventListener(type, arm, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const type of ARM_EVENTS) window.removeEventListener(type, arm);
    };
  }, [armed]);
  return armed;
}

function Poster({ tab }: { tab: FilmTab }) {
  return (
    <div inert className="pointer-events-none h-full w-full select-none overflow-hidden">
      <HeroPoster tab={tab} />
    </div>
  );
}

export function HeroPlayer({ tab, onFinished }: { tab: FilmTab; onFinished?: () => void }) {
  const reducedMotion = useReducedMotion();
  const armed = useArmed();
  if (reducedMotion || !armed) return <Poster tab={tab} />;
  // While the Player's code loads, the poster holds the frame; LoopPlayer
  // then lays the Player over its own poster and cross-fades on its first frame.
  return (
    <Suspense fallback={<Poster tab={tab} />}>
      <LoopPlayer key={tab} tab={tab} onFinished={onFinished} />
    </Suspense>
  );
}
