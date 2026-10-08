"use client";

import { useEffect, useState } from "react";
import { Check, Circle, Gauge, Hash, Lock, Percent, Timer, Triangle, Equal } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { E8Icon } from "@/components/ui/E8Icon";
import { Sparkline } from "@/components/ui/Sparkline";
import { Confetti } from "@/components/training/Confetti";
import { GridPattern } from "@/components/training/GridPattern";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * The "Trenuj po swojemu" section's three pictures, each a template copy of
 * the matching cell of dub.co/partners' "Seamless integration":
 *
 *  - SetBuilder   ← AI landing page generator: a settings list wired into a
 *                   browser window, the page re-tinting as one setting cycles
 *  - TimedWindow  ← Embedded referral dashboard: the product inside an app
 *                   window, top edge sharp, bottom fading out
 *  - FirstSteps   ← Get started in hours: three steps spinning to done, then
 *                   the launched state and a burst of confetti, on a loop
 *
 * PLACEHOLDER DATA — the sets, times and topics are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* 1 · Set builder                                                          */
/* ------------------------------------------------------------------------ */

const THEMES = [
  { topic: "Procenty", slug: "procenty", accent: "#16a34a", soft: "#dcfce7" },
  { topic: "Równania", slug: "rownania", accent: "#2563eb", soft: "#dbeafe" },
  { topic: "Geometria", slug: "geometria", accent: "#7c3aed", soft: "#ede9fe" },
];

const OPTION_ROW = 29;

