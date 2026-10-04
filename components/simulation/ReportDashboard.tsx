"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  Calculator,
  Clock,
  Flag,
  Layers,
  ListChecks,
  NotebookPen,
  PencilLine,
  SquareFunction,
  Target,
  Timer,
} from "lucide-react";
import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { SubjectMark } from "@/components/progress/SubjectMark";
import { monotonePath } from "@/components/progress/curve";
import { SITTING } from "@/components/simulation/sitting";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * /simulation's report dashboard — dub.co/solutions/creators' "Gain deeper
 * audience insights", one to one in build (live DOM, 2026-10-02):
 *
 *  - a muted strip on top: round source tokens drifting sideways on the
 *    left, a two-way toggle on the right. Switching it swaps the tokens and
 *    brings the other figures into focus, the rest blurring out, as dub's
 *    Links ⇄ Sales does;
 *  - under it the chart card: three tabs with counting figures, the chosen
 *    one underlined, over a 420px chart with dashed rules and a tooltip that
 *    follows the pointer;
 *  - two breakdown cards of tinted bar rows, fading out at the foot.
 *
 * Dub charts one creator's clicks across a month; this is one learner's
 * eight simulations, one a month from September to April, ending on the sitting the rest
 * of the page describes (42/50 in 141 minutes). The line is the progress
 * charts' monotone curve rather than dub's straight segments.
 *
 * PLACEHOLDER DATA — the learner's earlier sittings and topics are illustrative.
 */

const SITTINGS = ["wrzesień", "październik", "listopad", "grudzień", "styczeń", "luty", "marzec", "kwiecień"];
const SHORT = ["wrz", "paź", "lis", "gru", "sty", "lut", "mar", "kwi"];
/**
 * Each sitting's result as a share of its paper's points. The papers differ —
 * CKE's 2023 and 2024 basic maths papers are worth 46 points, 2025's is
 * worth 50 — so sittings are compared in percent, never in raw points.
 */
const PERCENT = [48, 54, 52, 62, 68, 72, 78, SITTING.percent];
const MINUTES = [176, 171, 168, 162, 157, 151, 146, SITTING.minutes];
/** Matura's pass mark at the basic level. */
const PASS_MARK = 30;

type Metric = {
  key: "result" | "margin" | "minutes";
  label: string;
  color: string;
  values: number[];
  top: number;
  bottom: number;
  ticks: number[];
  /** How a value is written: on the tab, the axis and in the tooltip. */
  unit: "%" | " pkt proc." | " min";
};

const METRICS: Metric[] = [
  { key: "result", label: "Wynik", color: SITTING.metrics[0].color, values: PERCENT, top: 100, bottom: 30, ticks: [40, 60, 80], unit: "%" },
  {
    key: "margin",
    label: "Zapas nad progiem",
    color: SITTING.metrics[1].color,
    values: PERCENT.map((percent) => percent - PASS_MARK),
    top: 70,
    bottom: 0,
    ticks: [20, 40, 60],
    unit: " pkt proc.",
  },
  { key: "minutes", label: "Czas", color: SITTING.metrics[2].color, values: MINUTES, top: 185, bottom: 130, ticks: [140, 160, 180], unit: " min" },
];

/** Which tabs each side of the toggle brings into focus. */
const MODES = {
  result: { label: "Wynik", icon: Target, focus: ["result", "margin"] },
  time: { label: "Czas", icon: Clock, focus: ["minutes"] },
} as const;
type Mode = keyof typeof MODES;

const TOKEN = "flex size-8 shrink-0 items-center justify-center rounded-full border border-canvas-muted bg-white shadow-sm";

