"use client";

import { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Player, type PlayerRef } from "@remotion/player";
import {
  ArrowUpRight,
  BarChart3,
  Calculator,
  ChartLine,
  ChevronLeft,
  Eraser,
  Flag,
  PencilLine,
  SquareFunction,
  StickyNote,
  Timer,
} from "lucide-react";
import { BotAvatar } from "bot-avatars";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { FrameAt, useFrame } from "@/components/hero-film/frame";
import { FrameBridge } from "@/components/hero-film/frame-bridge";
import {
  AreaChart,
  CONTENT_W,
  CONTENT_X,
  CONTENT_Y,
  Chip,
  Cursor,
  MAIN_X,
  NavHeading,
  NavRow,
  PrimaryButton,
  RAIL_W,
  Roll,
  Shell,
  StatusPill,
  hovering,
  type CursorKey,
  type NavItem,
} from "@/components/hero-film/kit";
import { EASE, GLIDE, enter, ramp } from "@/components/hero-film/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { CKE_SHEET_URL, SITTING } from "@/components/simulation/sitting";
import { Frac, Radical, Tall, V } from "@/components/simulation/math";

/**
 * The landing's exam-simulation preview: a Remotion film of the simulation
 * workspace in use, built from the hero film's own kit — its shell, sidebar
 * rows, chips, buttons, status pills, cursor and easing — so it reads as the
 * same dashboard as the hero.
 *
 * The sidebar becomes the sheet's navigator (a question map, the tools and
 * the time and progress meters); the main panel holds the page of the sheet
 * and, beside it, the tools panel (notes, or CKE's formula sheet).
 *
 * The tasks are CKE's own, from the May 2025 basic-level paper
 * (MMAP-P0_100, 31 tasks), linked from the header. The student has done
 * everything else and comes back for the three left:
 *  - Zadanie 1 (closed): the cursor picks B.
 *  - Zadanie 10 (open): the formula sheet opens on the quadratic formulas,
 *    the pen writes the working symbol by symbol, sketches the parabola and
 *    writes the answer; the task is flagged, which files a note.
 *  - Zadanie 21 (true/false): F, then P.
 * Then "Zakończ egzamin", and the results: the score, every task marked, the
 * topics, and the Agent's next step.
 *
 * The pen is a handwriting model, not a sweep: every symbol is a set of
 * strokes traced at pen speed, eased at each end, with the pen lifting
 * between strokes. The text under it is Inter, like everything in the film.
 */

const FPS = 60;
/** The hero film's composition size, so both windows share one scale. */
const WIDTH = 1200;
const HEIGHT = 640;

/** The sheet the tasks come from, in CKE's archive. */
export { CKE_SHEET_URL };

/* ------------------------------------------------------------------------ */
/* Geometry — composition pixels, so the cursor aims at the layout's numbers */
/* ------------------------------------------------------------------------ */

type Pt = { x: number; y: number };

/** The main panel's content box, under the page header (the shell's own numbers). */
const BODY = { x: MAIN_X + 1, y: CONTENT_Y - 18 };
/** The page of the sheet, and the tools panel beside it. */
const CARD = { x: CONTENT_X, y: CONTENT_Y, w: 590, h: 544 };
const SIDE = { x: CONTENT_X + CARD.w + 14, y: CONTENT_Y, w: CONTENT_W - CARD.w - 14, h: CARD.h };
/** A point on the page, from the inside of its border. */
const card = (x: number, y: number): Pt => ({ x: CARD.x + 1 + x, y: CARD.y + 1 + y });
const PAD = 18;
const INNER_W = CARD.w - 2;

/** The sidebar's content corner: past the rail, inside its padding. */
const SB = { x: 1 + RAIL_W + 10, y: 1 + 5 + 14 };
/** The question map: six columns of 22px cells on a 26px pitch, under its heading. */
const MAP = { top: SB.y + 34 + 30, cols: 6, cell: 22, pitch: 26 };
const mapCell = (n: number): Pt => ({
  x: SB.x + 2 + ((n - 1) % MAP.cols) * MAP.pitch + MAP.cell / 2,
  y: MAP.top + Math.floor((n - 1) / MAP.cols) * MAP.pitch + MAP.cell / 2,
});
const TOTAL_TASKS = 31;
/** The tools list, under its heading: 26px rows on a 28px pitch. */
const TOOLS_TOP = MAP.top + Math.ceil(TOTAL_TASKS / MAP.cols) * MAP.pitch - 4 + 30;
const toolRow = (index: number): Pt => ({ x: SB.x + 50, y: TOOLS_TOP + index * 28 + 13 });

/** The header's "Zakończ egzamin" (measured off the render). */
const FINISH = { x: 1100, y: 30 };
/** The page's toolbar: the flag, then the pen and eraser pair. */
const FLAG_TOOL = card(500, 21);
const PEN_TOOL = card(536, 21);
/** Zadanie 1: four answer boxes in a row. */
const OPTION = { y: 128, w: 132, h: 36, gap: 8 };
const OPTION_B = card(PAD + OPTION.w + OPTION.gap + OPTION.w / 2, OPTION.y + OPTION.h / 2);
/** Zadanie 10: the squared answer area. */
const GRID = { y: 150, h: 374 };
/** Zadanie 21: the P/F table's cells. */
const TABLE = { y: 318, row: 40, cell: 40 };
const PF = (row: number, letter: "P" | "F") =>
  card(INNER_W - PAD - 1 - (letter === "P" ? 2 : 1) * TABLE.cell + TABLE.cell / 2, TABLE.y + 1 + row * TABLE.row + TABLE.row / 2);
/**
 * The results, laid out as the hero's Postępy: the toolbar, then the card's
 * 84px metric tabs over its chart.
 */
const RESULTS_CARD_Y = CONTENT_Y + 28 + 16;
const RESULTS_PLOT = { x: CONTENT_X + 1 + 52, y: RESULTS_CARD_Y + 1 + 84 + 34, w: CONTENT_W - 2 - 52 - 28, h: 270 };
const metricTab = (index: number): Pt => ({ x: CONTENT_X + (CONTENT_W / 3) * (index + 0.5), y: RESULTS_CARD_Y + 42 });
/** The results header's "Nowa symulacja", where the film ends and starts again (measured off the render). */
const NEW_SHEET = { x: 1105, y: 30 };

/** The results the film hands in to — the same sitting /simulation describes. */
const RESULTS = SITTING;

/** The points curve at a fraction of the exam, 0–1. */
function curveAt(t: number) {
  const { curve } = RESULTS;
  const at = t * (curve.length - 1);
  const i = Math.min(curve.length - 2, Math.floor(at));
  return curve[i] + (curve[i + 1] - curve[i]) * (at - i);
}
/** Bars for the minutes per task: centre and height inside the plot. */
const BAR_PITCH = RESULTS_PLOT.w / RESULTS.perTask.length;
const BAR_W = BAR_PITCH - 10;
const barX = (i: number) => BAR_PITCH * (i + 0.5);
const barHeight = (minutes: number) => (minutes / RESULTS.minutesTop) * RESULTS_PLOT.h;
const plotAt = (t: number): Pt => ({ x: RESULTS_PLOT.x + t * RESULTS_PLOT.w, y: RESULTS_PLOT.y + RESULTS_PLOT.h * 0.55 });
const barTop = (i: number): Pt => ({ x: RESULTS_PLOT.x + barX(i), y: RESULTS_PLOT.y + RESULTS_PLOT.h - barHeight(RESULTS.perTask[i]) + 14 });

/* ------------------------------------------------------------------------ */
/* Handwriting                                                               */
/* ------------------------------------------------------------------------ */

/**
 * Inter's advances at 16px, measured off the page's own font; every other
 * size scales from these, since Inter's advances are linear in size.
 */
const ADVANCE: Record<string, number> = {
  "0": 10.09, "1": 6.51, "2": 9.76, "3": 9.88, "4": 10.34, "6": 9.92, "7": 9.05, "9": 9.92,
  x: 8.73, "=": 10.59, "−": 10.59, "+": 10.59, "<": 10.59, "(": 5.84, ")": 5.84, ",": 4.61,
  "∈": 9.22, Δ: 11.44, " ": 4.5,
};
const advance = (ch: string, px: number) => ((ADVANCE[ch] ?? 9) * px) / 16;
const textWidth = (text: string, px: number) => [...text].reduce((sum, ch) => sum + advance(ch, px), 0);

/**
 * Inter's vertical metrics, in em (measured): the cap height; the math axis,
 * where the minus sign sits and a fraction's bar belongs; and where the
 * baseline falls in a line box as tall as the type.
 */
const CAP = 0.727;
const AXIS_EM = 0.285;
const BASELINE_EM = 0.863;
/** Working at 16px; fractions at 13px. */
const TEXT_PX = 16;
const FRAC_PX = 13;

/**
 * Each symbol as the strokes a hand makes, in a box where u runs across the
 * glyph and v from the cap line (0) to the baseline (1). A sharp stroke is
 * drawn as straight runs between its points; the rest are smoothed.
 */
type Stroke = { points: [number, number][]; sharp?: boolean };
const S = (points: [number, number][], sharp = false): Stroke => ({ points, sharp });

