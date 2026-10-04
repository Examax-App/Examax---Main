import { createElement, type CSSProperties, type HTMLAttributes } from "react";

/*
 * The three pieces of Remotion's API the hero film's markup leans on —
 * `interpolate`, `Easing.bezier` and `AbsoluteFill` — re-implemented to the
 * same behaviour, so the hero's poster (the film's first page, server
 * rendered and shown before the Player loads) does not pull Remotion's whole
 * runtime into the landing page's first load. The Player itself still runs
 * on Remotion; these produce identical numbers and boxes.
 */

type Extrapolate = "extend" | "clamp" | "identity";

export type InterpolateOptions = {
  easing?: (t: number) => number;
  extrapolateLeft?: Extrapolate;
  extrapolateRight?: Extrapolate;
};

/** Remotion's `interpolate`: maps `input` across matching ranges, segment by segment. */
export function interpolate(input: number, inputRange: readonly number[], outputRange: readonly number[], options: InterpolateOptions = {}): number {
  const { easing = (t: number) => t, extrapolateLeft = "extend", extrapolateRight = "extend" } = options;

  // The segment the input falls in (the first or last one outside the range), as Remotion's findRange.
  let i = 1;
  for (; i < inputRange.length - 1; i++) if (inputRange[i] >= input) break;
  const inputMin = inputRange[i - 1];
  const inputMax = inputRange[i];
  const outputMin = outputRange[i - 1];
  const outputMax = outputRange[i];

  let result = input;
  if (result < inputMin) {
    if (extrapolateLeft === "identity") return result;
    if (extrapolateLeft === "clamp") result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity") return result;
    if (extrapolateRight === "clamp") result = inputMax;
  }
  if (outputMin === outputMax) return outputMin;
  result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  return result * (outputMax - outputMin) + outputMin;
}

/* ── Easing.bezier: the standard cubic-bezier solver (as in Remotion / React Native) ── */

const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;
const SPLINE_TABLE_SIZE = 11;
const SAMPLE_STEP = 1 / (SPLINE_TABLE_SIZE - 1);

const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
const C = (a1: number) => 3 * a1;
const calcBezier = (t: number, a1: number, a2: number) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
const getSlope = (t: number, a1: number, a2: number) => 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);

function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const samples = new Float32Array(SPLINE_TABLE_SIZE);
  for (let i = 0; i < SPLINE_TABLE_SIZE; i++) samples[i] = calcBezier(i * SAMPLE_STEP, x1, x2);

  const tForX = (x: number) => {
    let start = 0;
    let sample = 1;
    const last = SPLINE_TABLE_SIZE - 1;
    for (; sample !== last && samples[sample] <= x; sample++) start += SAMPLE_STEP;
    sample--;
    const dist = (x - samples[sample]) / (samples[sample + 1] - samples[sample]);
    let guess = start + dist * SAMPLE_STEP;
    const slope = getSlope(guess, x1, x2);
    if (slope >= NEWTON_MIN_SLOPE) {
      for (let i = 0; i < NEWTON_ITERATIONS; i++) {
        const s = getSlope(guess, x1, x2);
        if (s === 0) break;
        guess -= (calcBezier(guess, x1, x2) - x) / s;
      }
      return guess;
    }
    if (slope === 0) return guess;
    let a = start;
    let b = start + SAMPLE_STEP;
    let current = 0;
    let i = 0;
    do {
      current = a + (b - a) / 2;
      const value = calcBezier(current, x1, x2) - x;
      if (value > 0) b = current;
      else a = current;
    } while (Math.abs(calcBezier(current, x1, x2) - x) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return current;
  };

  if (x1 === y1 && x2 === y2) return (t) => t;
  return (t) => (t === 0 || t === 1 ? t : calcBezier(tForX(t), y1, y2));
}

export const Easing = { bezier };

/* ── AbsoluteFill: Remotion's full-bleed flex column ── */

const FILL: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

export function AbsoluteFill({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return createElement("div", { ...props, style: { ...FILL, ...style } });
}
