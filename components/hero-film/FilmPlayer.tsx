"use client";

import { AbsoluteFill } from "remotion";
import { Player, type PlayerRef } from "@remotion/player";
import { FrameBridge } from "@/components/hero-film/frame-bridge";

/*
 * The Remotion half of a page film (/agents, /simulation): the Player and the
 * bridge that feeds it frames. The films' markup itself is Remotion-free (it
 * draws with hero-film/anim.ts), so their posters render on the server and in
 * the first load without Remotion's runtime; this module — and Remotion with
 * it — is imported lazily, once the film is near the screen. LoopPlayer does
 * the same for the landing hero.
 */

function Composition({ film: Film }: { film: React.ComponentType }) {
  return (
    <AbsoluteFill>
      <FrameBridge>
        <Film />
      </FrameBridge>
    </AbsoluteFill>
  );
}

/** A looping, muted film with no controls of its own: the page drives it through `ref`. */
export function FilmPlayer({
  ref,
  film,
  durationInFrames,
  fps,
  width,
  height,
  poster,
}: {
  ref: React.Ref<PlayerRef>;
  film: React.ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  /** Shown while the Player readies its first frame. */
  poster: () => React.ReactNode;
}) {
  return (
    <Player
      ref={ref}
      component={Composition}
      inputProps={{ film }}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionWidth={width}
      compositionHeight={height}
      style={{ width: "100%", height: "100%" }}
      loop
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      acknowledgeRemotionLicense
      renderLoading={poster}
      initiallyMuted
      numberOfSharedAudioTags={0}
    />
  );
}
