/**
 * The hero film's timing.
 *
 * The reference (dub.co's hero) gives every tab its own short loop of the
 * product in use, and the selected tab loops until another is picked — there
 * is no intro and no reel that walks the tabs by itself. So there are three
 * loops here, one per tab, each with its own length.
 *
 * Every beat inside a loop is written in seconds and converted with `s()`, so
 * the storyboard reads as a script.
 */
export const FPS = 30;

/** Composition pixel size. The Player scales this to the container. */
export const WIDTH = 1200;
export const HEIGHT = 640;

/**
 * How much slower than the script the film plays. Every beat, loop length and
 * poster frame goes through `s()`, so the whole film's pace is this one number
 * — raised from 1 so each click reads before the next one lands.
 */
export const PACE = 1.2;

/** Script seconds → frames, at the film's pace. */
export const s = (seconds: number) => Math.round(seconds * PACE * FPS);

export type FilmTab = "practice" | "roadmap" | "progress";

/** Loop length per tab, in frames. */
export const LOOP: Record<FilmTab, number> = {
  roadmap: s(9.3),
  practice: s(11.5),
  progress: s(12),
};

/**
 * The frame each tab's still (the poster, and what reduced motion shows)
 * rests on: the first page fully arrived, before the cursor comes in.
 */
export const POSTER_FRAME: Record<FilmTab, number> = {
  roadmap: s(2.0),
  practice: s(1.8),
  progress: s(2.2),
};
