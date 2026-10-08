"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, CircleCheck, CircleDashed, Clock3, FileText, ListChecks, Target } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { TaskFigure, type FigureName } from "@/components/training/TaskFigure";
import { Waves } from "@/components/training/Waves";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

import szymonPhoto from "@/public/mockups/learner-szymon.jpg";

/**
 * The "Sprawdzanie bez czekania" section's three pictures, each a template
 * copy of the matching cell of dub.co/partners' "Effortless payouts":
 *
 *  - ResultFeed     ← 1-click global payouts: a stat bar, the dark pill and
 *                     a feed stepping up one row at a time
 *  - MarkingRules   ← Tax compliance: the subject tile on a thread down to
 *                     the official form, stamped done
 *  - OpenTaskCheck  ← Built-in invoicing: a card that goes pending →
 *                     confirming → confirmed on a loop
 *
 * PLACEHOLDER DATA — the tasks and scores are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* 1 · Result feed                                                          */
/* ------------------------------------------------------------------------ */

type Answer = { task: string; exam: "e8" | "matura"; figure: FigureName; got: number; max: number };

const ANSWERS: Answer[] = [
  { task: "Zadanie 3 · Procenty", exam: "e8", figure: "percent", got: 1, max: 1 },
  { task: "Zadanie 7 · Ciągi", exam: "matura", figure: "sequence", got: 2, max: 2 },
  { task: "Zadanie 12 · Trapez", exam: "e8", figure: "trapezoid", got: 1, max: 2 },
  { task: "Zadanie 5 · Nierówności", exam: "matura", figure: "numberLine", got: 1, max: 1 },
  { task: "Zadanie 18 · Bryły", exam: "e8", figure: "prism", got: 3, max: 3 },
  { task: "Zadanie 9 · Funkcje", exam: "matura", figure: "linear", got: 2, max: 2 },
  { task: "Zadanie 14 · Statystyka", exam: "e8", figure: "bars", got: 0, max: 1 },
  { task: "Zadanie 21 · Parabola", exam: "matura", figure: "parabola", got: 3, max: 4 },
];

/** The reference's row pitch: 40px rows overlapping by their 1px border. */
const PITCH = 39;
const VISIBLE = 5;
const BEAT = 1200;
const BASE = { points: 214, tasks: 132 };

function feedTotals(count: number) {
  let points = 0;
  for (let i = 0; i < count; i += 1) points += ANSWERS[i % ANSWERS.length].got;
  return { points: BASE.points + points, tasks: BASE.tasks + count };
}

