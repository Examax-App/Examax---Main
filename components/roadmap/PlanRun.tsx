"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  Milestone,
  PencilLine,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useDaysUntil } from "@/components/ui/ExamCountdown";
import { E8_DATE } from "@/lib/examDates";
import { cn } from "@/lib/cn";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { SECTION_H2 } from "@/lib/type";
import type { IconComponent } from "@/lib/icon";

/* PLACEHOLDER WEEK — four of six slots done, Thursday in progress. The
   summary beside it counts off this array, so the two stay in step. */
const week: Array<{
  day: string;
  label: string;
  meta: string;
  state: "done" | "current" | "todo";
}> = [
  { day: "Pn", label: "Procenty · lekcja", meta: "15 min", state: "done" },
  { day: "Wt", label: "Procenty · quiz", meta: "10 zadań", state: "done" },
  { day: "Śr", label: "Ułamki · powtórka", meta: "3 tematy", state: "done" },
  { day: "Cz", label: "Procenty · arkusz CKE", meta: "8 zadań", state: "current" },
  { day: "Pt", label: "Wyrażenia · lekcja", meta: "20 min", state: "todo" },
  { day: "Sb", label: "Podsumowanie tygodnia", meta: "5 min", state: "todo" },
];

/* The recommendation cycles the way it does on the landing page's roadmap
   showcase — same three kinds, same beat. */
const nextSteps: Array<{
  icon: IconComponent;
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

const perks = [
  { icon: CalendarDays, label: "Plan na każdy tydzień" },
  { icon: Milestone, label: "Etapy rozpisane do maja" },
  { icon: Sparkles, label: "Następny krok dobrany za Ciebie" },
];

/** This week, day by day. */
function WeekPlan() {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-steel" strokeWidth={1.8} />
        <p className="text-[13px] font-semibold text-charcoal">
          Plan na ten tydzień
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {week.map((slot) => (
          <li
            key={slot.day}
            className={cn(
              "flex items-center gap-3 rounded-cards border px-3 py-2.5",
              slot.state === "current"
                ? "border-electric-blue/40 bg-soft-blue/40"
                : "border-ash",
              slot.state === "todo" && "opacity-70",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border-2 font-geist-mono text-[9px] font-medium",
                slot.state === "done" &&
                  "border-vivid-green bg-vivid-green text-white",
                slot.state === "current" &&
                  "border-electric-blue bg-white text-electric-blue",
                slot.state === "todo" && "border-smoke bg-white text-fog",
              )}
            >
              {slot.state === "done" ? (
                <Check className="size-3" strokeWidth={3} />
              ) : (
                slot.day
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium text-charcoal">
                {slot.label}
              </span>
              <span className="block truncate text-[10.5px] text-fog">
                {slot.meta}
              </span>
            </span>
            {slot.state === "current" ? (
              <span className="shrink-0 rounded-full bg-soft-blue px-2 py-0.5 text-[10px] font-medium text-electric-blue">
                teraz
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The page's one moving visual: a plan that knows what day it is.
 *
 * Two live parts, both gated on `useInView` so they cost nothing while
 * scrolled away and on `prefers-reduced-motion` so they hold still for anyone
 * who asked for that. The countdown is a real one — it reads the CKE date from
 * `lib/examDates`, the same source the landing page's countdown uses, so the
 * two can never disagree.
 */
export function PlanRun() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const days = useDaysUntil(E8_DATE);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(
      () => setStepIndex((current) => (current + 1) % nextSteps.length),
      3400,
    );
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  const activeStep = nextSteps[stepIndex];

  return (
    <section
      id="plan"
      aria-labelledby="plan-heading"
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="py-20 text-center">
          <Reveal>
            <h2
              id="plan-heading"
              className={cn("mx-auto max-w-2xl text-charcoal", SECTION_H2)}
            >
              Plan, który wie, ile zostało czasu
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Roadmapa liczy się do dnia egzaminu. Widzisz plan na tydzień i
              jeden krok na teraz.
            </p>
            <Button href="/signup" variant="outline" size="lg" className="mt-8">
              Ułóż swoją roadmapę
            </Button>
          </Reveal>
        </Container>
      </div>

      <div className="col-rules border-t border-ash bg-canvas-muted">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-5 py-14 sm:px-10">
          <Reveal>
            <div
              ref={ref}
              role="img"
              aria-label="Podgląd roadmapy: plan na tydzień, licznik dni do egzaminu i rekomendowany następny krok"
              className="mx-auto max-w-4xl overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ash px-5 py-3.5 sm:px-6">
                <p className="text-body font-semibold text-charcoal">
                  Matematyka · Egzamin ósmoklasisty
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ash px-3 py-1.5 text-[12px] font-medium text-charcoal">
                  <Milestone className="size-3.5 text-electric-blue" aria-hidden />
                  <span className="font-geist-mono tabular-nums">
                    {days ?? "—"}
                  </span>{" "}
                  dni do egzaminu
                </span>
              </div>

              <div className="grid lg:grid-cols-[1fr_20rem]">
                <WeekPlan />

                <div className="border-t border-ash p-5 sm:p-6 lg:border-l lg:border-t-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-charcoal">
                      Następny krok
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-soft-blue px-2.5 py-1 text-[10px] font-medium leading-none text-electric-blue">
                      <Sparkles className="size-3" aria-hidden />
                      Dobrane przez Examax
                    </span>
                  </div>

                  <div
                    key={stepIndex}
                    className="animate-view-swap mt-4 rounded-cards border border-ash p-4"
                  >
                    <p className="flex items-center gap-2 text-[11px] font-medium text-fog">
                      <activeStep.icon className="size-3.5" aria-hidden />
                      {activeStep.kind}
                    </p>
                    <p className="mt-1.5 text-body font-semibold text-charcoal">
                      {activeStep.label}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-fog">
                      {activeStep.meta}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5" aria-hidden>
                    {nextSteps.map((step, index) => (
                      <span
                        key={step.kind}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors duration-300",
                          index === stepIndex ? "bg-electric-blue" : "bg-ash",
                        )}
                      />
                    ))}
                  </div>

                  <span className="mt-5 block rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white">
                    Zacznij ten krok
                  </span>
                  <p className="mt-3 text-[11px] leading-snug text-fog">
                    Po każdym kroku roadmapa przelicza, co ma sens jutro.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-12 text-center text-[11px] font-medium text-fog">
              W roadmapie dostajesz
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {perks.map((perk) => (
                <li
                  key={perk.label}
                  className="flex items-center gap-2 text-body font-medium text-steel"
                >
                  <perk.icon className="size-4 text-silver" strokeWidth={1.7} aria-hidden />
                  {perk.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
