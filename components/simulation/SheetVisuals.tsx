"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  ChevronRight,
  CircleCheck,
  Clock,
  Eraser,
  Expand,
  Flag,
  LayoutGrid,
  ListChecks,
  MousePointerClick,
  NotebookPen,
  PencilLine,
  Save,
  ScanSearch,
  Send,
  Sparkles,
  SquareFunction,
  StickyNote,
  Timer,
} from "lucide-react";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { CKE_SHEET_URL, SITTING } from "@/components/simulation/sitting";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The four pictures of /simulation's "#sheet" band — dub.co/solutions/
 * creators' "Short links are essential to creators" grid (live DOM,
 * 2026-10-02), cell for cell:
 *
 *   Detailed analytics       → PaceChart   (three tabs over one area chart, a
 *                                           crosshair and tooltip that follow
 *                                           the pointer)
 *   Complete link control    → ToolScroll  (the source tab, the field, and the
 *                                           features scrolling up beneath it)
 *   Complimentary domain     → SessionCards(three staggered cards, a green
 *                                           pill on the first; each slides
 *                                           2% left and lifts under the
 *                                           pointer, its shadow deepening
 *                                           and an arrow arriving)
 *   Live event tracking      → AnswerLog   (stat cards with sparklines over an
 *                                           events table)
 *
 * Everything describes one sitting — the shared fixture in `sitting.ts`,
 * the same afternoon the landing's film plays.
 */

/* ── Pace chart ──────────────────────────────────────────────────────────── */

/** The tasks left for last in the film; everything else is done in order first. */
const LEFT_FOR_LAST = [1, 10, 21];
const ORDER = [...Array.from({ length: SITTING.tasks }, (_, i) => i + 1).filter((task) => !LEFT_FOR_LAST.includes(task)), ...LEFT_FOR_LAST];

/** Tasks handed in by each of the curve's points, so both tabs share one clock. */
const TASKS_DONE: number[] = (() => {
  const finished: number[] = [];
  let minute = 0;
  for (const task of ORDER) {
    minute += SITTING.perTask[task - 1];
    finished.push(minute);
  }
  const steps = SITTING.curve.length - 1;
  return SITTING.curve.map((_, i) => finished.filter((at) => at <= (i / steps) * SITTING.minutes + 0.01).length);
})();

type Tab = {
  label: string;
  value: string;
  color: string;
  points: number[];
  top: number;
  axis: [string, string, string];
  ticks: string[];
  /** The tooltip's heading for a point. */
  at: (index: number) => string;
  /** The tooltip's figure for a point. */
  figure: (value: number) => string;
};

const minuteAt = (index: number, count: number) => Math.round((index / (count - 1)) * SITTING.minutes);

const TABS: Tab[] = [
  {
    label: "Punkty",
    value: String(SITTING.score),
    color: SITTING.metrics[0].color,
    points: SITTING.curve.map((share) => share * SITTING.max),
    top: SITTING.max,
    axis: ["50", "25", "0"],
    ticks: SITTING.timeTicks,
    at: (index) => `${minuteAt(index, SITTING.curve.length)} min`,
    figure: (value) => `${Math.round(value)} pkt`,
  },
  {
    label: "Zadania",
    value: String(SITTING.tasks),
    color: SITTING.metrics[1].color,
    points: TASKS_DONE,
    top: SITTING.tasks,
    axis: ["31", "15", "0"],
    ticks: SITTING.timeTicks,
    at: (index) => `${minuteAt(index, SITTING.curve.length)} min`,
    figure: (value) => `${value} z ${SITTING.tasks}`,
  },
  {
    label: "Minuty",
    value: String(SITTING.minutes),
    color: SITTING.metrics[2].color,
    points: SITTING.perTask,
    top: SITTING.minutesTop,
    axis: ["16", "8", "0"],
    ticks: ["Zad. 1", "Zad. 8", "Zad. 16", "Zad. 24", "Zad. 31"],
    at: (index) => `Zadanie ${index + 1}`,
    figure: (value) => `${value} min`,
  },
];

const PLOT = { w: 420, h: 150 };

