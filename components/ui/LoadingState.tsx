"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Pixel-grid loader for agent work in progress.
 *
 * A 3x3 grid of cells pulses beside a shimmering label and a live elapsed
 * timer. Variants differ only in the order the cells light and whether they
 * are square or round:
 *
 *   drive — chevron wavefront driving left to right, square cells. The 650ms
 *           cycle is deliberately shorter than the sweep, so two fronts are
 *           always in flight.
 *   dots  — the same wavefront with circular cells.
 *   orbit — a single comet lapping the grid's perimeter; the centre cell
 *           never lights and rests dimmer than the rest.
 *
 * The loader normally drives itself off wall-clock time. Passing `frame`
 * hands the clock over instead, which is what lets the same component run
 * inside the Remotion hero film: every value becomes a pure function of the
 * frame, so a given frame always paints the same pixels and a paused or
 * seeked film does not drift.
 *
 * prefers-reduced-motion freezes the grid at its dim state. The timer keeps
 * ticking, because elapsed time is information rather than decoration.
 */

type LoadingVariant = "drive" | "dots" | "orbit";

/**
 * Chevron delays: distance from the middle row plus the column index, so the
 * centre row leads and the outer rows trail into a travelling ">".
 */
const chevron = Array.from({ length: 9 }, (_, i) => {
  const row = Math.floor(i / 3);
  const column = i % 3;
  return (column + Math.abs(row - 1)) * 90;
});

/** Perimeter cells clockwise from the top-left; the centre (4) is skipped. */
const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const orbit = Array.from({ length: 9 }, (_, i) => {
  const step = ORBIT_ORDER.indexOf(i);
  return step === -1 ? null : step * 110;
});

const PATTERNS: Record<
  LoadingVariant,
  { delays: Array<number | null>; duration: number; round: boolean }
> = {
  drive: { delays: chevron, duration: 650, round: false },
  dots: { delays: chevron, duration: 650, round: true },
  orbit: { delays: orbit, duration: 950, round: false },
};

const SHIMMER_MS = 1400;
/** Resting opacity for an animating cell, and for orbit's dead centre. */
const DIM = 0.15;
const DIMMEST = 0.07;

/** Tenths of a second, either self-driven or read from an external clock. */
function useTenths(frame: number | undefined, fps: number) {
  const external = frame !== undefined;
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (external) return;
    const timer = setInterval(() => setTicks((value) => value + 1), 100);
    return () => clearInterval(timer);
  }, [external]);

  return external ? Math.floor((frame / fps) * 10) : ticks;
}

/** `4.3s` up to a minute, then `1m 4.3s`. */
function formatElapsed(tenths: number) {
  const total = tenths / 10;
  if (total < 60) return `${total.toFixed(1)}s`;
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

/**
 * One cell's opacity at a given moment — the `pixel-on` keyframes evaluated
 * by hand, for when the clock is external and CSS animation is not an option.
 */
function cellOpacity(ms: number, delay: number, duration: number) {
  const phase = (((ms - delay) % duration) + duration) % duration / duration;
  // 0 at both ends, 1 at the midpoint, smoothed to match ease-in-out.
  const triangle = 1 - Math.abs(2 * phase - 1);
  const eased = triangle * triangle * (3 - 2 * triangle);
  return 0.12 + 0.88 * eased;
}

export function LoadingState({
  label = "Analizuję",
  messageMs = 1600,
  variant = "drive",
  showElapsed = true,
  frame,
  fps = 30,
  className,
}: {
  /** One label, or several to cycle through while the agent works. */
  label?: string | string[];
  /** How long each label holds before the next one takes over. */
  messageMs?: number;
  variant?: LoadingVariant;
  /** Elapsed time reassures on real work; hide it in scripted previews. */
  showElapsed?: boolean;
  /** Drive the animation from an external clock instead of wall time. */
  frame?: number;
  /** Frames per second for `frame`. Ignored when self-driven. */
  fps?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const tenths = useTenths(frame, fps);
  const { delays, duration, round } = PATTERNS[variant];
  const external = frame !== undefined;
  const ms = tenths * 100;

  const messages = Array.isArray(label) ? label : [label];
  // Hold the last message rather than looping back: an agent that returns to
  // "reading your question" after "building your drill" reads as stuck.
  const message =
    messages[Math.min(Math.floor(ms / messageMs), messages.length - 1)];

  return (
    // role="status" announces the label; the timer is excluded so it does not
    // re-announce ten times a second.
    <div
      role="status"
      className={cn("flex w-fit items-center gap-2.5", className)}
    >
      <span aria-hidden className="grid grid-cols-[repeat(3,4px)] gap-[1.5px]">
        {delays.map((delay, i) => {
          const still = delay === null || reducedMotion;
          return (
            <span
              key={i}
              className={cn(
                "size-[4px] bg-charcoal",
                round ? "rounded-full" : "rounded-[1px]",
              )}
              style={{
                opacity: still
                  ? delay === null
                    ? DIMMEST
                    : DIM
                  : external
                    ? cellOpacity(ms, delay, duration)
                    : DIM,
                animation:
                  still || external
                    ? "none"
                    : `pixel-on ${duration}ms ease-in-out ${delay}ms infinite`,
              }}
            />
          );
        })}
      </span>

      <span
        // Remounting on each message replays the fade. Skipped when the clock
        // is external, where a CSS animation would not survive a seek.
        key={external ? undefined : message}
        className={cn(
          "bg-clip-text text-body-sm font-medium text-transparent",
          !external && !reducedMotion && "animate-view-swap",
        )}
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-fog) 35%, var(--color-charcoal) 50%, var(--color-fog) 65%)",
          backgroundSize: "200% 100%",
          backgroundPosition: external
            ? `${200 - 400 * ((ms % SHIMMER_MS) / SHIMMER_MS)}% 0`
            : undefined,
          animation:
            reducedMotion || external
              ? "none"
              : `shimmer-text ${SHIMMER_MS}ms linear infinite`,
          // Without a paint colour the label vanishes once the gradient stops.
          WebkitTextFillColor: reducedMotion ? "var(--color-fog)" : undefined,
        }}
      >
        {message}
      </span>

      {showElapsed ? (
        <span
          aria-hidden
          className="font-geist-mono text-[12px] text-fog tabular-nums"
        >
          {formatElapsed(tenths)}
        </span>
      ) : null}
    </div>
  );
}
