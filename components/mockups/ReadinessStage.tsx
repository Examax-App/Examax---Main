"use client";

import { useEffect, useState } from "react";
import {
  ChartColumn,
  Check,
  Copy,
  Divide,
  FileText,
  Flame,
  House,
  ListChecks,
  ListOrdered,
  Lock,
  PencilLine,
  Percent,
  Route,
  Ruler,
  Sigma,
  Target,
  Timer,
  Triangle,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Sparkline } from "@/components/ui/Sparkline";
import { usePanelCurrent } from "@/components/sections/FeatureStage";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * The Postępy section's three pictures, one per sub-feature below the band,
 * each a template copy of the reference's partners section (dub.co, read off
 * its live DOM and recorded frame by frame):
 *
 *  - TopicFeed          ← 1-click global payouts: a stat bar, the dark pill,
 *                         and a feed of rows stepping up
 *  - WeakSpots          ← advanced reward structure: two columns of cards
 *                         scrolling past each other
 *  - ReadinessDashboard ← embedded referral dashboard: the product inside an
 *                         app window
 *
 * All drawn on the 800×440 stage; FeatureStage scales it on narrow screens.
 * PLACEHOLDER DATA — the topics, points and figures are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* 1 · Topic feed                                                            */
/* ------------------------------------------------------------------------ */

type FeedRow = { topic: string; icon: IconComponent; source: IconComponent; points: number };

/** One loop of an evening's practice; the feed cycles through it. */
const ROWS: FeedRow[] = [
  { topic: "Procenty", icon: Percent, source: FileText, points: 1 },
  { topic: "Funkcja liniowa", icon: ChartColumn, source: ListChecks, points: 2 },
  { topic: "Ciągi", icon: ListOrdered, source: FileText, points: 1 },
  { topic: "Geometria", icon: Triangle, source: ListChecks, points: 3 },
  { topic: "Równania", icon: Divide, source: FileText, points: 2 },
  { topic: "Potęgi", icon: Sigma, source: ListChecks, points: 1 },
  { topic: "Bryły", icon: Ruler, source: FileText, points: 3 },
  { topic: "Statystyka", icon: ChartColumn, source: ListChecks, points: 2 },
];

const LOOP_POINTS = ROWS.reduce((sum, row) => sum + row.points, 0);
const BASE = { points: 1240, tasks: 412, toGoal: 140 };

/** The reference's row pitch: 40px rows overlapping by their 1px border. */
const PITCH = 39;
const VISIBLE = 7;
/** The reference's beat, a little over a second a row. */
const BEAT = 1200;

function totalsAfter(count: number) {
  const loops = Math.floor(count / ROWS.length);
  const rest = ROWS.slice(0, count % ROWS.length).reduce((sum, row) => sum + row.points, 0);
  const points = loops * LOOP_POINTS + rest;
  // The goal refills once it is reached, as the reference's payout does.
  const toGoal = BASE.toGoal - (points % BASE.toGoal);
  return { points: BASE.points + points, tasks: BASE.tasks + count, toGoal };
}

