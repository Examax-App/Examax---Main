"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Lock,
  PencilLine,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type NodeState = "done" | "active" | "next" | "locked";

const nodes: Array<{
  label: string;
  meta: string;
  state: NodeState;
}> = [
  { label: "Liczby i działania", meta: "12 tematów · 100%", state: "done" },
  { label: "Wyrażenia algebraiczne", meta: "8 tematów · 100%", state: "done" },
  { label: "Procenty", meta: "W trakcie nauki", state: "active" },
  { label: "Równania i nierówności", meta: "Następny krok", state: "next" },
  { label: "Geometria na płaszczyźnie", meta: "Odblokuje się po równaniach", state: "locked" },
];

const nextSteps: Array<{
  icon: LucideIcon;
  kind: string;
  label: string;
  meta: string;
}> = [
  {
    icon: BookOpen,
    kind: "Lekcja",
    label: "Procenty w zadaniach tekstowych",
    meta: "ok. 15 minut",
  },
  {
    icon: PencilLine,
    kind: "Quiz",
    label: "Obliczenia procentowe · 10 zadań",
    meta: "poziom egzaminacyjny",
  },
  {
    icon: RefreshCcw,
    kind: "Powtórka",
    label: "Ułamki i proporcje",
    meta: "3 tematy do odświeżenia",
  },
];

const MASTERY_START = 62;
const MASTERY_END = 78;

/**
 * Roadmap showcase — a browser-framed learning path whose active topic's
 * mastery ticks upward live, with a floating "next step" panel cycling
 * through the recommended lesson, quiz, and review.
 */
export function RoadmapShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [mastery, setMastery] = useState(MASTERY_START);
  const [stepIndex, setStepIndex] = useState(0);

  // The active topic's mastery drifts upward while on screen.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setMastery((current) =>
        current >= MASTERY_END ? MASTERY_START : current + 1,
      );
    }, 1200);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  // The recommended next step cycles on its own.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(
      () => setStepIndex((current) => (current + 1) % nextSteps.length),
      3400,
    );
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);


  const activeStep = nextSteps[stepIndex];
  const overall = 38 + Math.round((mastery - MASTERY_START) / 4);

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl lg:pr-40">

      <div
        role="img"
        aria-label="Podgląd roadmapy nauki w Examax: ścieżka tematów z matematyki ze statusem opanowania i rekomendowanym następnym krokiem"
      >
        {/* Browser frame */}
        <div
          className="animate-view-swap overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
        >

          <div className="p-6 sm:p-8 lg:pr-44">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-body font-semibold text-charcoal">
                  Matematyka · Egzamin ósmoklasisty
                </p>
                <p className="text-[12px] text-fog">Roadmapa do maja 2027</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-ash px-3 py-1.5 text-[12px] font-medium text-charcoal">
                <span
                  className="font-geist-mono tabular-nums text-lavender"
                  key={overall}
                >
                  {overall}%
                </span>
                ukończone
              </span>
            </div>

            {/* Overall progress */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper-mist">
              <div
                className="h-full rounded-full bg-lavender transition-[width] duration-700"
                style={{ width: `${overall}%` }}
              />
            </div>

            {/* Topic path */}
            <ol className="relative mt-6 space-y-1.5">
              <span
                aria-hidden
                className="absolute bottom-6 left-[15px] top-6 w-px bg-ash"
              />
              {nodes.map((node) => (
                <li
                  key={node.label}
                  className={cn(
                    "relative flex items-center gap-3.5 rounded-cards border px-3 py-2.5 transition-colors duration-300",
                    node.state === "active"
                      ? "border-lavender/40 bg-[#faf8fe]"
                      : "border-transparent",
                    node.state === "locked" && "opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 bg-white",
                      node.state === "done" &&
                        "border-vivid-green bg-vivid-green text-white",
                      node.state === "active" && "border-lavender text-lavender",
                      node.state === "next" && "border-smoke text-fog",
                      node.state === "locked" &&
                        "border-dashed border-smoke text-silver",
                    )}
                    aria-hidden
                  >
                    {node.state === "done" ? (
                      <Check className="size-4" />
                    ) : node.state === "active" ? (
                      <span className="font-geist-mono text-[10px] font-medium tabular-nums">
                        {mastery}%
                      </span>
                    ) : node.state === "locked" ? (
                      <Lock className="size-3.5" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body font-medium text-charcoal">
                      {node.label}
                    </span>
                    <span className="block truncate text-[12px] text-fog">
                      {node.meta}
                    </span>
                  </span>
                  {node.state === "active" ? (
                    <span className="hidden shrink-0 rounded-buttons bg-midnight-ink px-3 py-1.5 text-[12px] font-medium text-white sm:block">
                      Kontynuuj
                    </span>
                  ) : node.state === "done" ? (
                    <span className="hidden shrink-0 rounded-full bg-soft-mint px-2.5 py-1 text-[11px] font-medium text-[#166534] sm:block">
                      Opanowane
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Floating "next step" panel */}
        <div
          className="animate-view-swap mt-6 lg:absolute lg:-right-2 lg:top-1/2 lg:mt-0 lg:w-80 lg:-translate-y-1/2"
          style={{ animationDelay: "120ms" }}
        >
          <div className="rounded-largecards border border-ash bg-white p-5 shadow-md transition-shadow duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-charcoal">
                Następny krok
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ece2fb] px-2.5 py-1 text-[11px] font-medium leading-none text-lavender">
                <Sparkles className="size-3" aria-hidden />
                Dobrane przez Examax
              </span>
            </div>

            <div
              key={stepIndex}
              className="animate-view-swap mt-4 rounded-cards border border-ash p-4"
            >
              <p className="flex items-center gap-2 text-[12px] font-medium text-fog">
                <activeStep.icon className="size-3.5" aria-hidden />
                {activeStep.kind}
              </p>
              <p className="mt-1.5 text-body font-semibold text-charcoal">
                {activeStep.label}
              </p>
              <p className="mt-0.5 text-[12px] text-fog">{activeStep.meta}</p>
            </div>

            <div className="mt-4 flex items-center gap-1.5" aria-hidden>
              {nextSteps.map((step, index) => (
                <span
                  key={step.kind}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    index === stepIndex ? "bg-lavender" : "bg-ash",
                  )}
                />
              ))}
            </div>

            <span className="mt-4 block cursor-default rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white transition-colors duration-200 hover:bg-graphite">
              Zacznij ten krok
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
