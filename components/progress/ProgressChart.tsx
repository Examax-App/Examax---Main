"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { monotonePath } from "@/components/progress/curve";
import { longDay, tick, useNow } from "@/components/progress/time";
import { cn } from "@/lib/cn";

/*
 * dub.co/analytics' "Success at a glance" chart, one to one in build (live
 * DOM, 2026-10-01): three tabs with a figure each and a chevron disc between
 * them, the active one underlined in black; under them a 420px plot on dashed
 * rules, the line over a wash that fades to nothing, and a tooltip card that
 * follows the pointer. Dub draws its line straight from point to point; this
 * one keeps the points but joins them softly (his call on /roadmap, where the
 * spiky lines went), and the axis starts at zero, so a slow evening reads as
 * a slow evening rather than a crash.
 *
 * The last thirty days, ending today: tasks answered, answered correctly,
 * and minutes spent learning — a little more each week, lighter on
 * Saturdays.
 * PLACEHOLDER DATA — one learner's month, illustrative.
 */

const DAYS = 30;

const TASKS = [16, 18, 20, 19, 15, 21, 22, 20, 22, 24, 22, 18, 24, 25, 23, 25, 27, 25, 21, 27, 28, 26, 28, 30, 28, 24, 30, 31, 29, 32];
/** Correct answers: the share climbs from 70% to 82% over the month. */
const CORRECT = TASKS.map((tasks, day) => Math.round(tasks * (0.7 + day * 0.004)));
/** Minutes: about two and a half a task, plus the lesson time around them. */
const MINUTES = TASKS.map((tasks, day) => Math.round(tasks * 2.4 + 10 + (day % 3) * 4));

const SERIES = [
  { key: "tasks", label: "Zadania", values: TASKS, color: "#3B82F6", swatch: "text-blue-500/50" },
  { key: "correct", label: "Poprawne", values: CORRECT, color: "#7C3AED", swatch: "text-violet-600/50" },
  { key: "minutes", label: "Czas nauki", values: MINUTES, color: "#14B8A6", swatch: "text-teal-400/50", unit: "min" },
] as const;

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

/** A round top for the axis, and three to five rules up to it. */
function scaleTop(max: number) {
  const step = max <= 40 ? 10 : max <= 80 ? 20 : 25;
  const top = Math.ceil((max * 1.1) / step) * step;
  return { top, ticks: Array.from({ length: top / step }, (_, index) => (index + 1) * step) };
}

const MARGIN = { top: 12, right: 8, bottom: 32, left: 32 };
const HEIGHT = 388;
/** Where the tooltip rests before anyone points at the plot — the reference's mid-month. */
const RESTING = 15;
const X_TICKS = [4, 9, 14, 19, 24, 29];
/** On a phone every other tick drops out, so the dates never run into each other. */
const X_TICKS_NARROW = [9, 19, 29];

