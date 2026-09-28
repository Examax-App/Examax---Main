"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import { Player } from "@remotion/player";
import { HeroFilm } from "@/components/hero-film/HeroFilm";
import { HeroPoster } from "@/components/hero-film/HeroPoster";
import { FPS, HEIGHT, LOOP, WIDTH, type FilmTab } from "@/components/hero-film/timeline";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Embeds the selected tab's loop.
 *
 * Playback is scroll-driven: the loop runs while the hero is on screen and
 * pauses once it scrolls out. Each loop plays through once and then reports
 * `onFinished`, which the tab strip uses to move on to the next tab; changing
 * tab mounts that tab's loop from its first frame.
 *
 * The tab's poster stays underneath until the player reports its first frame,
 * so the hero never flashes empty. prefers-reduced-motion skips the player and
 * keeps the poster.
 */
export function HeroPlayer({ tab, onFinished }: { tab: FilmTab; onFinished?: () => void }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return (
      <div className="pointer-events-none h-full w-full select-none overflow-hidden">
        <HeroPoster tab={tab} />
      </div>
    );
  }
  return <LoopPlayer key={tab} tab={tab} onFinished={onFinished} />;
}

function LoopPlayer({ tab, onFinished }: { tab: FilmTab; onFinished?: () => void }) {
  const ref = useRef<PlayerRef>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Play while the hero is in view, pause once it leaves. Browsers without
  // IntersectionObserver fall back to playing on mount.
  useEffect(() => {
    const player = ref.current;
    const el = stage.current;
    if (!player || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      player.play();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) player.play();
        else player.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hand over to the next tab once this loop has played through.
  useEffect(() => {
    const player = ref.current;
    if (!player || !onFinished) return;
    player.addEventListener("ended", onFinished);
    return () => player.removeEventListener("ended", onFinished);
  }, [onFinished]);

  // Cross-fade the poster out on the first rendered frame.
  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const onFrame = () => setReady(true);
    player.addEventListener("frameupdate", onFrame);
    return () => player.removeEventListener("frameupdate", onFrame);
  }, []);

  return (
    // The film is a picture, not a page: nothing in it can be hovered,
    // clicked or selected, so the pointer passes straight through it the way
    // it would over a video. The caption card sits outside this box and stays
    // interactive.
    <div ref={stage} className="pointer-events-none relative h-full w-full select-none overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
        style={{ opacity: ready ? 0 : 1 }}
      >
        <HeroPoster tab={tab} />
      </div>
      <div
        className="h-full w-full transition-opacity duration-500 motion-reduce:transition-none"
        style={{ opacity: ready ? 1 : 0 }}
      >
        <Player
          ref={ref}
          component={HeroFilm}
          inputProps={{ tab }}
          durationInFrames={LOOP[tab]}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
          renderLoading={() => <HeroPoster tab={tab} />}
          initiallyMuted
          numberOfSharedAudioTags={0}
        />
      </div>
    </div>
  );
}