const GLYPHS: Record<string, Stroke[]> = {
  "0": [S([[0.5, 0], [0.12, 0.25], [0.1, 0.72], [0.5, 1], [0.88, 0.72], [0.88, 0.25], [0.5, 0], [0.4, 0.05]])],
  "1": [S([[0.2, 0.24], [0.62, 0], [0.62, 1]], true)],
  "2": [S([[0.12, 0.24], [0.45, 0], [0.84, 0.18], [0.8, 0.45], [0.14, 1]]), S([[0.14, 1], [0.9, 1]], true)],
  "3": [S([[0.14, 0.1], [0.55, 0], [0.82, 0.2], [0.48, 0.46], [0.86, 0.68], [0.56, 1], [0.1, 0.9]])],
  "4": [S([[0.72, 1], [0.72, 0], [0.05, 0.7], [0.96, 0.7]], true)],
  "6": [S([[0.78, 0.04], [0.32, 0.2], [0.12, 0.66], [0.46, 1], [0.86, 0.74], [0.52, 0.46], [0.14, 0.64]])],
  "7": [S([[0.1, 0.02], [0.9, 0.02], [0.38, 1]], true)],
  "9": [S([[0.86, 0.3], [0.5, 0.02], [0.12, 0.28], [0.46, 0.56], [0.86, 0.3], [0.8, 0.72], [0.52, 1], [0.18, 0.9]])],
  x: [S([[0.08, 0.28], [0.92, 1]], true), S([[0.92, 0.28], [0.08, 1]], true)],
  "=": [S([[0.08, 0.48], [0.92, 0.48]], true), S([[0.08, 0.78], [0.92, 0.78]], true)],
  "−": [S([[0.08, 0.63], [0.92, 0.63]], true)],
  "+": [S([[0.08, 0.63], [0.92, 0.63]], true), S([[0.5, 0.3], [0.5, 0.96]], true)],
  "<": [S([[0.9, 0.32], [0.1, 0.63], [0.9, 0.94]], true)],
  "(": [S([[0.82, -0.08], [0.36, 0.22], [0.26, 0.56], [0.38, 0.94], [0.82, 1.2]])],
  ")": [S([[0.18, -0.08], [0.64, 0.22], [0.74, 0.56], [0.62, 0.94], [0.18, 1.2]])],
  ",": [S([[0.58, 0.88], [0.52, 1.04], [0.3, 1.24]])],
  "∈": [S([[0.9, 0.3], [0.42, 0.3], [0.12, 0.52], [0.12, 0.8], [0.42, 1], [0.9, 1]]), S([[0.16, 0.65], [0.76, 0.65]], true)],
  Δ: [S([[0.5, 0], [0.06, 1], [0.94, 1], [0.5, 0]], true)],
};

/**
 * One mark of the working, in composition pixels: a character on its
 * baseline, a fraction's bar on the math axis, or a root sign whose bar runs
 * `w` over the radicand.
 */
type Glyph =
  | { kind: "char"; ch: string; x: number; baseline: number; px: number; w: number }
  | { kind: "bar"; x: number; y: number; w: number }
  | { kind: "root"; x: number; baseline: number; w: number }
  | { kind: "paren"; x: number; y: number; open: boolean };

/** The root sign's path, in a 20px-tall box that sits 15.5px above the baseline. */
const ROOT = { rise: 15.5, sign: 9, gap: 1 };

/**
 * A bracket around fractions: one thin curve, centred on the math axis and
 * reaching a little past both fractions, drawn at the ink's own weight —
 * a 28px font glyph would carry a stroke twice as heavy as the rest.
 */
const PAREN = { w: 7, half: 15 };
/** A bracket's curve as a quadratic: top, control, bottom, around (0, 0) on the axis. */
function parenCurve(open: boolean): [Pt, Pt, Pt] {
  const outer = open ? PAREN.w - 1 : 1;
  const inner = open ? 1 : PAREN.w - 1;
  return [
    { x: outer, y: -PAREN.half },
    // A quadratic reaches halfway to its control point, so the control sits
    // past the inner edge by as much as the curve should bow.
    { x: 2 * inner - outer, y: 0 },
    { x: outer, y: PAREN.half },
  ];
}

/**
 * A line of working, as it is written on paper:
 *  - a string is written at 16px;
 *  - `sup` and `sub` are 11px, raised or lowered;
 *  - `frac` is stacked at 13px: numerator, the bar on the math axis, denominator;
 *  - `root` is the sign with its bar over the radicand;
 *  - `tall` is a bracket drawn to enclose fractions;
 *  - `gap` is extra space, in pixels.
 */
type Piece = string | { sup: string } | { sub: string } | { frac: [string, string] } | { root: string } | { tall: string } | { gap: number };

function line(pieces: Piece[], x0: number, baseline: number): Glyph[] {
  const glyphs: Glyph[] = [];
  const axis = baseline - AXIS_EM * TEXT_PX;
  let x = x0;
  const chars = (text: string, at: number, base: number, px: number) => {
    let cx = at;
    for (const ch of text) {
      const w = advance(ch, px);
      glyphs.push({ kind: "char", ch, x: cx, baseline: base, px, w });
      cx += w;
    }
    return cx - at;
  };
  for (const piece of pieces) {
    if (typeof piece === "string") x += chars(piece, x, baseline, TEXT_PX);
    else if ("sup" in piece) x += chars(piece.sup, x, baseline - 7, 11);
    else if ("sub" in piece) x += chars(piece.sub, x, baseline + 3, 11);
    else if ("gap" in piece) x += piece.gap;
    else if ("tall" in piece) {
      glyphs.push({ kind: "paren", x: x + 1, y: axis, open: piece.tall === "(" });
      x += PAREN.w + 2;
    }
    else if ("root" in piece) {
      const w = textWidth(piece.root, TEXT_PX) + 2;
      glyphs.push({ kind: "root", x, baseline, w });
      chars(piece.root, x + ROOT.sign + ROOT.gap, baseline, TEXT_PX);
      x += ROOT.sign + ROOT.gap + w;
    } else {
      const [num, den] = piece.frac;
      const w = Math.max(textWidth(num, FRAC_PX), textWidth(den, FRAC_PX)) + 4;
      x += 2;
      chars(num, x + (w - textWidth(num, FRAC_PX)) / 2, axis - 3, FRAC_PX);
      glyphs.push({ kind: "bar", x, y: axis, w });
      chars(den, x + (w - textWidth(den, FRAC_PX)) / 2, axis + 3 + CAP * FRAC_PX, FRAC_PX);
      x += w + 2;
    }
  }
  return glyphs;
}

/** Where a character's (u, v) lands on the composition. */
function glyphPoint(g: Extract<Glyph, { kind: "char" }>, [u, v]: [number, number]): Pt {
  return { x: g.x + g.w * (0.14 + 0.72 * u), y: g.baseline - CAP * g.px * (1 - v) };
}

/** A stroke through its points, sampled densely: straight runs or Catmull-Rom. */
function smooth(points: Pt[], sharp: boolean): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let k = 0; k < 10; k++) {
      const t = k / 10;
      if (sharp) {
        out.push({ x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t });
        continue;
      }
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/** The strokes the pen makes for one mark, in composition pixels. */
function strokesOf(g: Glyph): Pt[][] {
  if (g.kind === "bar") return [smooth([{ x: g.x, y: g.y }, { x: g.x + g.w, y: g.y }], true)];
  if (g.kind === "paren") {
    const [a, c, b] = parenCurve(g.open);
    const points = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      const u = 1 - t;
      return { x: g.x + u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: g.y + u * u * a.y + 2 * u * t * c.y + t * t * b.y };
    });
    return [smooth(points, true)];
  }
  if (g.kind === "root") {
    const top = g.baseline - ROOT.rise;
    const at = (x: number, y: number) => ({ x: g.x + x, y: top + y });
    return [smooth([at(0.75, 12.5), at(2.5, 11.5), at(4.75, 19), at(8.25, 0.75), at(ROOT.sign + ROOT.gap + g.w, 0.75)], true)];
  }
  return (GLYPHS[g.ch] ?? []).map((stroke) => smooth(stroke.points.map((p) => glyphPoint(g, p)), Boolean(stroke.sharp)));
}

function lengthOf(points: Pt[]) {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  return length;
}

/** The point at a fraction of a polyline's length. */
function along(points: Pt[], fraction: number): Pt {
  const target = lengthOf(points) * Math.min(1, Math.max(0, fraction));
  let run = 0;
  for (let i = 1; i < points.length; i++) {
    const step = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (run + step >= target && step > 0) {
      const t = (target - run) / step;
      return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * t, y: points[i - 1].y + (points[i].y - points[i - 1].y) * t };
    }
    run += step;
  }
  return points[points.length - 1];
}

/* ------------------------------------------------------------------------ */
/* The script — one pen track, built beat by beat, in seconds                */
/* ------------------------------------------------------------------------ */

/**
 * Pen speeds, px/s: an unhurried hand, a little quicker in the air. At 145 a
 * symbol takes about a quarter of a second, which reads as writing rather
 * than a time-lapse.
 */
const DRAW_SPEED = 145;
const LIFT_SPEED = 360;
/** A gentle, symmetric ease: the pen settles into and out of every stroke. */
const STROKE_EASE = Easing.bezier(0.37, 0, 0.63, 1);

type Segment = { from: number; to: number; at: (t: number) => Pt };
type Written = { glyphs: Glyph[]; times: Array<[number, number]> };