export function SetBuilder() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % THEMES.length), 1800);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  const theme = THEMES[index];
  const options: Array<{ label: string; icon: React.ReactNode }> = [
    { label: "Egzamin", icon: <E8Icon className="size-2.5" /> },
    {
      label: "Temat",
      icon: (
        <span className="grid size-full place-items-center rounded-full text-white transition-colors duration-300" style={{ background: theme.accent }}>
          <Check className="size-2" strokeWidth={3.5} />
        </span>
      ),
    },
    { label: "Poziom", icon: <Gauge className="size-2.5 text-graphite" strokeWidth={2} /> },
    { label: "Liczba zadań", icon: <Hash className="size-2.5 text-graphite" strokeWidth={2} /> },
  ];

  return (
    <div
      ref={ref}
      aria-hidden
      inert
      className="size-full [mask-composite:intersect] [mask-image:linear-gradient(90deg,black_50%,transparent),linear-gradient(black_50%,transparent)]"
    >
      <div className="relative mx-auto h-full w-[360px] max-w-full">
        {/* The settings, wired into the page they build */}
        <div className="absolute left-0 top-[34px] z-10 w-[100px] overflow-hidden rounded-lg border border-ash bg-white shadow-subtle">
          {options.map((option) => (
            <div key={option.label} className="flex items-center gap-1.5 border-b border-ash px-2 last:border-b-0" style={{ height: OPTION_ROW }}>
              <span className="grid size-4 shrink-0 place-items-center rounded-full border border-ash bg-white">{option.icon}</span>
              <span className="text-[9px] text-charcoal">{option.label}</span>
            </div>
          ))}
        </div>
        <svg className="absolute left-[100px] top-[34px] h-[120px] w-[32px] overflow-visible text-smoke" fill="none" stroke="currentColor">
          {options.map((_, row) => {
            const y = row * OPTION_ROW + OPTION_ROW / 2;
            const mid = 2 * OPTION_ROW;
            const bend = y < mid ? 1 : -1;
            return (
              <path
                key={row}
                d={`M0 ${y} H10 Q16 ${y} 16 ${y + 6 * bend} V${mid - 6 * bend} Q16 ${mid} 22 ${mid} H32`}
              />
            );
          })}
        </svg>

        {/* The set's page */}
        <div className="absolute left-[132px] top-0 w-[240px] rounded-lg border border-ash bg-white shadow-sm">
          <div className="flex items-center gap-2 px-2.5 py-2">
            <span className="flex gap-1">
              <span className="size-1.5 rounded-full bg-[#ff5f57]" />
              <span className="size-1.5 rounded-full bg-[#febc2e]" />
              <span className="size-1.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="ml-auto flex items-center gap-1 text-[7px] text-silver">
              <Lock className="size-2" strokeWidth={2.5} />
              examax.app/zestaw/{theme.slug}
            </span>
          </div>
          <div className="mx-2 mb-2 rounded-md border border-ash p-3">
            <div className="flex items-center justify-between">
              <BrandMark className="h-2.5 text-charcoal" />
              <span className="flex items-center gap-1.5 text-[6px] text-fog">
                Zaloguj się
                <span className="h-2.5 w-7 rounded-[3px] transition-colors duration-300" style={{ background: theme.soft }} />
              </span>
            </div>
            <p className="mt-6 text-[6px] font-semibold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.accent }}>
              Zestaw zadań
            </p>
            <p className="mt-1 text-[12px] font-semibold leading-tight text-charcoal">
              {theme.topic} <span className="text-silver">— powtórka</span>
              <br />
              przed egzaminem
            </p>
            <p className="mt-1.5 text-[6px] leading-snug text-fog">
              Dwanaście zadań z arkuszy CKE, od najłatwiejszego do poziomu egzaminacyjnego. Każde sprawdzone od razu, według
              zasad oceniania.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {[
                { icon: Hash, value: "12", label: "Zadań" },
                { icon: Timer, value: "~25 min", label: "Czas" },
              ].map((tile) => (
                <div key={tile.label} className="rounded-md bg-canvas-muted p-1.5">
                  <tile.icon className="size-2 text-fog" strokeWidth={2} />
                  <p className="mt-1 text-[7px] font-semibold text-charcoal">{tile.value}</p>
                  <p className="text-[5px] text-fog">{tile.label}</p>
                </div>
              ))}
            </div>
            <div
              className="mt-3 flex h-4 items-center justify-center rounded-[4px] text-[6px] font-semibold text-white transition-colors duration-300"
              style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.soft})` }}
            >
              Zacznij zestaw
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Timed window                                                         */
/* ------------------------------------------------------------------------ */

type Cell = "done" | "flag" | "now" | "todo";
const NAVIGATOR: Cell[] = [
  ...Array<Cell>(4).fill("done"),
  "flag",
  ...Array<Cell>(5).fill("done"),
  "flag",
  "done",
  "done",
  "now",
  ...Array<Cell>(6).fill("todo"),
];

const CELL: Record<Cell, string> = {
  done: "bg-graphite",
  flag: "border border-electric-blue bg-soft-blue",
  now: "border border-vivid-green bg-white",
  todo: "border border-ash bg-white",
};

function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TimedWindow() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [left, setLeft] = useState(44 * 60 + 12);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 45 * 60)), 1000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  return (
    <div ref={ref} aria-hidden inert className="relative flex h-full items-start justify-center overflow-hidden">
      <div className="w-full px-3 pt-6 [mask-image:linear-gradient(black_50%,transparent)]">
        <div className="w-full rounded-lg border border-ash/80 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 px-2.5 py-2 text-[7px] text-charcoal">
            <span className="grid size-4 place-items-center rounded-full bg-charcoal">
              <BrandMark className="h-1.5 text-white" />
            </span>
            {["Trening", "Na czas", "Arkusze", "Postępy"].map((tab) => (
              <span key={tab} className={cn("rounded-[3px] px-1 py-0.5", tab === "Na czas" && "bg-paper-mist font-medium")}>
                {tab}
              </span>
            ))}
          </div>

          <div className="relative mx-2 overflow-hidden rounded-md border border-ash bg-[radial-gradient(90%_120%_at_85%_40%,#dcfce7,#f5f3ff_45%,#fafafa_75%)]">
            <GridPattern id="timed-grid" size={14} className="inset-0 text-white/70" />
            <div className="relative flex items-center justify-between p-2.5">
              <div>
                <p className="text-[6px] text-fog">Arkusz CKE 2024</p>
                <p className="text-[8px] font-semibold text-charcoal">Matematyka · E8</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 rounded-[4px] border border-ash bg-white px-1.5 py-0.5 font-geist-mono text-[9px] tabular-nums text-charcoal">
                    <Timer className="size-2 text-vivid-green" strokeWidth={2.5} />
                    {clock(left)}
                  </span>
                  <span className="rounded-[4px] bg-charcoal px-1.5 py-1 text-[6px] font-medium text-white">Zakończ</span>
                </div>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-charcoal shadow-md">
                <BrandMark className="h-3.5 text-white" />
              </span>
            </div>
          </div>

          <div className="mx-2 mt-2 grid grid-cols-3 gap-1.5">
            {[
              { label: "Rozwiązane", value: "13 / 19" },
              { label: "Oflagowane", value: "2" },
              { label: "Śr. czas", value: "1:12" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[5px] border border-ash p-1.5">
                <p className="text-[5px] text-fog">{stat.label}</p>
                <p className="text-[8px] font-semibold text-charcoal tabular-nums">{stat.value}</p>
                <Sparkline className="mt-0.5 h-3 w-full" />
              </div>
            ))}
          </div>

          <div className="mx-2 mt-2.5 flex gap-2 border-b border-ash text-[6px] text-fog">
            <span className="border-b border-charcoal pb-1 font-medium text-charcoal">Nawigator</span>
            <span className="pb-1">Oflagowane</span>
            <span className="pb-1">Wyniki</span>
          </div>
          <div className="mx-2 grid grid-cols-10 gap-1 py-2.5">
            {NAVIGATOR.map((cell, index) => (
              <span key={index} className={cn("grid aspect-square place-items-center rounded-[3px] text-[5px]", CELL[cell], cell === "done" ? "text-white" : "text-fog")}>
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · First steps                                                          */
/* ------------------------------------------------------------------------ */

const STEPS = ["Wybierz egzamin", "Quiz diagnostyczny", "Pierwsza seria zadań"];
const STEP_TIME = 1000;
const LAUNCHED_TIME = 3400;

const QUEUED: Array<{ icon: IconComponent; topic: string; status: string }> = [
  { icon: Percent, topic: "Procenty", status: "Dodane" },
  { icon: Equal, topic: "Równania", status: "W kolejce" },
  { icon: Triangle, topic: "Geometria", status: "W kolejce" },
];

function StepIcon({ state }: { state: "done" | "running" | "waiting" }) {
  return (
    <span className="relative size-4 shrink-0">
      <span className={cn("absolute inset-0 grid place-items-center rounded-full bg-vivid-green text-white transition-[transform,opacity] duration-200", state !== "done" && "scale-50 opacity-0")}>
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
      <span className={cn("absolute inset-0 animate-spin rounded-full border-2 border-ash border-t-steel transition-[transform,opacity] duration-200", state !== "running" && "scale-50 opacity-0")} />
      <Circle className={cn("absolute inset-0 size-4 text-silver transition-[transform,opacity] duration-200", state !== "waiting" && "scale-50 opacity-0")} strokeWidth={1.75} />
    </span>
  );
}

export function FirstSteps() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  // 0–2: that step is running; 3: launched.
  const [stage, setStage] = useState(0);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setTimeout(
      () => {
        const next = (stage + 1) % (STEPS.length + 1);
        setStage(next);
        if (next === STEPS.length) setBurst((b) => b + 1);
      },
      stage === STEPS.length ? LAUNCHED_TIME : STEP_TIME,
    );
    return () => window.clearTimeout(timer);
  }, [stage, inView, reducedMotion]);

  const launched = reducedMotion || stage === STEPS.length;

  return (
    <div ref={ref} aria-hidden inert className="relative size-full pt-px">
      <div className="-mx-5 -mt-5 h-[calc(100%+1.25rem)]">
        <div className="mx-auto flex size-full max-w-sm flex-col justify-end px-8 pt-7 [mask-image:linear-gradient(black_50%,transparent)]">
          <div className="w-full rounded-xl border border-ash p-2 shadow-subtle">
            <div className="relative overflow-hidden rounded-lg border border-paper-mist bg-canvas-muted">
              <div className="absolute left-1/2 top-0 h-[100px] w-[400px] -translate-x-1/2 [mask-image:radial-gradient(50%_100%_at_50%_0,black_40%,transparent)]">
                <GridPattern id="first-steps-grid" size={20} className="inset-0 text-ash" />
              </div>
              <div className="relative flex flex-col items-center px-4 py-4">
                <span className="mt-0.5 grid size-10 place-items-center rounded-full border border-ash bg-charcoal">
                  <BrandMark className="h-4 text-white" />
                </span>
                <span className="mt-2.5 text-xl font-semibold text-graphite">Twój trening</span>
                <div className="relative mt-4 w-full pb-4">
                  <div className={cn("flex flex-col gap-4 transition-[transform,opacity] duration-300", launched && "-translate-y-4 opacity-0")}>
                    {STEPS.map((label, index) => {
                      const state = index < stage ? "done" : index === stage ? "running" : "waiting";
                      return (
                        <div key={label} className={cn("flex items-center justify-between gap-2 transition-opacity", state === "waiting" && "opacity-50")}>
                          <div className="flex items-center gap-2">
                            <StepIcon state={state} />
                            <span className="text-xs font-medium text-charcoal">{label}</span>
                          </div>
                          <span
                            className={cn(
                              "flex h-5 w-[3.4rem] items-center justify-center rounded-md text-xs font-medium transition-colors",
                              state === "done" ? "bg-soft-mint text-[#15803d]" : "bg-paper-mist text-fog",
                            )}
                          >
                            {state === "done" ? "Gotowe" : `Krok ${index + 1}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className={cn("absolute inset-0 flex flex-col gap-2 transition-[transform,opacity] duration-300", !launched && "translate-y-4 opacity-0")}>
                    <div className="flex h-6 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-soft-mint text-xs font-semibold text-[#15803d]">
                      <Check className="size-3 text-vivid-green" strokeWidth={3} />
                      Plan gotowy
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {QUEUED.map((row) => (
                        <div key={row.topic} className="flex h-10 items-center justify-between gap-2 rounded-md border border-ash bg-white pl-2 pr-4 text-[10px]">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="grid size-5 place-items-center rounded-full border border-ash bg-canvas-muted text-graphite">
                              <row.icon className="size-2.5" strokeWidth={2.25} />
                            </span>
                            <span className="truncate text-charcoal">{row.topic}</span>
                          </span>
                          <span className="text-fog">{row.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {burst > 0 && launched ? <Confetti key={burst} className="pointer-events-none absolute left-1/2 top-[45%] z-20" spread={170} /> : null}
    </div>
  );
}