export function TopicFeed() {
  const current = usePanelCurrent();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!current || !inView || reducedMotion) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), BEAT);
    return () => window.clearInterval(timer);
  }, [current, inView, reducedMotion]);

  const totals = totalsAfter(step);
  // The row leaving over the top, the ones on show, and one waiting below.
  const rows = Array.from({ length: VISIBLE + 2 }, (_, k) => step - 1 + k).filter((i) => i >= 0);

  return (
    <div ref={ref} aria-hidden className="relative size-full pt-12">
      <div className="size-full select-none overflow-hidden px-12 [mask-image:linear-gradient(black_75%,transparent)]">
        <div className="relative z-0 mx-auto flex size-full max-w-sm flex-col items-center">
          <div className="shrink-0 rounded-[10px] border border-ash bg-white p-1.5 shadow-subtle">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-ash bg-ash">
              {[
                { label: "Punkty", value: totals.points, icon: Target },
                { label: "Zadania", value: totals.tasks, icon: ListChecks },
              ].map((stat) => (
                <div key={stat.label} className="flex h-full items-center gap-2.5 bg-canvas-muted p-2.5 pr-6">
                  <div className="flex size-8 items-center justify-center rounded-md border border-ash text-graphite">
                    <stat.icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="flex h-full flex-col">
                    <span className="text-[10px] text-fog">{stat.label}</span>
                    <RollingNumber value={stat.value} lineHeight={16} className="text-xs font-medium text-graphite" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-5 w-px shrink-0 bg-ash" />
          {/* The reference's dark pill: what is left to the week's goal */}
          <div className="relative z-10 flex shrink-0 items-center gap-2 rounded-lg bg-graphite p-1 pr-2 shadow-md">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white">
              <BrandMark className="size-3.5 text-charcoal" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span className="font-semibold">Do celu</span>
              <span className="flex font-medium">
                <RollingNumber value={totals.toGoal} lineHeight={16} />
                &nbsp;pkt
              </span>
            </div>
          </div>
          <div className="h-5 w-px shrink-0 bg-ash" />
          <div className="relative w-full">
            {rows.map((index) => {
              const row = ROWS[index % ROWS.length];
              const leaving = index < step;
              return (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-x-0 top-0 flex h-10 items-center justify-between gap-2 rounded-md border border-ash bg-white pl-2 pr-4 text-[10px] transition-[transform,opacity] duration-300",
                    leaving && "opacity-0",
                  )}
                  style={{ transform: `translateY(${(index - step) * PITCH}px) scaleX(${leaving ? 0.5 : 1})` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="flex size-5 items-center justify-center rounded-full border border-ash bg-canvas-muted text-graphite">
                        <row.icon className="size-2.5" strokeWidth={2} />
                      </div>
                      <div className="absolute -right-1 -top-px rounded-full bg-canvas-muted p-px">
                        <MaturaIcon className="h-2 w-2" />
                      </div>
                    </div>
                    <span className="text-graphite">{row.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <row.source className="size-3 text-steel" strokeWidth={1.75} />
                    <span className="tabular-nums text-fog">+{row.points} pkt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Weak spots                                                            */
/* ------------------------------------------------------------------------ */

type Spot = {
  icon: IconComponent;
  text: React.ReactNode;
  /** An exam chip, or the number of tasks queued to fix it. */
  tag: { exam: "matura" | "e8" } | { tasks: number };
};

function Pts({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-electric-blue">{children}</strong>;
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold">{children}</strong>;
}

const SPOTS: [Spot[], Spot[]] = [
  [
    { icon: Divide, text: <>Tracisz <Pts>2 pkt</Pts> przy mnożeniu <Bold>nawiasów</Bold></>, tag: { tasks: 8 } },
    { icon: Sigma, text: <><Pts>40%</Pts> błędów w funkcji kwadratowej to <Bold>znak delty</Bold></>, tag: { exam: "matura" } },
    { icon: Timer, text: <>Na <Bold>procentach</Bold> tracisz średnio <Pts>3 min</Pts> na zadanie</>, tag: { tasks: 5 } },
    { icon: Ruler, text: <>Gubisz <Bold>jednostki</Bold> w <Pts>1 na 4</Pts> zadaniach tekstowych</>, tag: { exam: "e8" } },
  ],
  [
    { icon: Triangle, text: <>W <Bold>geometrii</Bold> uciekają Ci <Pts>4 pkt</Pts> na arkusz</>, tag: { tasks: 12 } },
    { icon: ListOrdered, text: <><Bold>Ciągi</Bold> wracają do powtórki <Pts>za 2 dni</Pts></>, tag: { exam: "matura" } },
    { icon: Percent, text: <>Mylisz <Bold>punkty procentowe</Bold> z procentami w <Pts>30%</Pts> zadań</>, tag: { tasks: 6 } },
    { icon: FileText, text: <><Bold>Uzasadnienia</Bold> kosztują Cię <Pts>3 pkt</Pts> na arkusz</>, tag: { exam: "matura" } },
  ],
];

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-ash bg-white p-4">
      <div className="flex w-full items-start justify-between">
        <div className="rounded-full border border-ash p-1.5 text-graphite">
          <spot.icon className="size-3.5" strokeWidth={1.75} />
        </div>
        {"exam" in spot.tag ? (
          <div className="flex items-center gap-1 rounded-full bg-paper-mist px-1.5 py-1 text-[10px] leading-none text-slate">
            {spot.tag.exam === "matura" ? <MaturaIcon className="h-2 w-2.5" /> : <E8Icon className="h-2 w-2.5" />}
            {spot.tag.exam === "matura" ? "Matura" : "Ósmoklasista"}
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full border-[0.5px] border-[#bbf7d0] bg-[#dcfce7] px-1.5 py-1 text-[10px] font-medium leading-none text-[#166534]">
            <PencilLine className="size-2.5" strokeWidth={2} />+{spot.tag.tasks} zadań
          </div>
        )}
      </div>
      <span className="text-[10px] leading-4 text-charcoal">{spot.text}</span>
    </div>
  );
}

/**
 * Two columns of cards scrolling past each other, the reference's own: each
 * column holds its cards twice and slides half its height over 50s, the second
 * running backwards half a loop out of step.
 */
export function WeakSpots() {
  return (
    <div aria-hidden className="relative size-full [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]">
      <div className="mx-auto grid size-full max-w-lg select-none grid-cols-2 gap-4 overflow-hidden">
        {SPOTS.map((column, i) => (
          <div key={i} className="relative size-full">
            <div
              className={cn(
                "flex flex-col [--marquee-duration:50s] motion-reduce:animate-none",
                i === 0 ? "animate-marquee-up" : "animate-marquee-down",
              )}
            >
              {/* Each card carries its own bottom padding rather than a flex
                  gap, so the loop point is exactly half the height. */}
              {[...column, ...column].map((spot, k) => (
                <div key={k} className="pt-5">
                  <SpotCard spot={spot} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · Readiness dashboard                                                   */
/* ------------------------------------------------------------------------ */

const NAV: Array<{ icon: IconComponent; label: string; active?: boolean }> = [
  { icon: House, label: "Start" },
  { icon: Route, label: "Roadmapa" },
  { icon: PencilLine, label: "Trening" },
  { icon: ChartColumn, label: "Postępy", active: true },
];

const GOALS = [
  { icon: ListChecks, text: "20 zadań dziennie przez tydzień" },
  { icon: Target, text: "85% w arkuszu próbnym" },
  { icon: Flame, text: "Seria nauki: 34 dni z rzędu" },
];

const STATS = [
  { label: "Zadania", value: "1 220" },
  { label: "Poprawne", value: "892" },
  { label: "Wynik", value: "72%" },
];

const TABS = ["Tematy", "Arkusze", "Seria", "Cele", "Pomoc"];

/**
 * The product in its own window: the app's sidebar, and the progress page open
 * beside it — the readiness score with its goals, a hero on the brand grid,
 * stats with their trend lines, tabs and a table. It rises in each time the
 * panel is shown, as the reference's does.
 */
export function ReadinessDashboard() {
  return (
    <div
      aria-hidden
      className="flex size-full select-none flex-col items-center justify-end pt-12 [mask-composite:intersect] [mask-image:linear-gradient(black_80%,transparent),linear-gradient(transparent,black_20%,black_80%,transparent)]"
    >
      <div className="flex h-[392px] w-[640px] flex-col overflow-hidden rounded-t-xl border border-b-0 border-ash bg-white shadow-subtle [--offset:16px] in-data-[current=true]:motion-safe:animate-rise">
        {/* The window's chrome */}
        <div className="flex h-7 shrink-0 items-center gap-3 border-b border-ash bg-canvas-muted px-3">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full border border-smoke bg-white" />
            ))}
          </span>
          <span className="mx-auto flex h-[18px] w-[240px] items-center justify-center gap-1 rounded-[5px] bg-paper-mist text-[9px] text-steel">
            <Lock className="size-2" strokeWidth={2.25} />
            examax.app
          </span>
        </div>

        <div className="flex min-h-0 flex-1 bg-canvas-muted">
          {/* The app's own sidebar */}
          <div className="flex w-[124px] shrink-0 flex-col gap-1 px-3 pt-8">
            <div className="mb-3 flex size-7 items-center justify-center rounded-full bg-charcoal">
              <BrandMark className="size-3.5 text-white" />
            </div>
            {NAV.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "flex h-6 items-center gap-2 rounded-md px-2 text-[10px] font-medium",
                  item.active ? "bg-soft-blue text-electric-blue" : "text-graphite",
                )}
              >
                <item.icon className="size-3" strokeWidth={2} />
                {item.label}
              </span>
            ))}
          </div>

          {/* The progress page */}
          <div className="mt-6 min-w-0 flex-1 rounded-tl-xl border-l border-t border-ash bg-white p-3">
            <div className="flex gap-3 rounded-lg border border-ash p-3">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[9px] font-semibold text-charcoal">Gotowość do matury</span>
                <div className="mt-1.5 flex items-end gap-1.5">
                  <span className="text-[20px] font-semibold leading-none text-charcoal tabular-nums">72%</span>
                  <span className="pb-0.5 text-[8px] text-[#16a34a]">+6 w tym tygodniu</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper-mist">
                  <div className="h-full w-[72%] rounded-full bg-electric-blue" />
                </div>
                <span className="mt-3 text-[9px] font-semibold text-charcoal">Cele</span>
                <div className="mt-1 flex flex-col gap-1 rounded-md border border-ash p-1.5">
                  {GOALS.map((goal) => (
                    <span key={goal.text} className="flex items-center gap-1.5 text-[8px] text-slate">
                      <goal.icon className="size-2.5 text-steel" strokeWidth={2} />
                      {goal.text}
                    </span>
                  ))}
                </div>
              </div>
              {/* The hero: the brand mark on the blue grid */}
              <div className="relative w-[160px] shrink-0 overflow-hidden rounded-md bg-[linear-gradient(135deg,#eff6ff,#dbeafe)]">
                <div className="absolute inset-0 bg-[linear-gradient(#bfdbfe_1px,transparent_1px),linear-gradient(90deg,#bfdbfe_1px,transparent_1px)] opacity-60 [background-size:12px_12px]" />
                <div className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm">
                  <div className="flex size-9 items-center justify-center rounded-full bg-charcoal">
                    <BrandMark className="size-4 text-white" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-[4px] bg-white px-1 py-0.5 text-[6px] text-steel">
                  <Copy className="size-1.5" strokeWidth={2.5} />
                  Udostępnij Postępy
                </span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-[1fr_1fr_1fr_112px] gap-2">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col rounded-lg border border-ash p-2">
                  <span className="text-[8px] text-slate">{stat.label}</span>
                  <span className="text-[10px] font-medium text-charcoal tabular-nums">{stat.value}</span>
                  <Sparkline className="mt-1 h-5 w-full" />
                </div>
              ))}
              <div className="flex flex-col gap-1 rounded-lg border border-ash p-2 text-[8px]">
                <span className="flex items-center justify-between font-semibold text-charcoal">
                  Seria
                  <Flame className="size-2.5 text-steel" strokeWidth={2} />
                </span>
                <span className="mt-1 flex justify-between text-slate">
                  Obecna <span className="font-medium text-charcoal">34 dni</span>
                </span>
                <span className="flex justify-between text-slate">
                  Najlepsza <span className="font-medium text-charcoal">51 dni</span>
                </span>
              </div>
            </div>

            <div className="mt-3 flex gap-3 border-b border-ash text-[8px]">
              {TABS.map((tab, i) => (
                <span
                  key={tab}
                  className={cn("pb-1.5", i === 0 ? "border-b border-charcoal font-medium text-charcoal" : "text-fog")}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-[1fr_80px_48px] rounded-md bg-canvas-muted px-2 py-1.5 text-[8px] font-medium text-slate">
              <span>Temat</span>
              <span>Status</span>
              <span className="text-right">Wynik</span>
            </div>
            {[
              { topic: "Funkcja kwadratowa", status: "W trakcie", score: "64%" },
              { topic: "Procenty", status: "Opanowany", score: "92%" },
            ].map((row) => (
              <div key={row.topic} className="grid grid-cols-[1fr_80px_48px] px-2 py-1.5 text-[8px] text-slate">
                <span className="flex items-center gap-1">
                  <Check className="size-2 text-silver" strokeWidth={2.5} />
                  {row.topic}
                </span>
                <span>{row.status}</span>
                <span className="text-right tabular-nums text-charcoal">{row.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