/**
 * The working for Zadanie 10, set out as CKE's model solution does: the
 * inequality in standard form, the discriminant and its root, both roots as
 * fractions, then — after the sketch — the answer. Plain lines sit on the
 * grid's rules; lines with fractions get the room they need.
 */
const GRID_TOP = CARD.y + 1 + GRID.y;
const WRITE_X = CARD.x + 1 + PAD + 22;
const LINES = {
  standard: line(["6x", { sup: "2" }, " − 11x + 3 < 0"], WRITE_X, GRID_TOP + 40),
  delta: line(["Δ = 121 − 72 = 49,", { gap: 14 }, { root: "Δ" }, " = 7"], WRITE_X, GRID_TOP + 80),
  x1: line(["x", { sub: "1" }, " = ", { frac: ["11 − 7", "12"] }, " = ", { frac: ["1", "3"] }], WRITE_X, GRID_TOP + 134),
  x2: line(["x", { sub: "2" }, " = ", { frac: ["11 + 7", "12"] }, " = ", { frac: ["3", "2"] }], WRITE_X, GRID_TOP + 188),
  answer: line(["x ∈ ", { tall: "(" }, { frac: ["1", "3"] }, ", ", { frac: ["3", "2"] }, { tall: ")" }], WRITE_X, GRID_TOP + 246),
};

/**
 * The sketch: y = 6x² − 11x + 3 over x ∈ [−0.1, 1.93], roots 1/3 and 3/2,
 * around an axis on the grid's right half.
 */
const AXIS = { y: GRID_TOP + 150, from: CARD.x + 351, to: CARD.x + 551 };
const PLOT = { x: CARD.x + 371, xUnit: 86, yUnit: 17 };
const plotX = (x: number) => PLOT.x + (x + 0.1) * PLOT.xUnit;
const parabolaAt = (t: number): Pt => {
  const x = -0.1 + 2.03 * t;
  return { x: plotX(x), y: AXIS.y - (6 * x * x - 11 * x + 3) * PLOT.yUnit };
};
const ROOTS = [plotX(1 / 3), plotX(1.5)];

const SCRIPT = (() => {
  const segments: Segment[] = [];
  const clicks: number[] = [];
  const marks: Record<string, number> = {};
  const writing = {} as Record<keyof typeof LINES, Written>;
  let now = 0;
  let pos: Pt = { x: 1080, y: 560 };

  const hold = (until: number) => {
    const at = pos;
    segments.push({ from: now, to: until, at: () => at });
    now = until;
  };
  const glide = (to: Pt, duration: number) => {
    const from = pos;
    segments.push({ from: now, to: now + duration, at: (t) => ({ x: from.x + (to.x - from.x) * GLIDE(t), y: from.y + (to.y - from.y) * GLIDE(t) }) });
    now += duration;
    pos = to;
  };
  const click = (name: string) => {
    clicks.push(now);
    marks[name] = now;
    hold(now + 0.18);
  };
  /** The pen in the air: a short hop with a slight rise, never a slide. */
  const lift = (to: Pt) => {
    const from = pos;
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const duration = 0.09 + distance / LIFT_SPEED;
    segments.push({
      from: now,
      to: now + duration,
      at: (t) => {
        const e = GLIDE(t);
        return { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e - Math.sin(Math.PI * t) * Math.min(4, distance * 0.2) };
      },
    });
    now += duration;
    pos = to;
  };
  /** The pen on paper along a path, eased at both ends. */
  const draw = (points: Pt[], speed = DRAW_SPEED, tempo = 1) => {
    const duration = Math.max(0.05, (lengthOf(points) / speed) * tempo);
    segments.push({ from: now, to: now + duration, at: (t) => along(points, STROKE_EASE(t)) });
    now += duration;
    pos = points[points.length - 1];
  };
  const write = (name: keyof typeof LINES) => {
    const glyphs = LINES[name];
    const times: Array<[number, number]> = [];
    glyphs.forEach((glyph, index) => {
      const strokes = strokesOf(glyph);
      if (strokes.length === 0) {
        times.push([now, now]);
        now += 0.03;
        return;
      }
      // A hand is never metronomic: each symbol runs a little fast or slow.
      const noise = Math.abs(Math.sin((index + 1) * 12.9898 + glyph.x * 0.1) * 43758.5453) % 1;
      const tempo = 0.94 + 0.12 * noise;
      let start = -1;
      for (const points of strokes) {
        lift(points[0]);
        if (start < 0) start = now;
        draw(points, DRAW_SPEED, tempo);
      }
      times.push([start, now]);
    });
    writing[name] = { glyphs, times };
  };

  // Zadanie 1: read, pick B.
  hold(1.0);
  glide(OPTION_B, 1.0);
  hold(now + 0.9);
  click("pickB");
  hold(now + 0.6);

  // Zadanie 10, from the question map; the formula sheet, then the pen.
  glide(mapCell(10), 1.0);
  click("to10");
  hold(now + 0.6);
  glide(toolRow(1), 0.85);
  click("formulas");
  hold(now + 1.5);
  glide(PEN_TOOL, 0.9);
  click("pen");

  // The working.
  glide(strokesOf(LINES.standard[0])[0][0], 0.7);
  write("standard");
  hold(now + 0.25);
  write("delta");
  hold(now + 0.3);
  write("x1");
  hold(now + 0.25);
  write("x2");
  hold(now + 0.35);

  // The sketch: axis, then the parabola in one stroke, then the roots.
  marks.axis = now;
  lift(parabolaAt(0));
  const curve = Array.from({ length: 80 }, (_, i) => parabolaAt(i / 79));
  marks.sketch = now;
  draw(curve, 130);
  marks.sketchEnd = now;
  hold(now + 0.25);
  marks.roots = now;
  hold(now + 0.3);
  marks.solution = now;
  hold(now + 0.5);

  write("answer");
  marks.answered10 = now;
  hold(now + 0.5);

  // Flag it to come back to: the note files itself.
  glide(FLAG_TOOL, 0.8);
  click("flag");
  hold(now + 1.5);

  // Zadanie 21: F, then P.
  glide(mapCell(21), 1.0);
  click("to21");
  hold(now + 1.1);
  glide(PF(0, "F"), 1.0);
  click("pickF");
  hold(now + 0.45);
  glide(PF(1, "P"), 0.8);
  click("pickP");
  hold(now + 0.8);

  // Hand the sheet in; the results.
  glide(FINISH, 1.1);
  click("finish");
  marks.results = now + 0.05;
  hold(now + 1.5);
  // Across the points curve, the tooltip following.
  glide(plotAt(0.3), 0.9);
  marks.scrubFrom = now;
  glide(plotAt(0.76), 1.5);
  marks.scrubTo = now;
  hold(now + 0.4);
  // Over to the minutes each task took; the slowest one.
  glide(metricTab(2), 0.8);
  click("metric");
  hold(now + 0.6);
  glide(barTop(RESULTS.perTask.length - 1), 0.9);
  marks.bar = now;
  hold(now + 1.3);
  marks.barEnd = now;
  // "Nowa symulacja": the sheet starts again, which is where the loop joins.
  glide(NEW_SHEET, 1.0);
  hold(now + 0.3);
  click("restart");
  marks.clear = now;
  hold(now + 0.7);

  return { segments, clicks, marks, writing, end: now };
})();

const LOOP = Math.round(SCRIPT.end * FPS);
const T = Object.fromEntries(Object.entries(SCRIPT.marks).map(([k, v]) => [k, Math.round(v * FPS)])) as Record<string, number>;
/** The still: Zadanie 1 on the page, before the cursor comes in. */
const POSTER_FRAME = Math.round(0.8 * FPS);

function penAt(seconds: number): Pt {
  const { segments } = SCRIPT;
  for (const segment of segments) {
    if (seconds <= segment.to) {
      const span = segment.to - segment.from;
      return segment.at(span <= 0 ? 1 : Math.min(1, Math.max(0, (seconds - segment.from) / span)));
    }
  }
  return segments[segments.length - 1].at(1);
}

/** The cursor, one key per frame, so it follows the pen exactly. */
const KEYS: CursorKey[] = (() => {
  const clickFrames = new Set(SCRIPT.clicks.map((c) => Math.round(c * FPS)));
  const keys: CursorKey[] = [];
  for (let f = Math.round(1.0 * FPS); f <= T.clear; f++) keys.push({ at: f, ...penAt(f / FPS), click: clickFrames.has(f) });
  return keys;
})();

/** How far a glyph has been written, 0 → 1. */
function inked(frame: number, [from, to]: [number, number]) {
  const t = frame / FPS;
  if (to <= from) return t >= from ? 1 : 0;
  return Math.min(1, Math.max(0, (t - from) / (to - from)));
}

/** Tasks answered before the film opens: all but the three left for last. */
const LEFT_FOR_LAST = new Set([1, 10, 21]);
const EXAM_MINUTES = 180;
/**
 * The clock when the film opens, set from the script so that the sheet is
 * handed in 141 minutes in — the time the results report.
 */
const TIME_LEFT = EXAM_MINUTES * 60 - (RESULTS.minutes * 60 + 20) + Math.floor(SCRIPT.marks.finish);

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------------ */
/* The film                                                                  */
/* ------------------------------------------------------------------------ */

type Tool = "Notatki" | "Karta wzorów";

