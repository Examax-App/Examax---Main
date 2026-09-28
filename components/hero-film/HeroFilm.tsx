"use client";

import { AbsoluteFill } from "remotion";
import { FrameBridge } from "@/components/hero-film/frame";
import { RoadmapLoop } from "@/components/hero-film/loops/RoadmapLoop";
import { PracticeLoop } from "@/components/hero-film/loops/PracticeLoop";
import { ProgressLoop } from "@/components/hero-film/loops/ProgressLoop";
import type { FilmTab } from "@/components/hero-film/timeline";

/** The loop each hero tab plays. */
export const LOOPS: Record<FilmTab, () => React.ReactNode> = {
  roadmap: RoadmapLoop,
  practice: PracticeLoop,
  progress: ProgressLoop,
};

/**
 * The hero film: the selected tab's loop, as a Remotion composition.
 *
 * The reference plays one short loop per tab and leaves the tab alone — the
 * visitor picks what to watch. Each loop is the dashboard in use: a cursor
 * working through two or three screens, then the page clearing so the loop
 * can start again without a seam.
 */
export function HeroFilm({ tab }: { tab: FilmTab }) {
  const Loop = LOOPS[tab];
  return (
    // Transparent: the window's rounded top corners must show the band behind
    // the Player, not a white square poking out past the curve.
    <AbsoluteFill>
      <FrameBridge>
        <Loop />
      </FrameBridge>
    </AbsoluteFill>
  );
}