/** Where the results come from: the exams and their subjects. */
const RESULT_TOKENS: Array<{ title: string; node: React.ReactNode }> = [
  { title: "Matura", node: <MaturaIcon className="h-3.5 w-4" /> },
  { title: "Egzamin ósmoklasisty", node: <E8Icon className="h-3.5 w-4" /> },
  { title: "CKE", node: <CkeIcon className="h-3.5 w-auto" /> },
  { title: "Matematyka", node: <SubjectMark subject="math" className="size-4" /> },
  { title: "Język polski", node: <SubjectMark subject="polish" className="size-4" /> },
  { title: "Język angielski", node: <SubjectMark subject="english" className="size-4" /> },
];

/** What the time goes on: the tools of the sheet. */
const TIME_TOKENS: Array<{ title: string; icon: IconComponent }> = [
  { title: "Zegar", icon: Timer },
  { title: "Pióro", icon: PencilLine },
  { title: "Karta wzorów", icon: SquareFunction },
  { title: "Kalkulator", icon: Calculator },
  { title: "Brudnopis", icon: NotebookPen },
  { title: "Do sprawdzenia", icon: Flag },
];

/** The breakdowns: points per topic (adding up to 42 of 50), and the slowest tasks. */
const TOPICS = [
  { label: "Funkcje", got: 13, of: 14 },
  { label: "Wyrażenia i równania", got: 10, of: 10 },
  { label: "Planimetria", got: 7, of: 9 },
  { label: "Ciągi", got: 6, of: 7 },
  { label: "Stereometria", got: 4, of: 6 },
  { label: "Statystyka", got: 2, of: 4 },
];

const SLOWEST = SITTING.perTask
  .map((minutes, index) => ({ task: index + 1, minutes }))
  .sort((a, b) => b.minutes - a.minutes)
  .slice(0, 6);

/**
 * The plot in its own 0–100 box, stretched to the card: the line and the
 * fill are drawn in SVG, and everything with text or a round mark (axis
 * labels, the hover dot, the tooltip) sits in HTML over it, so it keeps
 * its size at every width.
 */
const PAD = { left: 6, right: 1.5, top: 6, bottom: 12 };

