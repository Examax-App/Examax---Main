import { Easing, interpolate } from "@/components/hero-film/anim";

/**
 * The reference ease from globals.css — every entrance in the film uses it, so
 * the video and the page's CSS animations share one motion language.
 */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** The cursor's ease: it accelerates off a target and settles onto the next. */
export const GLIDE = Easing.bezier(0.45, 0, 0.2, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0 → 1 over `duration` frames, starting at `delay`. */
export function ramp(frame: number, delay: number, duration: number): number {
  return interpolate(frame - delay, [0, duration], [0, 1], { easing: EASE, ...clamp });
}

/**
 * Standard entrance: fade up into place. Returns style props so callers can
 * compose it with their own transforms.
 */
export function enter(frame: number, delay = 0, { duration = 18, offset = 6 } = {}) {
  const t = ramp(frame, delay, duration);
  return { opacity: t, transform: `translateY(${(1 - t) * offset}px)` };
}

/**
 * A page's life inside a loop: arrives at `from`, leaves at `to`. The exit is
 * a quick fade, as in the reference, where the old page clears before the new
 * one staggers in.
 */
export function pageOpacity(frame: number, from: number, to: number, out = 6): number {
  if (frame < from || frame >= to) return 0;
  return interpolate(frame, [to - out, to], [1, 0], clamp);
}

/** A value that eases from `a` to `b` between two frames. */
export function tween(frame: number, at: number, duration: number, a: number, b: number): number {
  return interpolate(frame, [at, at + duration], [a, b], { easing: EASE, ...clamp });
}
