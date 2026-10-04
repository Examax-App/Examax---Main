"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { cn } from "@/lib/cn";

/*
 * dub.co/links' "Success at a glance" chart, one to one in build: three tabs
 * with a figure each and a chevron disc between them, the active one
 * underlined in black; under them a 420px plot on dashed rules with a
 * tooltip card that follows the pointer. Dub draws a line; here each week is
 * a bar (his call, 2026-10-01), and the bars grow to the new tab's figures. Dub plots clicks, leads and sales;
 * this plots a plan, not a score: how much the roadmap schedules for each
 * week from October to the exam. It thins out over Christmas and the winter
 * break and turns to past papers in April.
 *
 * PLACEHOLDER DATA — an illustrative Matura 2027 plan (31 weeks).
 */

const FIRST_MONDAY = new Date(2026, 9, 5);
const WEEKS = 31;

/** New topics per week: steady through autumn, a pause at Christmas and the break, none in the final weeks. */
const TOPICS = [2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 2, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0];
/** Lessons: two per new topic, plus the review lessons that take over in spring. */
const LESSONS = TOPICS.map((topics, week) => topics * 2 + (week >= 24 ? 2 : week % 5 === 4 ? 1 : 0));
/** CKE tasks: rising through the year, light in the holidays, heaviest on the past papers in April. */
const TASKS = Array.from({ length: WEEKS }, (_, week) => {
  const holiday = week === 11 || week === 12 || week === 18 || week === 19;
  const base = 22 + week * 1.1 + (week % 3 === 1 ? 6 : week % 3 === 2 ? -3 : 0);
  return Math.round(holiday ? base * 0.35 : week >= 26 ? base * 1.5 : base);
});

/** Widest first, as dub's clicks → leads → sales: every task, the lessons, the new topics. */
const SERIES = [
  { key: "tasks", label: "Zadania CKE", values: TASKS, color: "#3b82f6", swatch: "text-blue-500/50" },
  { key: "lessons", label: "Lekcje", values: LESSONS, color: "#7c3aed", swatch: "text-violet-600/50" },
  { key: "topics", label: "Tematy", values: TOPICS, color: "#16a34a", swatch: "text-green-500/50" },
] as const;

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

const MONTHS = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const weekStart = (week: number) => new Date(FIRST_MONDAY.getTime() + week * 7 * 86_400_000);
const short = (date: Date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`;
function weekRange(week: number) {
  const start = weekStart(week);
  const end = new Date(start.getTime() + 6 * 86_400_000);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]}`
    : `${short(start)} – ${short(end)}`;
}

/** A round top for the axis: the max, lifted to the next step the ticks land on. */
function scaleTop(max: number) {
  if (max <= 4) return { top: 4, ticks: [1, 2, 3, 4] };
  if (max <= 8) return { top: 8, ticks: [2, 4, 6, 8] };
  const step = max <= 40 ? 10 : 20;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: top / step }, (_, index) => (index + 1) * step) };
}

const MARGIN = { top: 12, right: 8, bottom: 32, left: 32 };
const HEIGHT = 388;
/** Where the tooltip rests before anyone points at the plot. */
const RESTING_WEEK = 9;
const X_TICKS = [0, 6, 12, 18, 24, 30];

export function PlanChart() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(734);
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
  const column = innerW / WEEKS;
  /** A week's centre on the axis. */
  const x = (week: number) => (week + 0.5) * column;
  const y = (value: number) => innerH - (value / top) * innerH;

  const shown = hover ?? RESTING_WEEK;
  const pointX = MARGIN.left + x(shown);
  const pointY = MARGIN.top + y(series.values[shown]);

  return (
    <div className="mx-auto w-full max-w-screen-md [mask-image:linear-gradient(black_50%,transparent)]">
      <div className="relative overflow-hidden rounded-xl border border-ash bg-white [mask-image:linear-gradient(black_80%,transparent)]">
        <div className="flex justify-between overflow-x-auto border-b border-ash [scrollbar-width:none]">
          <div className="grid shrink-0 grow grid-cols-3 divide-x divide-ash" role="tablist" aria-label="Co planujemy w każdym tygodniu">
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
                  <div className="mt-1 flex items-center gap-2 text-xl font-medium text-charcoal sm:text-2xl">
                    <RollingNumber value={sum(item.values)} lineHeight={32} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[420px] w-full p-4">
          <div ref={box} className="relative size-full">
            <svg width={width} height={HEIGHT} className="block" aria-hidden>
              <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                {/* Rules and their labels */}
                {ticks.map((tick) => (
                  <g key={tick}>
                    <line x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="#e5e5e5" strokeDasharray="5 5" />
                    <text x={-10} y={y(tick)} dy="0.32em" textAnchor="end" fill="#a3a3a3" fontSize="12">
                      {tick}
                    </text>
                  </g>
                ))}
                <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke="#e5e5e5" />
                {X_TICKS.map((week) => (
                  <text key={week} x={x(week)} y={innerH + 22} textAnchor={week === 0 ? "start" : week === WEEKS - 1 ? "end" : "middle"} fill="#a3a3a3" fontSize="12">
                    {short(weekStart(week))}
                  </text>
                ))}
              </g>
            </svg>

            {/* The bars: one per week, growing to the active tab's figures */}
            <div
              role="img"
              aria-label={`${series.label} w kolejnych tygodniach planu, łącznie ${sum(series.values)}`}
              className="absolute flex touch-none items-end"
              style={{ left: MARGIN.left, top: MARGIN.top, width: innerW, height: innerH }}
              onPointerLeave={() => setHover(null)}
            >
              {series.values.map((value, week) => (
                <div key={week} className="flex h-full min-w-0 flex-1 items-end justify-center" onPointerEnter={() => setHover(week)}>
                  <div
                    className="w-[64%] rounded-t-[3px] transition-[height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{
                      height: `${Math.max((value / top) * 100, value ? 1.5 : 0)}%`,
                      backgroundColor: series.color,
                      opacity: week === shown ? 0.9 : 0.35,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Tooltip */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 w-max -translate-x-1/2 rounded-lg border border-ash bg-white text-left shadow-subtle transition-[left] duration-75"
              style={{ left: Math.min(Math.max(pointX, 120), width - 120), top: Math.max(0, pointY - 116) }}
            >
              <div className="border-b border-ash px-4 py-3 text-sm text-charcoal">
                Tydzień {shown + 1} · {weekRange(shown)}
              </div>
              <div className="flex items-center justify-between gap-8 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-sm bg-current shadow-[inset_0_0_0_1px_#00000019]", series.swatch)} />
                  <span className="text-steel">{series.label}</span>
                </div>
                <span className="font-medium text-charcoal tabular-nums">{series.values[shown]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