function Chart({ metric }: { metric: Metric }) {
  const count = metric.values.length;
  const [hover, setHover] = useState<number | null>(null);
  const index = hover ?? count - 2;
  const x = (i: number) => PAD.left + (i / (count - 1)) * (100 - PAD.left - PAD.right);
  const y = (value: number) => PAD.top + (1 - (value - metric.bottom) / (metric.top - metric.bottom)) * (100 - PAD.top - PAD.bottom);
  const floor = 100 - PAD.bottom;
  const line = monotonePath(metric.values.map((value, i) => [x(i), y(value)] as const));
  const value = metric.values[index];
  const axisUnit = metric.key === "result" ? "%" : "";

  return (
    <div
      className="relative size-full"
      role="img"
      aria-label={`${metric.label} w ośmiu symulacjach, od września do kwietnia: od ${metric.values[0]}${metric.unit} do ${metric.values[count - 1]}${metric.unit}`}
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const share = ((event.clientX - box.left) / box.width) * 100;
        setHover(Math.min(count - 1, Math.max(0, Math.round(((share - PAD.left) / (100 - PAD.left - PAD.right)) * (count - 1)))));
      }}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`report-fill-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {metric.ticks.map((tick) => (
          <line key={tick} x1={PAD.left} x2={100 - PAD.right} y1={y(tick)} y2={y(tick)} stroke="#e5e5e5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={PAD.left} x2={100 - PAD.right} y1={floor} y2={floor} stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
        <path d={`${line}L${x(count - 1)},${floor}L${x(0)},${floor}Z`} fill={`url(#report-fill-${metric.key})`} />
        <path d={line} fill="none" stroke={metric.color} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <line x1={x(index)} x2={x(index)} y1={PAD.top} y2={floor} stroke="#d4d4d4" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* The axes, in HTML so they keep their size */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-[11px] text-silver">
        {metric.ticks.map((tick) => (
          <span key={tick} className="absolute -translate-y-1/2 text-right" style={{ top: `${y(tick)}%`, right: `${100 - PAD.left + 1.2}%` }}>
            {tick}
            {axisUnit}
          </span>
        ))}
        {SHORT.map((label, i) => (
          <span key={i} className="absolute bottom-0 -translate-x-1/2" style={{ left: `${x(i)}%` }}>
            {label}
          </span>
        ))}
        <span
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-[left,top] duration-100"
          style={{ left: `${x(index)}%`, top: `${y(value)}%`, backgroundColor: metric.color }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 w-max rounded-lg border border-ash bg-white shadow-sm transition-[left] duration-100"
        style={{ left: `${x(index)}%`, transform: index > count / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
      >
        <p className="border-b border-ash px-3 py-2 text-xs text-charcoal sm:px-4 sm:py-3 sm:text-sm">
          Symulacja {index + 1} · {SITTINGS[index]}
        </p>
        <div className="grid grid-cols-2 gap-x-6 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
          <span className="flex items-center gap-2 text-steel">
            <span className="size-2 rounded-sm opacity-60 shadow-[inset_0_0_0_1px_#0003]" style={{ backgroundColor: metric.color }} />
            {metric.label}
          </span>
          <span className="text-right font-medium tabular-nums text-charcoal">
            {value}
            {metric.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

function BarCard({
  title,
  unitIcon: UnitIcon,
  unit,
  tint,
  rows,
}: {
  title: string;
  unitIcon: IconComponent;
  unit: string;
  tint: string;
  rows: Array<{ icon: React.ReactNode; label: string; value: string; share: number }>;
}) {
  return (
    <div
      className="relative z-0 h-[300px] overflow-hidden rounded-xl border border-ash bg-white"
      style={{ boxShadow: "0 1.55px 5.37px 0 #00000009,0 7.35px 20.99px 0 #0000000E" }}
    >
      <div className="flex items-center justify-between border-b border-ash px-4">
        <div className="relative px-3 py-4 text-sm text-charcoal">
          {title}
          <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-t-full bg-charcoal" />
        </div>
        <span className="flex items-center gap-1.5 text-xs uppercase text-fog">
          <UnitIcon className="size-3.5" strokeWidth={1.75} />
          {unit}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-4 py-4 [mask-image:linear-gradient(black_60%,transparent)]">
        {rows.map((row) => (
          <div key={row.label} className="relative flex h-8 items-center justify-between px-3 text-sm">
            <span className="absolute inset-y-0 left-0 rounded-md" style={{ width: `${row.share}%`, backgroundColor: tint }} />
            <span className="relative flex items-center gap-3 text-graphite">
              {row.icon}
              {row.label}
            </span>
            <span className="relative tabular-nums text-graphite">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportDashboard() {
  const [mode, setMode] = useState<Mode>("result");
  const [active, setActive] = useState<Metric["key"]>("result");
  const focus: readonly string[] = MODES[mode].focus;
  const metric = METRICS.find((item) => item.key === active)!;

  const switchMode = (next: Mode) => {
    setMode(next);
    setActive(MODES[next].focus[0]);
  };

  // The longest bar fills its row, as the reference's first row does.
  const topTopic = Math.max(...TOPICS.map((topic) => topic.got));
  const slowest = SLOWEST[0].minutes;

  return (
    <div className="px-4 pt-12 [mask-image:linear-gradient(black_80%,transparent)]">
      <div className="mx-auto w-full max-w-[880px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            {/* The strip: the sources drifting by, and the toggle */}
            <div className="hidden grid-cols-3 rounded-t-xl border-x border-t border-ash bg-canvas-muted pb-2 sm:grid">
              <div className="relative col-span-2 h-[72px]">
                {(Object.keys(MODES) as Mode[]).map((key) => (
                  <div
                    key={key}
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-200 [mask-image:linear-gradient(90deg,transparent_12px,black_36px,black_calc(100%-36px),transparent_calc(100%-12px))]",
                      key === mode ? "opacity-100" : "translate-y-1 opacity-0",
                    )}
                  >
                    <div className="flex h-full w-full items-center overflow-hidden px-6">
                      {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center gap-2.5 pr-2.5 [--scroll:-100%] [--scroll-duration:20s] motion-safe:animate-infinite-scroll">
                          {key === "result"
                            ? [...RESULT_TOKENS, ...RESULT_TOKENS].map((token, i) => (
                                <span key={i} className={TOKEN} title={token.title}>
                                  {token.node}
                                </span>
                              ))
                            : [...TIME_TOKENS, ...TIME_TOKENS].map((token, i) => (
                                <span key={i} className={TOKEN} title={token.title}>
                                  <token.icon className="size-4 text-slate" strokeWidth={1.75} />
                                </span>
                              ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end pr-4">
                <div role="radiogroup" aria-label="Pokaż" className="relative flex w-fit items-center gap-1 rounded-xl bg-paper-mist p-0.5">
                  {(Object.keys(MODES) as Mode[]).map((key) => {
                    const { label, icon: Icon } = MODES[key];
                    const selected = key === mode;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => switchMode(key)}
                        className={cn(
                          "focus-ring relative flex h-8 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
                          selected ? "border-ash bg-white text-charcoal" : "border-transparent text-charcoal hover:text-steel",
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* The chart card */}
            <div
              className="relative overflow-hidden rounded-xl border border-ash bg-white sm:-mt-2"
              style={{ boxShadow: "0 1.55px 5.37px 0 #00000009,0 7.35px 20.99px 0 #0000000E" }}
            >
              <div role="tablist" aria-label="Wskaźnik" className="grid grid-cols-3 divide-x divide-ash border-b border-ash">
                {METRICS.map((item) => {
                  const inFocus = focus.includes(item.key);
                  const selected = item.key === active;
                  const last = item.values[item.values.length - 1];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      disabled={!inFocus}
                      onClick={() => setActive(item.key)}
                      className="focus-ring relative block h-full w-full min-w-0 px-4 py-3 text-left transition-colors enabled:hover:bg-canvas-muted enabled:active:bg-paper-mist sm:px-8 sm:py-6"
                    >
                      <span
                        aria-hidden
                        className={cn("absolute bottom-0 left-0 h-0.5 w-full bg-charcoal transition-transform duration-100", selected ? "" : "translate-y-[3px]")}
                      />
                      <span className={cn("flex items-center gap-2.5 text-sm text-steel transition-[opacity,filter] duration-200", !inFocus && "blur-[6px]")}>
                        <span className="size-2 rounded-sm opacity-60 shadow-[inset_0_0_0_1px_#00000019]" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span className={cn("mt-1 flex items-baseline gap-1 transition-[opacity,filter] duration-200", !inFocus && "opacity-50 blur-[6px]")}>
                        <NumberFlow value={last} locales="pl-PL" className="text-xl font-medium text-charcoal sm:text-2xl" />
                        <span className="text-sm text-fog">{item.unit.trim()}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="h-[300px] w-full p-4 sm:h-[420px]">
                <Chart key={metric.key} metric={metric} />
              </div>
            </div>
          </div>

          <BarCard
            title="Działy"
            unitIcon={Layers}
            unit="Punkty"
            tint="#ede9fe"
            rows={TOPICS.map((topic) => ({
              icon: <Layers className="size-4 text-lavender" strokeWidth={1.75} />,
              label: topic.label,
              value: `${topic.got}/${topic.of}`,
              share: (topic.got / topTopic) * 100,
            }))}
          />
          <BarCard
            title="Najdłuższe zadania"
            unitIcon={Clock}
            unit="Minuty"
            tint="#dbeafe"
            rows={SLOWEST.map((row) => ({
              icon: <ListChecks className="size-4 text-electric-blue" strokeWidth={1.75} />,
              label: `Zadanie ${row.task}`,
              value: `${row.minutes} min`,
              share: (row.minutes / slowest) * 100,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
