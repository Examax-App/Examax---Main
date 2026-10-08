"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import { Player } from "@remotion/player";
import { HeroFilm } from "@/components/hero-film/HeroFilm";
import { HeroPoster } from "@/components/hero-film/HeroPoster";
import { FPS, HEIGHT, LOOP, WIDTH, type FilmTab } from "@/components/hero-film/timeline";

/**
 * The hero's live loop: the Remotion Player over the tab's poster. Split out
 * of HeroPlayer so the Player and the loops load only once the hero is armed
 * (see HeroPlayer); until then the poster alone is on screen.
 */
export function LoopPlayer({ tab, onFinished }: { tab: FilmTab; onFinished?: () => void }) {
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
    <div ref={stage} inert className="pointer-events-none relative h-full w-full select-none overflow-hidden">
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