function SimulationLoop() {
  const frame = useFrame();
  // The page arrives; at the end the results clear, so the loop joins without a seam.
  const reset = ramp(frame, T.clear, 24);
  const exam = ramp(frame, 0, 16) * (1 - ramp(frame, T.finish + 4, 10));
  const results = ramp(frame, T.results + 14, 18) * (1 - reset);
  const showResults = frame >= T.results + 14 && reset < 0.5;
  const onPage10 = frame >= T.to10 + 6 && frame < T.to21 + 6;

  const done = (n: number) =>
    !LEFT_FOR_LAST.has(n)
      ? 1
      : (n === 1 ? ramp(frame, T.pickB + 4, 10) : n === 10 ? ramp(frame, T.answered10, 10) : ramp(frame, T.pickP + 4, 10)) * (1 - reset);
  const answered = Array.from({ length: TOTAL_TASKS }, (_, i) => done(i + 1)).reduce((sum, value) => sum + value, 0);
  const flagged = ramp(frame, T.flag + 2, 10) * (1 - reset);
  const tool: Tool = frame >= T.formulas && frame < T.flag + 2 ? "Karta wzorów" : "Notatki";

  const handedIn = frame >= T.finish && reset < 0.5;
  const timeLeft = reset >= 0.5 ? TIME_LEFT : TIME_LEFT - Math.floor(Math.min(frame, handedIn ? T.finish : frame) / FPS);

  return (
    <AbsoluteFill>
      <Shell
        framed={false}
        sidebar={<ExamSidebar frame={frame} done={done} flagged={flagged} tool={tool} answered={answered} timeLeft={timeLeft} reset={reset} />}
        title={showResults ? "Wynik symulacji" : <ExamTitle />}
        titleKey={showResults ? "wynik" : "arkusz"}
        headerRight={
          <div className="flex items-center gap-2">
            {!showResults && <SheetLink />}
            <Chip icon={Timer} className="tabular-nums">
              {clock(timeLeft)}
            </Chip>
            {showResults ? (
              <PrimaryButton pressed={frame >= T.restart && frame < T.restart + 6}>Nowa symulacja</PrimaryButton>
            ) : (
              <PrimaryButton pressed={frame >= T.finish && frame < T.finish + 6}>Zakończ egzamin</PrimaryButton>
            )}
          </div>
        }
      >
        {/* Progress through the sheet, drawn over the header's rule */}
        <span className="absolute inset-x-0 -top-px h-px" style={{ opacity: 1 - ramp(frame, T.results, 12) }}>
          <span className="block h-full bg-[#1d63d8]" style={{ width: `${(answered / TOTAL_TASKS) * 100}%` }} />
        </span>
        {exam > 0 && (
          <div className="absolute inset-0" style={{ opacity: exam }}>
            <Sheet frame={frame} />
            <ToolsPanel frame={frame} />
          </div>
        )}
        {results > 0 && <Results frame={frame} opacity={results} />}
      </Shell>

      {/* The ink, in composition pixels, over the page it belongs to */}
      <div className="absolute inset-0" style={{ opacity: exam * (onPage10 ? 1 - ramp(frame, T.to21 - 2, 8) : 0) }}>
        {(Object.keys(LINES) as Array<keyof typeof LINES>).map((name) => (
          <Ink key={name} frame={frame} written={SCRIPT.writing[name]} />
        ))}
        <Sketch frame={frame} />
      </div>

      <Cursor keys={KEYS} />
    </AbsoluteFill>
  );
}

/** The sheet in CKE's archive, under the Matura mark (a real link is laid over it on the page). */
function SheetLink() {
  return (
    <Chip>
      <MaturaIcon className="h-[11px] w-[15px]" />
      Arkusz CKE · maj 2025
      <ArrowUpRight className="size-[11px] text-fog" strokeWidth={1.75} />
    </Chip>
  );
}

function ExamTitle() {
  return (
    <>
      Matura 2025 · Matematyka
      <span className="inline-flex h-[18px] items-center rounded-[5px] bg-paper-mist px-1.5 text-[10px] font-medium text-slate">
        Poziom podstawowy
      </span>
    </>
  );
}

/* The sidebar -------------------------------------------------------------- */

function toolItems(notes: number, flagged: number): NavItem[] {
  return [
    { label: "Notatki", icon: StickyNote, badge: notes },
    { label: "Karta wzorów", icon: SquareFunction },
    { label: "Kalkulator", icon: Calculator },
    { label: "Do sprawdzenia", icon: Flag, badge: flagged > 0.5 ? 1 : undefined },
  ];
}