export function PaceChart() {
  const [tab, setTab] = useState(0);
  const series = TABS[tab];
  const count = series.points.length;
  const resting = Math.round((count - 1) * 0.72);
  const [hover, setHover] = useState<number | null>(null);
  const index = hover ?? resting;

  const x = (i: number) => (i / (count - 1)) * PLOT.w;
  const y = (value: number) => PLOT.h - (value / series.top) * PLOT.h;
  const line = series.points.map((value, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(value).toFixed(1)}`).join("");

  return (
    <div className="size-full [mask-image:linear-gradient(90deg,black_80%,transparent)]">
      <div className="size-full p-3 [mask-image:linear-gradient(black_70%,transparent)]">
        <div className="rounded-lg border border-ash bg-white">
          <div className="grid grid-cols-3" role="tablist" aria-label="Wykres arkusza">
            {TABS.map((item, i) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={i === tab}
                onClick={() => {
                  setTab(i);
                  setHover(null);
                }}
                className={cn(
                  "focus-ring relative flex flex-col items-start px-3.5 py-2.5 text-left transition-colors hover:bg-canvas-muted",
                  i > 0 && "border-l border-ash",
                )}
              >
                <span className="flex items-center gap-1.5 text-[10px] text-fog">
                  <span className="size-1.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="text-sm font-medium tabular-nums text-charcoal">{item.value}</span>
                {i < TABS.length - 1 ? (
                  <ChevronRight aria-hidden className="absolute -right-[7px] top-1/2 z-10 size-3 -translate-y-1/2 rounded-full bg-white text-silver" strokeWidth={2} />
                ) : null}
                <span aria-hidden className={cn("absolute inset-x-0 -bottom-px h-0.5 bg-charcoal transition-opacity", i === tab ? "opacity-100" : "opacity-0")} />
              </button>
            ))}
          </div>

          <div className="relative border-t border-ash px-3 pb-3 pt-4">
            <div className="flex gap-2">
              <div className="flex h-[150px] flex-col justify-between py-0 text-right font-geist-mono text-[8px] leading-none text-fog">
                {series.axis.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="relative min-w-0 flex-1">
                <svg
                  viewBox={`0 0 ${PLOT.w} ${PLOT.h}`}
                  preserveAspectRatio="none"
                  className="h-[150px] w-full overflow-visible"
                  aria-hidden
                  onPointerMove={(event) => {
                    const box = event.currentTarget.getBoundingClientRect();
                    const share = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
                    setHover(Math.round(share * (count - 1)));
                  }}
                  onPointerLeave={() => setHover(null)}
                >
                  <defs>
                    <linearGradient id="pace-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={series.color} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={series.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${line}L${PLOT.w},${PLOT.h}L0,${PLOT.h}Z`} fill="url(#pace-fill)" />
                  <path d={line} fill="none" stroke={series.color} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  <line x1={x(index)} x2={x(index)} y1={0} y2={PLOT.h} stroke="#171717" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                </svg>
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-3 whitespace-nowrap rounded-md border border-ash bg-white text-[9px] shadow-sm"
                  style={{ left: `${(index / (count - 1)) * 100}%`, transform: index > (count - 1) * 0.6 ? "translateX(calc(-100% - 6px))" : "translateX(6px)" }}
                >
                  <p className="border-b border-ash px-2 py-1 font-medium text-charcoal">{series.at(index)}</p>
                  <p className="flex items-center gap-3 px-2 py-1">
                    <span className="flex items-center gap-1 text-fog">
                      <span className="size-1.5 rounded-[2px]" style={{ backgroundColor: series.color }} />
                      {series.label}
                    </span>
                    <span className="font-medium tabular-nums text-charcoal">{series.figure(series.points[index])}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between pl-5 font-geist-mono text-[8px] text-fog">
              {series.ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tool scroll ─────────────────────────────────────────────────────────── */

const TOOLS: Array<{ label: string; icon: IconComponent }> = [
  { label: "Karta wzorów", icon: SquareFunction },
  { label: "Pióro i gumka", icon: PencilLine },
  { label: "Brudnopis", icon: NotebookPen },
  { label: "Kalkulator prosty", icon: Calculator },
  { label: "Notatki AI", icon: Sparkles },
  { label: "Do sprawdzenia", icon: Flag },
  { label: "Mapa zadań", icon: LayoutGrid },
  { label: "Zegar egzaminu", icon: Timer },
  { label: "Autozapis", icon: Save },
  { label: "Pełny ekran", icon: Expand },
  { label: "Zasady oceniania", icon: ListChecks },
  { label: "Raport po arkuszu", icon: ScanSearch },
];

function ToolPill({ label, icon: Icon }: { label: string; icon: IconComponent }) {
  return (
    <div className="flex w-fit items-center gap-2 rounded-xl border border-ash bg-canvas-muted px-2.5 py-1 ring-1 ring-black/5">
      <Icon className="size-4 text-steel" strokeWidth={1.75} />
      <span className="block truncate text-sm font-medium text-slate sm:text-base">{label}</span>
    </div>
  );
}

export function ToolScroll() {
  return (
    <div className="flex size-full flex-col items-center p-1 sm:p-3">
      <div className="flex items-center gap-2 rounded-t-xl border-x border-t border-[#ede9fe] bg-[#f5f3ff] px-3 pb-1 pt-1.5">
        <a href={CKE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="focus-ring rounded text-xs text-lavender hover:text-[#5b21b6]">
          cke.gov.pl · arkusze · maj 2025
        </a>
      </div>
      <div
        className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-smoke bg-gradient-to-b from-white to-canvas-muted px-5 py-2.5"
        style={{
          boxShadow:
            "0px 0.13px 3.15px 0px #00000004,0px 0.57px 6.52px 0px #00000007,0px 1.4px 13px 0px #00000009,0px 2.7px 25.48px 0px #0000000B,0px 4.54px 46.85px 0px #0000000E,0px 7px 80px 0px #00000012",
        }}
      >
        <MaturaIcon className="h-4 w-5" />
        <span className="block min-w-0 truncate text-sm font-medium text-slate sm:text-base">
          {SITTING.exam} · {SITTING.subject}
        </span>
      </div>
      <div aria-hidden className="relative min-h-0 w-full flex-1 select-none overflow-hidden">
        <div className="h-full [mask-image:linear-gradient(#0000,#000c_5%,#000c_30%,#0000)]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-col items-center gap-4 pt-4 [--scroll:-100%] [--scroll-duration:20s] motion-safe:animate-infinite-scroll-y">
              {TOOLS.map((tool) => (
                <ToolPill key={tool.label} {...tool} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Session cards ───────────────────────────────────────────────────────── */

const SESSIONS = [
  { mark: <MaturaIcon className="h-4 w-5" />, name: "Matura 2025", minutes: 180, latest: true },
  { mark: <MaturaIcon className="h-4 w-5" />, name: "Matura 2024", minutes: 180 },
  { mark: <E8Icon className="h-4 w-5" />, name: "Ósmoklasista 2025", minutes: 100 },
];

export function SessionCards() {
  return (
    <div aria-hidden className="flex size-full cursor-default select-none flex-col justify-center [mask-image:linear-gradient(90deg,black_80%,transparent)]">
      <div className="flex flex-col gap-2.5">
        {SESSIONS.map((session, index) => (
          <div key={session.name} className="group relative transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-x-[2%] hover:-translate-y-0.5" style={{ marginLeft: index * 23 }}>
            {session.latest ? (
              <span className="absolute -top-4 left-10 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#bbf7d0] bg-[#dcfce7] px-2.5 py-1 text-sm font-medium text-[#166534] sm:left-[100px]">
                <CircleCheck className="size-4" strokeWidth={2} />
                Nowy arkusz w dniu publikacji
              </span>
            ) : null}
            <div className={cn("flex items-center gap-3 rounded-xl border border-ash bg-white px-4 py-4 shadow-sm transition-[box-shadow,border-color] duration-300 group-hover:border-smoke group-hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]", session.latest && "pt-6")}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ash bg-gradient-to-t from-paper-mist to-white">{session.mark}</span>
              <span className="whitespace-nowrap text-lg text-charcoal">{session.name}</span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-ash bg-canvas-muted px-2 py-0.5 text-sm text-fog">
                <Clock className="size-3.5" strokeWidth={1.75} />
                {session.minutes} min
              </span>
              {session.latest ? (
                <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#dbeafe] bg-[#eff6ff] px-2 py-0.5 text-sm text-electric-blue">
                  <Flag className="size-3.5" strokeWidth={1.75} />
                  Najnowszy
                </span>
              ) : null}
              <ArrowUpRight
                className="ml-1 size-4 shrink-0 -translate-x-1 translate-y-1 text-fog opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                strokeWidth={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Answer log ──────────────────────────────────────────────────────────── */

/** A small ragged sparkline, as the reference draws in its stat cards. */
function Spark({ values, color }: { values: number[]; color: string }) {
  const top = Math.max(...values);
  const points = values.map((value, i) => `${(i / (values.length - 1)) * 60},${22 - (value / top) * 20}`).join(" ");
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-14" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

const STATS = [
  { label: "Odpowiedzi", value: "31", color: "#a78bfa", values: [2, 4, 3, 6, 5, 8, 6, 9, 7, 11, 9, 10, 14] },
  { label: "Notatki", value: "4", color: "#f472b6", values: [0, 1, 0, 2, 1, 1, 3, 1, 2, 4, 2, 3, 4] },
  { label: "Punkty", value: String(SITTING.score), color: "#60a5fa", values: [1, 3, 4, 6, 8, 10, 13, 15, 19, 24, 29, 35, 42] },
];

/** The sitting's last stretch, newest first — the film's script, logged. */
const EVENTS: Array<{ icon: IconComponent; event: string; task: string; tool: string; time: string }> = [
  { icon: Send, event: "Oddanie arkusza", task: "—", tool: "Zakończ egzamin", time: "11:21" },
  { icon: MousePointerClick, event: "Odpowiedź", task: "Zadanie 21", tool: "Prawda / fałsz", time: "11:19" },
  { icon: Flag, event: "Do sprawdzenia", task: "Zadanie 10", tool: "Flaga", time: "11:16" },
  { icon: StickyNote, event: "Notatka", task: "Zadanie 10", tool: "Notatki AI", time: "11:16" },
  { icon: PencilLine, event: "Rozwiązanie", task: "Zadanie 10", tool: "Pióro", time: "11:13" },
  { icon: SquareFunction, event: "Karta wzorów", task: "Zadanie 10", tool: "Funkcja kwadratowa", time: "11:09" },
  { icon: MousePointerClick, event: "Odpowiedź", task: "Zadanie 1", tool: "Wybór B", time: "11:06" },
  { icon: Eraser, event: "Poprawka", task: "Zadanie 31", tool: "Gumka", time: "11:02" },
];

export function AnswerLog() {
  return (
    <div aria-hidden className="size-full cursor-default select-none [mask-image:linear-gradient(90deg,black_85%,transparent)]">
      <div className="size-full [mask-image:linear-gradient(black_75%,transparent)]">
        <div className="grid grid-cols-3 gap-2 p-1">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "flex items-end justify-between rounded-lg bg-white px-3 py-2.5",
                index === 0 ? "border-2 border-charcoal" : "border border-ash",
              )}
            >
              <span className="flex flex-col">
                <span className="text-[9px] text-fog">{stat.label}</span>
                <span className="text-sm tabular-nums text-charcoal">{stat.value}</span>
              </span>
              <Spark values={stat.values} color={stat.color} />
            </div>
          ))}
        </div>
        <div className="mt-2 overflow-hidden rounded-lg border border-ash bg-white text-[9px]">
          <div className="grid grid-cols-[1.3fr_1fr_1.2fr_0.6fr] border-b border-ash bg-white font-medium text-charcoal [&>*]:px-2.5 [&>*]:py-2">
            <span>Zdarzenie</span>
            <span>Zadanie</span>
            <span>Narzędzie</span>
            <span>Godzina</span>
          </div>
          {EVENTS.map((row) => (
            <div key={`${row.event}-${row.time}-${row.task}`} className="grid grid-cols-[1.3fr_1fr_1.2fr_0.6fr] border-b border-ash text-fog last:border-0 [&>*]:px-2.5 [&>*]:py-[7px]">
              <span className="flex items-center gap-1.5">
                <row.icon className="size-3 shrink-0 text-silver" strokeWidth={1.75} />
                {row.event}
              </span>
              <span className="text-steel">{row.task}</span>
              <span>{row.tool}</span>
              <span className="tabular-nums">{row.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