export function ProgressChart() {
  const id = useId();
  const now = useNow();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(1046);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const series = SERIES[active];
  const { top, ticks } = scaleTop(Math.max(...series.values));
  const innerW = Math.max(1, width - MARGIN.left - MARGIN.right);
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = (day: number) => (day / (DAYS - 1)) * innerW;
  const y = (value: number) => innerH - (value / top) * innerH;
  /** Midnight of a day in the window; the last one is today. */
  const dateOf = (day: number) => {
    const today = new Date(now);
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - (DAYS - 1 - day));
  };

  const line = monotonePath(series.values.map((value, day) => [x(day), y(value)] as const));
  const shown = hover ?? RESTING;
  const pointX = MARGIN.left + x(shown);
  const pointY = MARGIN.top + y(series.values[shown]);
  const unit = "unit" in series ? ` ${series.unit}` : "";

  function onPointer(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const day = Math.round(((event.clientX - rect.left) / rect.width) * (DAYS - 1));
    setHover(Math.min(Math.max(day, 0), DAYS - 1));
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-ash bg-white [mask-image:linear-gradient(black_80%,transparent)]">
      <div className="flex justify-between overflow-x-auto border-b border-ash [scrollbar-width:none]">
        <div className="grid shrink-0 grow grid-cols-3 divide-x divide-ash" role="tablist" aria-label="Co pokazuje wykres">
          {SERIES.map((item, index) => (
            <div key={item.key} className="relative z-0">
              {index > 0 ? (
                <div aria-hidden className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ash bg-white p-1.5">
                  <ChevronRight className="size-3 text-silver" strokeWidth={2.5} />
                </div>
              ) : null}
              <button
                type="button"
                role="tab"
                aria-selected={index === active}
                onClick={() => setActive(index)}
                className="relative block h-full w-full min-w-[110px] flex-none cursor-pointer px-4 py-3 text-left ring-inset ring-fog transition-colors hover:bg-canvas-muted focus:outline-none focus-visible:ring-1 active:bg-paper-mist sm:min-w-[240px] sm:px-8 sm:py-6 sm:first:rounded-tl-xl"
              >
                <div className={cn("absolute bottom-0 left-0 h-0.5 w-full bg-black transition-transform duration-100", index !== active && "translate-y-[3px]")} />
                <div className="flex items-center gap-2.5 text-sm text-steel">
                  <div className={cn("size-2 rounded-sm bg-current shadow-[inset_0_0_0_1px_#00000019]", item.swatch)} />
                  <span>{item.label}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5 text-xl font-medium text-charcoal sm:text-2xl">
                  <RollingNumber value={sum(item.values)} lineHeight={32} />
                  {"unit" in item ? <span className="text-base font-normal text-fog">{item.unit}</span> : null}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[420px] w-full p-4">
        <div ref={box} className="relative size-full">
          <svg width={width} height={HEIGHT} className="block" role="img" aria-label={`${series.label} w ostatnich 30 dniach, łącznie ${sum(series.values)}${unit}`}>
            <defs>
              <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
              {/* Rules and their labels */}
              {ticks.map((value) => (
                <g key={value}>
                  <line x1={0} x2={innerW} y1={y(value)} y2={y(value)} stroke="#e5e5e5" strokeDasharray="5 5" />
                  <text x={-8} y={y(value)} dy="0.355em" textAnchor="end" fill="#00000066" fontSize="12">
                    {value}
                  </text>
                </g>
              ))}
              <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke="#00000026" />
              {(width < 560 ? X_TICKS_NARROW : X_TICKS).map((day) => (
                <text key={day} x={x(day)} y={innerH + 20} textAnchor={day === DAYS - 1 ? "end" : "middle"} fill="#00000066" fontSize="12">
                  {tick(dateOf(day))}
                </text>
              ))}

              {/* The line and its wash, re-drawn for each tab */}
              <g key={series.key} className="motion-safe:animate-[fade-in_0.4s_ease-out]">
                <path d={`${line}L${innerW},${innerH}L0,${innerH}Z`} fill={`url(#${id}-wash)`} />
                <path d={line} fill="none" stroke={series.color} strokeWidth={2} strokeLinecap="round" />
              </g>
              <circle cx={x(shown)} cy={y(series.values[shown])} r={4} fill={series.color} stroke="white" strokeWidth={1.5} className="transition-[cx,cy] duration-75" />

              {/* The pointer's target: the whole plot */}
              <rect
                width={innerW}
                height={innerH}
                fill="transparent"
                className="touch-pan-y"
                onPointerMove={onPointer}
                onPointerDown={onPointer}
                onPointerLeave={() => setHover(null)}
              />
            </g>
          </svg>

          {/* Tooltip */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 w-max -translate-x-1/2 rounded-lg border border-ash bg-white text-left shadow-subtle transition-[left,top] duration-75"
            style={{ left: Math.min(Math.max(pointX, 100), width - 100), top: Math.max(0, pointY - 116) }}
          >
            <div className="border-b border-ash px-4 py-3 text-sm text-charcoal">{longDay(dateOf(shown))}</div>
            <div className="flex items-center justify-between gap-8 px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={cn("size-2 rounded-sm bg-current shadow-[inset_0_0_0_1px_#00000019]", series.swatch)} />
                <span className="text-steel">{series.label}</span>
              </div>
              <span className="font-medium text-charcoal tabular-nums">
                {series.values[shown]}
                {unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