/** The sheet's navigator: the question map, the tools, and time and progress. */
function ExamSidebar({
  frame,
  done,
  flagged,
  tool,
  answered,
  timeLeft,
  reset,
}: {
  frame: number;
  done: (n: number) => number;
  flagged: number;
  tool: Tool;
  answered: number;
  timeLeft: number;
  reset: number;
}) {
  // The current task: 1, then 10, then 21, then none once the sheet is in.
  const current = (n: number) => {
    const to10 = ramp(frame, T.to10, 8);
    const to21 = ramp(frame, T.to21, 8);
    if (n === 1) return Math.max(1 - to10, reset);
    if (n === 10) return to10 * (1 - to21);
    if (n === 21) return to21 * (1 - ramp(frame, T.finish, 8)) * (1 - reset);
    return 0;
  };
  const hover = (n: number) => (n === 10 ? hovering(frame, T.to10 - 12, T.to10 + 4) : n === 21 ? hovering(frame, T.to21 - 12, T.to21 + 4) : 0);
  const elapsed = EXAM_MINUTES * 60 - timeLeft;
  const meters = [
    { label: "Czas", value: `${Math.floor(elapsed / 60)} z ${EXAM_MINUTES} min`, share: elapsed / (EXAM_MINUTES * 60) },
    { label: "Rozwiązane", value: `${Math.round(answered)} z ${TOTAL_TASKS}`, share: answered / TOTAL_TASKS },
  ];

  return (
    <>
      <p className="flex h-[34px] items-start px-2 text-[14px] font-medium leading-none text-charcoal">
        <span className="flex items-center gap-1">
          <ChevronLeft className="-ml-1 size-[14px] text-fog" strokeWidth={1.75} />
          Symulacja
        </span>
      </p>
      <NavHeading>
        <span className="flex w-full justify-between">
          Arkusz
          <span>{TOTAL_TASKS} zadań</span>
        </span>
      </NavHeading>
      <div className="grid grid-cols-6 gap-[4px] px-[2px]">
        {Array.from({ length: TOTAL_TASKS }, (_, i) => i + 1).map((n) => {
          const on = current(n);
          const answeredN = done(n);
          return (
            <span
              key={n}
              data-cell={n}
              className="relative grid h-[22px] place-items-center rounded-[6px] bg-white text-[10px] font-medium tabular-nums text-silver shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
            >
              <span className="absolute inset-0 rounded-[6px] bg-[#dbeafe]" style={{ opacity: answeredN }} />
              <span className="absolute inset-0 rounded-[6px] bg-[#1d63d8]" style={{ opacity: on }} />
              <span className="absolute inset-0 rounded-[6px] bg-black/[0.05]" style={{ opacity: hover(n) * (1 - on) }} />
              <span className="relative" style={{ color: on > 0.5 ? "#fff" : answeredN > 0.5 ? "#1d63d8" : undefined }}>
                {n}
              </span>
              {n === 10 && (
                <span className="absolute -right-[2px] -top-[2px] size-[7px] rounded-full border-[1.5px] border-paper-mist bg-[#f97316]" style={{ opacity: flagged }} />
              )}
            </span>
          );
        })}
      </div>
      <NavHeading>Narzędzia</NavHeading>
      <ul className="space-y-[2px]">
        {toolItems(flagged > 0.5 ? 3 : 2, flagged).map((item) => (
          <NavRow key={item.label} item={item} on={item.label === tool} />
        ))}
      </ul>
      <div className="absolute inset-x-[10px] bottom-[16px] space-y-3 px-2">
        {meters.map((meter) => (
          <div key={meter.label}>
            <p className="flex items-center justify-between text-[11px] leading-none">
              <span className="text-slate">{meter.label}</span>
              <span className="tabular-nums text-fog">{meter.value}</span>
            </p>
            <div className="mt-2 h-[3px] rounded-full bg-black/[0.06]">
              <div className="h-full rounded-full bg-[#1d63d8]" style={{ width: `${meter.share * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* The page of the sheet ---------------------------------------------------- */

function Sheet({ frame }: { frame: number }) {
  return (
    <div
      className="absolute overflow-hidden rounded-[12px] border border-ash bg-white"
      style={{ left: CARD.x - BODY.x, top: CARD.y - BODY.y, width: CARD.w, height: CARD.h }}
    >
      <TaskView frame={frame} from={0} to={T.to10 + 6}>
        <TaskOne frame={frame} />
      </TaskView>
      <TaskView frame={frame} from={T.to10 + 6} to={T.to21 + 6}>
        <TaskTen frame={frame} />
      </TaskView>
      <TaskView frame={frame} from={T.to21 + 6} to={Infinity}>
        <TaskTwentyOne frame={frame} />
      </TaskView>
    </div>
  );
}

/** One task on the page, cross-fading in as the student moves to it. */
function TaskView({ frame, from, to, children }: { frame: number; from: number; to: number; children: React.ReactNode }) {
  if (frame < from - 1 || frame >= to) return null;
  const inT = from === 0 ? 1 : ramp(frame, from, 20);
  const outT = to === Infinity ? 0 : ramp(frame, to - 8, 8);
  return (
    <div className="absolute inset-0" style={{ opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 6}px)` }}>
      {children}
    </div>
  );
}

/**
 * The page's toolbar: the task, its points and state, CKE's page reference,
 * and the tools — flag it for later, the pen and the eraser.
 */
function TaskBar({
  number,
  points,
  page,
  saved,
  flag = 0,
  flagHover = 0,
  pen = 0,
  penHover = 0,
}: {
  number: number;
  points: string;
  page: number;
  saved: number;
  flag?: number;
  flagHover?: number;
  pen?: number;
  penHover?: number;
}) {
  return (
    <div className="flex h-[44px] items-center gap-2 border-b border-ash px-[14px]">
      <span className="text-[12px] font-semibold leading-none text-charcoal">Zadanie {number}.</span>
      <span className="text-[11px] leading-none text-fog">{points}</span>
      <span className="relative inline-grid">
        <StatusPill status="done" label="Zapisano" style={{ gridArea: "1 / 1", opacity: saved * (1 - flag), transform: `translateY(${(1 - saved) * 3}px)` }} />
        <StatusPill status="pending" label="Do sprawdzenia" style={{ gridArea: "1 / 1", opacity: flag, transform: `scale(${0.92 + flag * 0.08})` }} />
      </span>
      <span className="ml-auto text-[10.5px] leading-none text-silver">MMAP-P0_100 · strona {page}</span>
      <span data-flag className="relative grid size-[28px] place-items-center rounded-[7px] border border-ash text-slate">
        <span className="absolute inset-0 rounded-[6px] bg-paper-mist" style={{ opacity: flagHover * (1 - flag) }} />
        <span className="absolute -inset-px rounded-[7px] border border-[#fed7aa] bg-[#fff7ed]" style={{ opacity: flag }} />
        <Flag className="relative size-[12px]" strokeWidth={1.75} style={{ color: flag > 0.5 ? "#c2410c" : undefined }} />
      </span>
      <span className="flex rounded-[7px] border border-ash p-[2px]">
        <span data-pen className="relative grid size-[22px] place-items-center rounded-[5px] text-slate">
          <span className="absolute inset-0 rounded-[5px] bg-paper-mist" style={{ opacity: penHover * (1 - pen) }} />
          <span className="absolute inset-0 rounded-[5px] bg-[#e8f1fe]" style={{ opacity: pen }} />
          <PencilLine className="relative size-[12px]" strokeWidth={1.75} style={{ color: pen > 0.5 ? "#1d63d8" : undefined }} />
        </span>
        <span className="grid size-[22px] place-items-center rounded-[5px] text-slate">
          <Eraser className="size-[12px]" strokeWidth={1.75} />
        </span>
      </span>
    </div>
  );
}


const INSTRUCTION = "absolute text-[12px] leading-[18px] text-slate";

/** Zadanie 1 — closed. (√32 − √2)² = 34 − 16 = 18: B. */
function TaskOne({ frame }: { frame: number }) {
  const hoverB = hovering(frame, T.pickB - 14, T.pickB);
  const picked = ramp(frame, T.pickB + 2, 8);
  return (
    <>
      <TaskBar number={1} points="0–1 pkt" page={4} saved={ramp(frame, T.pickB + 8, 14)} />
      <p className={INSTRUCTION} style={{ left: PAD, right: PAD, top: 62 }}>
        Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.
      </p>
      <p className="absolute whitespace-nowrap text-[15px] leading-[24px] text-charcoal" style={{ left: PAD, top: 86 }}>
        Liczba{" "}
        <span className="mx-[0.15em]">
          <Tall>(</Tall>
          <Radical>32</Radical> − <Radical>2</Radical>
          <Tall>)</Tall>
          <sup className="text-[0.65em]">2</sup>
        </span>{" "}
        jest równa
      </p>
      <div className="absolute flex" style={{ left: PAD, top: OPTION.y, gap: OPTION.gap }}>
        {["16", "18", "30", "34"].map((option, index) => {
          const on = index === 1 ? picked : 0;
          return (
            <span
              key={option}
              data-option={index}
              className="relative flex items-center gap-2.5 rounded-[8px] border border-ash px-2.5 text-[12.5px] text-charcoal"
              style={{ width: OPTION.w, height: OPTION.h }}
            >
              <span className="absolute inset-0 rounded-[7px] bg-paper-mist" style={{ opacity: index === 1 ? hoverB * (1 - on) : 0 }} />
              <span className="absolute -inset-px rounded-[8px] border border-[#93c5fd] bg-[#eff6ff]" style={{ opacity: on }} />
              <span className="relative grid size-[18px] place-items-center rounded-full border border-ash bg-white text-[9.5px] font-medium text-fog">
                <span className="absolute -inset-px rounded-full bg-[#1d63d8]" style={{ opacity: on }} />
                <span className="relative" style={{ color: on > 0.5 ? "#fff" : undefined }}>
                  {"ABCD"[index]}
                </span>
              </span>
              <span className="relative tabular-nums" style={{ color: on > 0.5 ? "#1d63d8" : undefined }}>
                {option}
              </span>
            </span>
          );
        })}
      </div>
      <ScratchGrid top={184} height={340} label="Brudnopis" />
    </>
  );
}

/** Zadanie 10 — open, two marks: 6x² − 11x + 3 < 0, Δ = 49, the sketch with roots 1/3 and 3/2, x ∈ (1/3, 3/2). */
function TaskTen({ frame }: { frame: number }) {
  return (
    <>
      <TaskBar
        number={10}
        points="0–2 pkt"
        page={10}
        saved={ramp(frame, T.answered10 + 6, 14)}
        flag={ramp(frame, T.flag + 2, 10)}
        flagHover={hovering(frame, T.flag - 14, T.flag)}
        pen={ramp(frame, T.pen + 2, 8)}
        penHover={hovering(frame, T.pen - 14, T.pen)}
      />
      <p className={INSTRUCTION} style={{ left: PAD, right: PAD, top: 62 }}>
        Rozwiąż nierówność
      </p>
      <p className="absolute text-[15px] font-medium text-charcoal" style={{ left: PAD, top: 84 }}>
        3(2<V>x</V>
        <sup className="text-[0.65em]">2</sup> + 1) &lt; 11<V>x</V>
      </p>
      <p className={INSTRUCTION} style={{ left: PAD, right: PAD, top: 112 }}>
        Zapisz obliczenia.
      </p>
      <ScratchGrid top={GRID.y} height={GRID.h} />
    </>
  );
}

/** Zadanie 21 — true/false. AC = √133, so not isosceles (F); area ½·11·12·sin 60° = 33√3 (P). */
function TaskTwentyOne({ frame }: { frame: number }) {
  const rows = [
    {
      text: (
        <>
          Trójkąt <V>ABC</V> jest równoramienny.
        </>
      ),
      pick: "F" as const,
      at: T.pickF,
    },
    {
      text: (
        <span className="inline-flex items-center">
          Pole trójkąta&nbsp;<V>ABC</V>&nbsp;jest równe 33<Radical>3</Radical>.
        </span>
      ),
      pick: "P" as const,
      at: T.pickP,
    },
  ];
  return (
    <>
      <TaskBar number={21} points="0–1 pkt" page={21} saved={ramp(frame, T.pickP + 8, 14)} />
      <p className="absolute text-[12.5px] leading-[19px] text-charcoal" style={{ left: PAD, right: PAD, top: 62 }}>
        Dany jest trójkąt <V>ABC</V>, w którym |<V>AB</V>| = 11, |<V>BC</V>| = 12 oraz |∡<V>ABC</V>| = 60° (zobacz rysunek).
      </p>
      <Triangle />
      <p className={INSTRUCTION} style={{ left: PAD, right: PAD, top: 262 }}>
        Oceń prawdziwość poniższych stwierdzeń. Wybierz P, jeśli stwierdzenie jest prawdziwe, albo F – jeśli jest fałszywe.
      </p>
      <div className="absolute overflow-hidden rounded-[10px] border border-ash" style={{ left: PAD, right: PAD, top: TABLE.y }}>
        {rows.map((row, index) => {
          const on = ramp(frame, row.at + 2, 8);
          const hover = hovering(frame, row.at - 14, row.at);
          return (
            <div key={index} className={cn("flex items-center", index > 0 && "border-t border-ash")} style={{ height: TABLE.row }}>
              <span className="flex-1 px-3 text-[12.5px] text-charcoal">{row.text}</span>
              {(["P", "F"] as const).map((letter) => {
                const picked = row.pick === letter ? on : 0;
                return (
                  <span
                    key={letter}
                    data-pf={`${index}${letter}`}
                    className="relative flex h-full items-center justify-center border-l border-ash text-[11.5px] font-medium text-fog"
                    style={{ width: TABLE.cell }}
                  >
                    <span className="absolute inset-[5px] rounded-[6px] bg-paper-mist" style={{ opacity: row.pick === letter ? hover * (1 - picked) : 0 }} />
                    <span className="absolute inset-[5px] rounded-[6px] border border-[#93c5fd] bg-[#eff6ff]" style={{ opacity: picked }} />
                    <span className="relative" style={{ color: picked > 0.5 ? "#1d63d8" : undefined }}>
                      {letter}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <ScratchGrid top={418} height={106} label="Brudnopis" />
    </>
  );
}

/** The task's figure: B bottom left, C along the base, A at 60° from B. */
function Triangle() {
  const unit = 8.6;
  const C = { x: 12 * unit, y: 0 };
  const A = { x: 11 * unit * 0.5, y: -11 * unit * Math.sin(Math.PI / 3) };
  const ox = INNER_W / 2 - C.x / 2;
  const oy = 232;
  const p = (q: Pt) => `${(q.x + ox).toFixed(1)},${(q.y + oy).toFixed(1)}`;
  return (
    <svg className="absolute left-0 top-0" width={INNER_W} height={260} fill="none">
      <polygon points={`${p(A)} ${p({ x: 0, y: 0 })} ${p(C)}`} stroke="var(--color-charcoal)" strokeWidth="1.25" strokeLinejoin="round" />
      <path d={`M${ox + 16} ${oy} A16 16 0 0 0 ${(ox + 8).toFixed(1)} ${(oy - 13.86).toFixed(1)}`} stroke="var(--color-fog)" strokeWidth="1" />
      <g fontSize="11" fill="var(--color-fog)">
        <text x={ox + 21} y={oy - 5}>60°</text>
        <Vertex x={A.x + ox} y={A.y + oy - 8} name="A" />
        <Vertex x={ox - 9} y={oy + 14} name="B" />
        <Vertex x={C.x + ox + 9} y={oy + 14} name="C" />
        <text x={A.x / 2 + ox - 12} y={A.y / 2 + oy + 2} textAnchor="middle">
          11
        </text>
        <text x={C.x / 2 + ox} y={oy + 16} textAnchor="middle">
          12
        </text>
      </g>
    </svg>
  );
}

/** A vertex's name, slanted like the statement's letters. */
function Vertex({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <text transform={`translate(${x} ${y}) skewX(-10)`} textAnchor="middle" fill="var(--color-charcoal)">
      {name}
    </text>
  );
}

/** The sheet's squared answer area — the kratka CKE prints under each task. */
function ScratchGrid({ top, height, label }: { top: number; height: number; label?: string }) {
  return (
    <div
      data-grid
      className="absolute rounded-[8px] border border-ash"
      style={{
        left: PAD,
        right: PAD,
        top,
        height,
        backgroundImage:
          "linear-gradient(to right, rgb(229 229 229 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(229 229 229 / 0.6) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundPosition: "-1px -1px",
      }}
    >
      {label && <span className="absolute left-2.5 top-2 bg-white px-1 text-[10.5px] font-medium leading-none text-fog">{label}</span>}
    </div>
  );
}

/** A line of working: each mark appears under the pen as it is traced. */
function Ink({ frame, written }: { frame: number; written: Written }) {
  return (
    <>
      {written.glyphs.map((glyph, index) => {
        const shown = inked(frame, written.times[index]);
        if (shown <= 0) return null;
        const clipPath = `inset(-6px ${((1 - shown) * 100).toFixed(1)}% -6px -2px)`;
        if (glyph.kind === "bar") {
          return <span key={index} className="absolute bg-charcoal" style={{ left: glyph.x, top: glyph.y - 0.65, width: glyph.w, height: 1.3, clipPath }} />;
        }
        if (glyph.kind === "paren") {
          const [a, c, b] = parenCurve(glyph.open);
          const h = PAREN.half + 1;
          return (
            <svg key={index} className="absolute overflow-visible" style={{ left: glyph.x, top: glyph.y - h, clipPath }} width={PAREN.w} height={h * 2} viewBox={`0 ${-h} ${PAREN.w} ${h * 2}`} fill="none">
              <path d={`M${a.x} ${a.y}Q${c.x} ${c.y} ${b.x} ${b.y}`} stroke="var(--color-charcoal)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          );
        }
        if (glyph.kind === "root") {
          const w = ROOT.sign + ROOT.gap + glyph.w;
          return (
            <svg key={index} className="absolute overflow-visible" style={{ left: glyph.x, top: glyph.baseline - ROOT.rise, clipPath }} width={w} height={20} viewBox={`0 0 ${w} 20`} fill="none">
              <path d={`M0.75 12.5L2.5 11.5L4.75 19L8.25 0.75H${w}`} stroke="var(--color-charcoal)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        }
        if (glyph.ch === " ") return null;
        return (
          <span
            key={index}
            className="absolute whitespace-pre text-charcoal"
            style={{ left: glyph.x, top: glyph.baseline - BASELINE_EM * glyph.px, fontSize: glyph.px, lineHeight: `${glyph.px}px`, clipPath }}
          >
            {glyph.ch}
          </span>
        );
      })}
    </>
  );
}

/** The sketch: axis, the parabola drawn by the pen, roots, and the solution in blue. */
function Sketch({ frame }: { frame: number }) {
  const axis = ramp(frame, T.axis, 14);
  const drawn = Math.min(1, Math.max(0, (frame - T.sketch) / Math.max(1, T.sketchEnd - T.sketch)));
  const roots = ramp(frame, T.roots, 10);
  const solution = ramp(frame, T.solution, 18);
  if (axis <= 0) return null;

  // The same ease as the pen's stroke, so the line ends exactly at the cursor.
  const eased = STROKE_EASE(drawn);
  const samples = Math.max(2, Math.round(eased * 80));
  const curve = Array.from({ length: samples }, (_, i) => parabolaAt((i / (samples - 1)) * eased))
    .map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`)
    .join(" ");
  const mid = (ROOTS[0] + ROOTS[1]) / 2;
  const half = ((ROOTS[1] - ROOTS[0]) / 2) * solution;

  return (
    <svg className="absolute inset-0" width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none">
      <g opacity={axis}>
        <path d={`M${AXIS.from} ${AXIS.y}H${AXIS.from + (AXIS.to - AXIS.from) * axis}`} stroke="var(--color-fog)" strokeWidth="1.25" />
        <path d={`M${AXIS.to - 6} ${AXIS.y - 4}L${AXIS.to} ${AXIS.y}L${AXIS.to - 6} ${AXIS.y + 4}`} stroke="var(--color-fog)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <text x={AXIS.to - 2} y={AXIS.y + 18} fontSize="11" fill="var(--color-fog)" textAnchor="end">
          x
        </text>
      </g>
      {drawn > 0 && <path d={curve} stroke="var(--color-charcoal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {solution > 0 && <path d={`M${mid - half} ${AXIS.y}H${mid + half}`} stroke="#1d63d8" strokeWidth="3" strokeLinecap="round" />}
      <g opacity={roots}>
        {ROOTS.map((x, i) => (
          <g key={x}>
            {/* Open circles: the inequality is strict, so the roots are out. */}
            <circle cx={x} cy={AXIS.y} r="3.75" fill="white" stroke={solution > 0 ? "#1d63d8" : "var(--color-charcoal)"} strokeWidth="1.5" />
            {/* The roots' values, as stacked fractions, set outside the curve */}
            <g fontSize="10.5" fill="var(--color-slate)" textAnchor="middle">
              <text x={x + (i === 0 ? -11 : 11)} y={AXIS.y + 15}>{i === 0 ? "1" : "3"}</text>
              <path d={`M${x + (i === 0 ? -15.5 : 6.5)} ${AXIS.y + 18.5}H${x + (i === 0 ? -6.5 : 15.5)}`} stroke="var(--color-slate)" strokeWidth="1" />
              <text x={x + (i === 0 ? -11 : 11)} y={AXIS.y + 29}>{i === 0 ? "3" : "2"}</text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* The tools panel ----------------------------------------------------------- */

/** Beside the page: the notes, or CKE's formula sheet while it is open. */
function ToolsPanel({ frame }: { frame: number }) {
  const formulas = ramp(frame, T.formulas + 2, 12) * (1 - ramp(frame, T.flag + 2, 12));
  return (
    <div
      className="absolute overflow-hidden rounded-[12px] border border-ash bg-white"
      style={{ left: SIDE.x - BODY.x, top: SIDE.y - BODY.y, width: SIDE.w, height: SIDE.h }}
    >
      {formulas < 1 && <Notes frame={frame} opacity={1 - formulas} />}
      {formulas > 0 && <Formulas frame={frame} opacity={formulas} />}
    </div>
  );
}

function PanelHeader({ icon: Icon, title, meta }: { icon: typeof StickyNote; title: string; meta: React.ReactNode }) {
  return (
    <div className="flex h-[44px] items-center gap-2 border-b border-ash px-[14px]">
      <Icon className="size-[13px] text-slate" strokeWidth={1.75} />
      <span className="text-[12px] font-medium leading-none text-charcoal">{title}</span>
      <span className="ml-auto text-[10.5px] leading-none text-silver">{meta}</span>
    </div>
  );
}

const NOTES = [
  { task: 27, when: "96. minuta", text: "Najpierw drzewko, potem liczenie — sprawdzić, czy losowania są niezależne." },
  { task: 14, when: "41. minuta", text: "Wierzchołek: p = −b/2a. Uwaga na znak przy a < 0." },
];

/** The student's notes; flagging a task files a new one at the top. */
function Notes({ frame, opacity }: { frame: number; opacity: number }) {
  const filed = frame - (T.flag + 8);
  const slide = interpolate(filed, [0, 14], [0, 1], { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      <PanelHeader icon={StickyNote} title="Notatki" meta={`${NOTES.length + (filed >= 0 ? 1 : 0)} notatki`} />
      <div className="relative p-[14px]">
        {filed >= 0 && (
          <div className="absolute inset-x-[14px] top-[14px]" style={{ opacity: slide, transform: `translateY(${(1 - slide) * -8}px)` }}>
            <NoteCard task={10} when="4 min 12 s na zadaniu" highlight={1 - ramp(filed, 40, 40)} pill={<StatusPill status="pending" label="Do sprawdzenia" />}>
              Końce przedziału otwarte? Nierówność jest ostra.
            </NoteCard>
          </div>
        )}
        <div className="space-y-[10px]" style={{ transform: `translateY(${slide * 114}px)` }}>
          {NOTES.map((note) => (
            <NoteCard key={note.task} task={note.task} when={note.when}>
              {note.text}
            </NoteCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoteCard({
  task,
  when,
  pill,
  highlight = 0,
  children,
}: {
  task: number;
  when: string;
  pill?: React.ReactNode;
  highlight?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-[104px] rounded-[10px] border border-ash bg-white p-3"
      style={{ boxShadow: highlight > 0 ? `0 0 0 3px rgba(37,99,235,${0.12 * highlight})` : undefined }}
    >
      <p className="flex h-[18px] items-center gap-1.5 text-[11px] leading-none">
        <span className="font-medium text-charcoal">Zadanie {task}</span>
        {pill && <span className="ml-auto">{pill}</span>}
      </p>
      <p className="mt-2 text-[11.5px] leading-[16px] text-slate">{children}</p>
      <p className="mt-2 flex items-center gap-1 text-[10px] leading-none text-silver">
        <Timer className="size-[10px]" strokeWidth={1.75} />
        {when}
      </p>
    </div>
  );
}

/** CKE's "Wybrane wzory matematyczne", opened on the section the task needs. */
function Formulas({ frame, opacity }: { frame: number; opacity: number }) {
  const match = ramp(frame, T.formulas + 20, 16);
  const row = "flex min-h-[32px] items-center whitespace-nowrap rounded-[7px] bg-paper-mist px-3 py-1 text-[13px] leading-[20px] text-charcoal";
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      <PanelHeader icon={SquareFunction} title="Karta wzorów" meta="CKE" />
      <div className="space-y-[14px] p-[14px]">
        <div
          className="rounded-[10px] border p-2.5"
          style={{
            borderColor: match > 0.5 ? "#bfdbfe" : "var(--color-ash)",
            boxShadow: `0 0 0 3px rgba(37,99,235,${0.1 * match})`,
          }}
        >
          <p className="flex h-[18px] items-center text-[11px] font-medium leading-none text-charcoal">
            Równanie kwadratowe
            <span className="ml-auto" style={{ opacity: match }}>
              <StatusPill status="new" label="Zadanie 10" />
            </span>
          </p>
          <div className="mt-2 space-y-1.5">
            <p className={row}>
              Δ&nbsp;=&nbsp;<V>b</V>
              <sup className="text-[0.65em]">2</sup>&nbsp;− 4<V>ac</V>
            </p>
            <p className={cn(row, "h-[46px]")}>
              <V>x</V>
              <sub className="text-[0.65em]">1</sub>&nbsp;=&nbsp;
              <Frac
                n={
                  <>
                    −<V>b</V> − <Radical>Δ</Radical>
                  </>
                }
                d={
                  <>
                    2<V>a</V>
                  </>
                }
              />
              ,&ensp;
              <V>x</V>
              <sub className="text-[0.65em]">2</sub>&nbsp;=&nbsp;
              <Frac
                n={
                  <>
                    −<V>b</V> + <Radical>Δ</Radical>
                  </>
                }
                d={
                  <>
                    2<V>a</V>
                  </>
                }
              />
            </p>
          </div>
        </div>
        <div className="px-2.5">
          <p className="text-[11px] font-medium leading-none text-charcoal">Funkcja kwadratowa</p>
          <div className="mt-2 space-y-1.5">
            <p className={cn(row, "h-[46px]")}>
              <V>W</V>&nbsp;= (<V>p</V>,&thinsp;<V>q</V>),&ensp;<V>p</V>&nbsp;=&nbsp;
              <Frac
                n={
                  <>
                    −<V>b</V>
                  </>
                }
                d={
                  <>
                    2<V>a</V>
                  </>
                }
              />
              ,&ensp;<V>q</V>&nbsp;=&nbsp;
              <Frac
                n="−Δ"
                d={
                  <>
                    4<V>a</V>
                  </>
                }
              />
            </p>
          </div>
        </div>
        <div className="px-2.5">
          <p className="text-[11px] font-medium leading-none text-charcoal">Pole trójkąta</p>
          <div className="mt-2">
            <p className={cn(row, "h-[46px]")}>
              <V>P</V>&nbsp;=&nbsp;
              <Frac n="1" d="2" />
              <V>a</V>&thinsp;·&thinsp;<V>b</V>&thinsp;·&thinsp;sin&thinsp;<V>γ</V>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* The results -------------------------------------------------------------- */

/**
 * Once the sheet is in: the hero's Postępy card — three metric tabs over one
 * chart. "Wynik" plots the points collected across the exam against the pass
 * mark; "Czas" swaps it for the minutes each task took.
 */
function Results({ frame, opacity }: { frame: number; opacity: number }) {
  const f = frame - (T.results + 14);
  const { w: plotW, h: plotH } = RESULTS_PLOT;
  const metric = ramp(frame, T.metric, 12); // 0 = Wynik, 1 = Czas
  const draw = ramp(f, 10, 44);

  // The scrub follows the cursor itself, so line and pointer never part.
  const pointer = penAt(frame / FPS);
  const scrub = Math.min(1, Math.max(0, (pointer.x - RESULTS_PLOT.x) / plotW));
  const showTip = interpolate(frame, [T.scrubFrom - 6, T.scrubFrom, T.scrubTo + 18, T.scrubTo + 26], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showBar = hovering(frame, T.bar - 4, T.barEnd);

  return (
    <div className="absolute inset-0 px-[30px] pt-[18px]" style={{ opacity }}>
      <div className="flex items-center justify-between" style={enter(f, 2)}>
        <SheetLink />
        <div className="flex gap-2">
          <Chip>
            {/* Korektor, the agent that checks work, as the Agent section draws it */}
            <span className="relative z-[1] inline-flex shrink-0">
              <BotAvatar type="clover" size={15} interactive={false} seed={0.3} aria-hidden />
            </span>
            Omów z Korepetytorem AI
          </Chip>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[12px] border border-ash" style={enter(f, 5)}>
        {/* Metric tabs */}
        <div className="relative grid h-[84px] grid-cols-3 border-b border-ash">
          {RESULTS.metrics.map((m, i) => (
            <div key={m.label} className={cn("relative px-6 pt-5", i > 0 && "border-l border-ash")}>
              <p className="flex items-center gap-1.5 text-[11.5px] leading-none text-fog">
                <span className="size-[7px] rounded-[2px]" style={{ backgroundColor: m.color }} />
                {m.label}
              </p>
              <p className="mt-2.5 flex items-baseline gap-1.5 text-[22px] font-medium leading-none tracking-[-0.01em] text-charcoal">
                <Roll frame={f} at={8 + i * 3} from={m.from} to={m.to} />
                {m.unit && <span className="text-[13px] font-normal tracking-normal text-fog">{m.unit}</span>}
              </p>
            </div>
          ))}
          {/* Active underline, travelling from Wynik to Czas */}
          <span className="absolute bottom-[-1px] h-[2px] bg-charcoal" style={{ width: `${100 / 3}%`, left: `${(metric * 200) / 3}%` }} />
        </div>

        {/* Chart */}
        <div className="relative h-[360px]">
          <span className="absolute right-4 top-3.5 flex gap-1">
            <span className={cn("grid size-[24px] place-items-center rounded-[6px] border", metric < 0.5 ? "border-ash bg-paper-mist" : "border-transparent")}>
              <ChartLine className="size-[12px] text-slate" strokeWidth={1.75} />
            </span>
            <span className={cn("grid size-[24px] place-items-center rounded-[6px] border", metric >= 0.5 ? "border-ash bg-paper-mist" : "border-transparent")}>
              <BarChart3 className="size-[12px] text-slate" strokeWidth={1.75} />
            </span>
          </span>

          {/* Wynik: points over the exam, against the pass mark */}
          <div className="absolute inset-0" style={{ opacity: 1 - metric }}>
            <Axis ticks={RESULTS.pointsAxis} />
            <div className="absolute" style={{ left: 52, top: 34, width: plotW, height: plotH }}>
              {[0, 0.5, 1].map((p) => (
                <div key={p} className="absolute inset-x-0 border-t border-dashed border-ash" style={{ top: p * plotH }} />
              ))}
              <AreaChart id="sim-points" values={RESULTS.curve} width={plotW} height={plotH} color="#3b82f6" draw={draw} />
              <div className="absolute inset-x-0 flex items-center" style={{ top: (1 - RESULTS.passMark) * plotH, opacity: ramp(f, 30, 14) }}>
                <div className="h-0 flex-1 border-t-[1.5px] border-dashed border-[#f59e0b]" />
                <span className="ml-2 flex h-[18px] -translate-y-px items-center rounded-[5px] bg-[#fffbeb] px-1.5 text-[10px] font-medium leading-none text-[#b45309]">
                  Próg 30%
                </span>
              </div>
              {showTip > 0 && (
                <div className="absolute inset-y-0" style={{ left: scrub * plotW, opacity: showTip }}>
                  <div className="absolute inset-y-0 w-px bg-charcoal" />
                  <div className="absolute left-2 top-[46px]">
                    <Tooltip title={`${Math.round(scrub * RESULTS.minutes)}. minuta`} color="#60a5fa" label="Punkty" value={String(Math.round(curveAt(scrub) * RESULTS.max))} />
                  </div>
                </div>
              )}
            </div>
            <Ticks ticks={RESULTS.timeTicks} />
          </div>

          {/* Czas: minutes per task */}
          {metric > 0 && (
            <div className="absolute inset-0" style={{ opacity: metric }}>
              <Axis ticks={RESULTS.minutesAxis} />
              <div className="absolute" style={{ left: 52, top: 34, width: plotW, height: plotH }}>
                {[0, 0.5, 1].map((p) => (
                  <div key={p} className="absolute inset-x-0 border-t border-dashed border-ash" style={{ top: p * plotH }} />
                ))}
                {RESULTS.perTask.map((minutes, i) => {
                  const grow = ramp(frame, T.metric + 4 + i, 18);
                  // Hovering the slowest task dims the rest.
                  const dim = i === RESULTS.perTask.length - 1 ? 0 : showBar;
                  return (
                    <div
                      key={i}
                      className="absolute bottom-0 rounded-t-[3px] bg-[#a78bfa]"
                      style={{ left: barX(i) - BAR_W / 2, width: BAR_W, height: barHeight(minutes) * grow, opacity: 1 - 0.5 * dim }}
                    />
                  );
                })}
                {showBar > 0 && (
                  <div className="absolute" style={{ left: barX(RESULTS.perTask.length - 1) - BAR_W / 2 - 128, top: plotH - barHeight(RESULTS.perTask[RESULTS.perTask.length - 1]), opacity: showBar }}>
                    <Tooltip title={`Zadanie ${RESULTS.perTask.length}`} color="#a78bfa" label="Czas" value={`${RESULTS.perTask[RESULTS.perTask.length - 1]} min`} />
                  </div>
                )}
              </div>
              <div className="absolute text-[9.5px] leading-none text-silver" style={{ left: 52, top: 34 + plotH + 12, width: plotW }}>
                {RESULTS.perTask.map((_, i) => (
                  <span key={i} className="absolute -translate-x-1/2 tabular-nums" style={{ left: barX(i) }}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Axis({ ticks }: { ticks: readonly string[] }) {
  return (
    <div className="absolute left-[18px] flex flex-col justify-between text-right text-[9.5px] leading-none text-silver" style={{ top: 34, height: RESULTS_PLOT.h + 4, width: 26 }}>
      {ticks.map((tick) => (
        <span key={tick}>{tick}</span>
      ))}
    </div>
  );
}

function Ticks({ ticks }: { ticks: readonly string[] }) {
  return (
    <div className="absolute flex justify-between text-[9.5px] leading-none text-silver" style={{ left: 52, top: 34 + RESULTS_PLOT.h + 12, width: RESULTS_PLOT.w }}>
      {ticks.map((tick) => (
        <span key={tick}>{tick}</span>
      ))}
    </div>
  );
}

/** The hero chart's tooltip: a heading, then one coloured row. */
function Tooltip({ title, color, label, value }: { title: string; color: string; label: string; value: string }) {
  return (
    <div className="w-[120px] rounded-[8px] border border-ash bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <p className="border-b border-ash px-2.5 py-2 text-[11px] font-medium leading-none text-charcoal">{title}</p>
      <p className="flex items-center justify-between px-2.5 py-2 text-[10px] leading-none text-fog">
        <span className="flex items-center gap-1.5">
          <span className="size-[6px] rounded-[2px]" style={{ backgroundColor: color }} />
          {label}
        </span>
        <span className="font-medium tabular-nums text-charcoal">{value}</span>
      </p>
    </div>
  );
}

function SimulationComposition() {
  return (
    <AbsoluteFill>
      <FrameBridge>
        <SimulationLoop />
      </FrameBridge>
    </AbsoluteFill>
  );
}

/** The film's still, drawn at composition size and scaled like the Player. */
function SimulationPoster({ frame = POSTER_FRAME }: { frame?: number }) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-full w-full" aria-hidden>
      <foreignObject width={WIDTH} height={HEIGHT}>
        <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
          <FrameAt frame={frame}>
            <SimulationLoop />
          </FrameAt>
        </div>
      </foreignObject>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* On the page                                                               */
/* ------------------------------------------------------------------------ */

/**
 * One frame of the film as a picture, for /simulation's "Przejrzysty arkusz"
 * cell (dub's dashboard screenshot): Zadanie 10 worked through — the
 * handwriting, the sketch and the formula sheet open beside the page.
 */
export function SimulationStill({ className }: { className?: string }) {
  return (
    <div className={cn("aspect-[1200/640] overflow-hidden", className)}>
      <SimulationPoster frame={T.answered10 + FPS / 2} />
    </div>
  );
}

/**
 * What is clickable over the film, in composition pixels (measured off the
 * render): the sheet link — in the header during the exam, at the head of
 * the results — and the header's button, "Zakończ egzamin" then "Nowa
 * symulacja".
 */
const CKE_LINK = { x: 768, y: 15, w: 185, h: 29 };
const CKE_LINK_RESULTS = { x: 269, y: 70, w: 185, h: 29 };
const FINISH_BUTTON = { x: 1041, y: 15, w: 121, h: 29 };
const NEW_BUTTON = { x: 1048, y: 15, w: 114, h: 29 };

/**
 * The film in its window. It plays while on screen and pauses once scrolled
 * away; the poster sits underneath until the first frame lands, and is all a
 * reduced-motion visitor sees. Like the hero film it is a picture, so nothing
 * in it takes the pointer, except the header's link to the CKE sheet, which
 * is a real link laid over the film.
 */
export function SimulationShowcase() {
  const reducedMotion = useReducedMotion();
  const player = useRef<PlayerRef>(null);
  const [results, setResults] = useState(false);

  // "Zakończ egzamin" hands the sheet in: the film jumps to the click, and the
  // results follow. On the results, "Nowa symulacja" starts the sheet again.
  const act = () => {
    const current = player.current;
    if (!current) return;
    current.seekTo(results ? 0 : T.finish - 4);
    current.play();
  };

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <figure className="relative aspect-[1200/640] select-none overflow-hidden rounded-2xl border border-ash bg-ash shadow-md">
        <figcaption className="sr-only">
          Symulacja egzaminu na arkuszu CKE z matury z matematyki (maj 2025): uczeń zaznacza odpowiedź w zadaniu 1, w zadaniu 10
          otwiera kartę wzorów, zapisuje obliczenia, szkicuje parabolę i oznacza zadanie do sprawdzenia, w zadaniu 21 ocenia
          prawdziwość stwierdzeń, a po oddaniu arkusza widzi wynik: punkty w czasie egzaminu i czas każdego zadania.
        </figcaption>
        <div className="pointer-events-none absolute inset-0">
          {reducedMotion ? <SimulationPoster /> : <FilmPlayer playerRef={player} onResults={setResults} />}
        </div>
        <a
          href={CKE_SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Arkusz CKE, matura z matematyki, maj 2025 (otwiera się w nowej karcie)"
          className="focus-ring absolute rounded-md"
          style={overlay(results ? CKE_LINK_RESULTS : CKE_LINK)}
        />
        {!reducedMotion && (
          <button
            type="button"
            onClick={act}
            aria-label={results ? "Nowa symulacja: zacznij arkusz od początku" : "Zakończ egzamin: przejdź do wyniku"}
            className="focus-ring absolute cursor-pointer rounded-[7px]"
            style={overlay(results ? NEW_BUTTON : FINISH_BUTTON)}
          />
        )}
      </figure>
    </div>
  );
}

/** A box in composition pixels, as a position over the scaled film. */
function overlay(box: { x: number; y: number; w: number; h: number }): React.CSSProperties {
  return {
    left: `${(box.x / WIDTH) * 100}%`,
    top: `${(box.y / HEIGHT) * 100}%`,
    width: `${(box.w / WIDTH) * 100}%`,
    height: `${(box.h / HEIGHT) * 100}%`,
  };
}

function FilmPlayer({ playerRef, onResults }: { playerRef: React.RefObject<PlayerRef | null>; onResults: (results: boolean) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    const el = stage.current;
    if (!player || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) player.play();
        else player.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playerRef]);

  // The first frame fades the poster out; every frame tells the page which
  // screen is up, so the button over the header does what it says.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onFrame = ({ detail }: { detail: { frame: number } }) => {
      setReady(true);
      onResults(detail.frame >= T.results + 14 && detail.frame < T.clear + 8);
    };
    player.addEventListener("frameupdate", onFrame);
    return () => player.removeEventListener("frameupdate", onFrame);
  }, [playerRef, onResults]);

  return (
    <div ref={stage} aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 0 : 1 }}>
        <SimulationPoster />
      </div>
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 1 : 0 }}>
        <Player
          ref={playerRef}
          component={SimulationComposition}
          durationInFrames={LOOP}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          style={{ width: "100%", height: "100%" }}
          loop
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
          renderLoading={() => <SimulationPoster />}
          initiallyMuted
          numberOfSharedAudioTags={0}
        />
      </div>
    </div>
  );
}