function AnswerRow({ answer, leaving }: { answer: Answer; leaving: boolean }) {
  const Mark = answer.exam === "e8" ? E8Icon : MaturaIcon;
  const full = answer.got === answer.max;
  const StatusIcon = full ? Check : answer.got > 0 ? CircleDashed : Clock3;
  return (
    <div
      className={cn(
        "-mt-px flex h-10 items-center justify-between gap-2 rounded-md border border-ash bg-white pl-2 pr-4 text-[10px] transition-[transform,opacity] duration-300",
        leaving && "pointer-events-none scale-x-50 opacity-0",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="grid size-5 place-items-center rounded-full border border-ash bg-canvas-muted text-graphite">
            <TaskFigure name={answer.figure} className="size-3.5" />
          </span>
          <span className="absolute -right-1 -top-px grid size-2.5 place-items-center rounded-full bg-white">
            <Mark className="size-2" />
          </span>
        </div>
        <span className="text-charcoal">{answer.task}</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIcon
          className={cn("size-2.5 shrink-0", full ? "text-vivid-green" : "text-graphite")}
          strokeWidth={2.5}
        />
        <span className="text-fog tabular-nums">
          {answer.got}/{answer.max} pkt
        </span>
      </div>
    </div>
  );
}

export function ResultFeed() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(VISIBLE - 1);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), BEAT);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  // The newest answer lands at the bottom and the run steps up one pitch,
  // as the reference's payouts do; the row above the run is on its way out.
  const totals = feedTotals(step + 1);
  const latest = ANSWERS[step % ANSWERS.length];
  const indices = Array.from({ length: VISIBLE + 1 }, (_, k) => step - VISIBLE + k).filter((i) => i >= 0);

  return (
    <div ref={ref} aria-hidden inert className="size-full overflow-hidden [mask-image:linear-gradient(black_75%,transparent)]">
      <div className="relative z-0 mx-auto flex size-full max-w-sm flex-col items-center">
        <div className="shrink-0 rounded-[10px] border border-ash bg-white p-1.5 shadow-subtle">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-ash bg-ash">
            {[
              { label: "Punkty", value: totals.points, icon: Target },
              { label: "Zadania", value: totals.tasks, icon: ListChecks },
            ].map((stat) => (
              <div key={stat.label} className="flex h-full items-center gap-2.5 bg-canvas-muted p-2.5 pr-6">
                <div className="flex size-8 items-center justify-center rounded-md border border-ash text-charcoal">
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
        <div className="relative z-10 flex shrink-0 items-center gap-2 rounded-lg bg-graphite p-1 pr-2 shadow-md">
          <div className="grid size-6 shrink-0 place-items-center rounded-md bg-white">
            <BrandMark className="size-3.5 text-charcoal" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white">
            <span className="font-semibold">Sprawdzone</span>
            <span className="flex font-medium">
              +<RollingNumber value={latest.got} lineHeight={16} />
              &nbsp;pkt
            </span>
          </div>
        </div>
        <div className="h-5 w-px shrink-0 bg-ash" />
        <div className="relative w-full" style={{ height: VISIBLE * PITCH }}>
          {indices.map((index) => {
            const position = index - (step - VISIBLE + 1);
            return (
              <div
                key={index}
                className="absolute inset-x-0 transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${position * PITCH}px)` }}
              >
                <AnswerRow answer={ANSWERS[index % ANSWERS.length]} leaving={position < 0} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Marking rules                                                        */
/* ------------------------------------------------------------------------ */

const MARKED: Array<{ figure: FigureName; task: string; criteria: string }> = [
  { figure: "rightTriangle", task: "Zadanie 14", criteria: "0–2 pkt" },
  { figure: "parabola", task: "Zadanie 27", criteria: "0–4 pkt" },
  { figure: "prism", task: "Zadanie 19", criteria: "0–3 pkt" },
];

function GhostTile({ className }: { className?: string }) {
  return (
    <div className={cn("grid size-16 place-items-center rounded-xl border border-paper-mist bg-canvas-muted text-smoke", className)}>
      <FileText className="size-5" strokeWidth={1.75} />
    </div>
  );
}

export function MarkingRules() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % MARKED.length), 3000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  const item = MARKED[index];

  return (
    <div ref={ref} aria-hidden inert className="size-full overflow-hidden">
      <div className="relative mx-auto flex size-full max-w-sm flex-col items-center gap-0 pt-4 [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent),linear-gradient(black_90%,transparent)]">
        {/* The row of tasks: this one in focus, the rest waiting */}
        <div className="relative flex items-center justify-center gap-4">
          <GhostTile className="absolute -left-[104px] top-6 opacity-50" />
          <GhostTile className="mt-6" />
          <div className="relative grid size-20 place-items-center rounded-2xl border border-ash bg-white p-1 shadow-sm">
            <div key={item.figure} className="animate-scale-in-fade grid size-full place-items-center rounded-xl bg-canvas-muted text-graphite" style={{ "--from-scale": 0.9 } as React.CSSProperties}>
              <TaskFigure name={item.figure} className="size-12" />
            </div>
            <span
              key={`check-${index}`}
              className="absolute -right-1.5 -top-1.5 grid size-5 animate-pulse-in place-items-center rounded-full border-2 border-white bg-vivid-green text-white"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
          </div>
          <GhostTile className="mt-6" />
          <GhostTile className="absolute -right-[104px] top-6 opacity-50" />
        </div>

        <div className="h-5 w-px shrink-0 bg-smoke" />

        {/* The official form: CKE's own rules for this task */}
        <div className="relative w-[128px] rounded-xl bg-gradient-to-b from-paper-mist to-white p-2.5 pb-3 shadow-subtle ring-1 ring-black/5">
          <div className="flex items-center justify-center gap-1.5">
            <CkeIcon className="h-4 w-auto" />
            <span className="font-serif text-[11px] font-semibold tracking-tight text-charcoal">Zasady oceniania</span>
          </div>
          <div className="mt-2 rounded-md bg-white p-2 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between text-[7px] font-medium text-slate">
              <span>{item.task}</span>
              <span className="text-fog">{item.criteria}</span>
            </div>
            <div className="mt-1.5 space-y-1">
              {[92, 70, 100, 84, 60, 100, 76].map((width, line) => (
                <div
                  key={line}
                  className={cn("h-[3px] rounded-full", line === 0 || line === 3 ? "bg-smoke" : "bg-paper-mist")}
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-fit items-center gap-1 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0.5 text-[8px] font-medium text-[#166534]">
            <CircleCheck className="size-2.5 text-vivid-green" strokeWidth={2.5} />
            Sprawdzone
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · Open task check                                                      */
/* ------------------------------------------------------------------------ */

type CheckPhase = "pending" | "checking" | "done";

/** How long each phase holds, in the reference's rhythm. */
const HOLD: Record<CheckPhase, number> = { pending: 1800, checking: 1300, done: 2600 };
const NEXT: Record<CheckPhase, CheckPhase> = { pending: "checking", checking: "done", done: "pending" };

export function OpenTaskCheck() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<CheckPhase>("pending");

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setTimeout(() => setPhase((p) => NEXT[p]), HOLD[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, inView, reducedMotion]);

  const done = reducedMotion || phase === "done";

  const rows: Array<[string, React.ReactNode]> = [
    ["Zadanie", "14 · Arkusz 2024"],
    ["Typ", "Otwarte, 0–3 pkt"],
    ["Kryteria", "Metoda · Rachunki · Wynik"],
    [
      "Wynik",
      <span key="score" className={cn("transition-colors duration-300", done ? "font-medium text-charcoal" : "text-silver")}>
        {done ? "2 / 3 pkt" : "czeka na sprawdzenie"}
      </span>,
    ],
  ];

  return (
    <div ref={ref} aria-hidden inert className="size-full overflow-hidden">
      <div className="relative mx-auto flex size-full max-w-sm flex-col items-center justify-center gap-2">
        <div className="relative w-full rounded-[12px] bg-white p-1">
          <div className="absolute inset-0 rounded-[inherit] border border-black/10 bg-white [mask-image:linear-gradient(black_50%,transparent)]" />
          <div className="relative rounded-[8px]">
            <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-black/5 bg-canvas-muted [mask-image:linear-gradient(black_50%,transparent)]">
              <Waves
                id="open-task-waves"
                className={cn(
                  "h-auto w-full transition-colors duration-300 [mask-image:linear-gradient(#000a_30%,transparent)]",
                  done ? "text-[#86efac]" : "text-[#d4d4d4]",
                )}
              />
            </div>
            <div className="relative p-2 pb-0 sm:p-4 sm:pb-0">
              <div className="flex items-start justify-between">
                <span className="relative block size-10 overflow-hidden rounded-full border border-smoke">
                  <Image src={szymonPhoto} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <div className="relative h-5 w-[92px]">
                  <span
                    className={cn(
                      "absolute right-0 top-0 flex items-center gap-1 rounded-md border border-ash bg-paper-mist px-1.5 py-0.5 transition-[transform,opacity] duration-300",
                      done && "translate-y-1 opacity-0",
                    )}
                  >
                    <Clock3 className="size-3 shrink-0 text-fog" strokeWidth={2} />
                    <span className="text-[10px] font-medium leading-tight text-steel">Do sprawdzenia</span>
                  </span>
                  <span
                    className={cn(
                      "absolute right-0 top-0 flex items-center gap-1 rounded-md border border-[#dcfce7] bg-[#f0fdf4] px-1.5 py-0.5 transition-[transform,opacity] duration-300",
                      !done && "translate-y-1 opacity-0",
                    )}
                  >
                    <CircleCheck className="size-3 shrink-0 text-vivid-green" strokeWidth={2} />
                    <span className="text-[10px] font-medium leading-tight text-[#166534]">Sprawdzone</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-4">
                <span className="block text-body font-semibold text-graphite">Szymon Wójcik</span>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1.5 rounded-lg border border-ash p-3 text-xs">
                  {rows.map(([label, value]) => (
                    <div key={label} className="contents">
                      <span className="font-semibold text-graphite">{label}</span>
                      <span className="min-w-0 truncate text-fog">{value}</span>
                    </div>
                  ))}
                </div>
                <span
                  className={cn(
                    "relative block h-9 rounded-md bg-midnight-ink text-white shadow-md transition-transform duration-100",
                    phase === "checking" && "scale-[0.98]",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-[transform,opacity] duration-300",
                      phase === "checking" && "-translate-y-2 opacity-0",
                    )}
                  >
                    <CircleCheck className="size-4" strokeWidth={2} />
                    <span className="text-body font-medium">{done ? "Sprawdź kolejne" : "Sprawdź odpowiedź"}</span>
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-2 transition-[transform,opacity] duration-300",
                      phase !== "checking" && "translate-y-2 opacity-0",
                    )}
                  >
                    <span className="size-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    <span className="text-body font-medium">Sprawdzam</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
