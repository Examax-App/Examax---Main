"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Check, CircleCheck, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Confetti } from "@/components/training/Confetti";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
 * The diagnostic quiz band — dub.co/partners' "Reward viral content" (social
 * bounties), one to one in structure: a centred heading block with one
 * outline action, a two-cell stage 500px tall (white left, muted right), and
 * a strip of marks under a small caption.
 *
 * The reference's left cell is a bounty filling up to its target and paying
 * out with a burst of confetti; its right cell is the video that earned it,
 * its view count rolling. Here the left cell is the diagnostic quiz from
 * PRODUCT.md filling answer by answer, and the right cell is what it earns
 * the student: the first week's plan, built from the weak topics it found.
 *
 * PLACEHOLDER DATA — the answers, topics and figures are illustrative.
 * ------------------------------------------------------------------------- */

/** Twenty answers: `true` correct, `false` wrong. 14 of 20 → 70%. */
const ANSWERS = [true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, true, false, true, true, false];
const TOTAL = ANSWERS.length;
const SCORE = Math.round((ANSWERS.filter(Boolean).length / TOTAL) * 100);

const TICK = 220;
/** Ticks the finished state holds before the loop starts over. */
const HOLD = 24;

const WEAK = [
  { topic: "Funkcje", value: 38 },
  { topic: "Procenty", value: 52 },
  { topic: "Geometria", value: 61 },
];

function QuizCard({ answered, done }: { answered: number; done: boolean }) {
  return (
    <div className="relative isolate rounded-2xl border border-ash bg-white p-3">
      <div
        className={cn(
          "relative z-10 flex h-[200px] items-center justify-center overflow-hidden rounded-xl pt-7 transition-colors duration-300",
          done ? "bg-[#f0fdf4]" : "bg-paper-mist",
        )}
      >
        <div className="grid grid-cols-5 gap-1">
          {ANSWERS.map((correct, index) => {
            const state = index < answered ? (correct ? "right" : "wrong") : index === answered && !done ? "now" : "todo";
            return (
              <span
                key={index}
                className={cn(
                  "grid size-8 place-items-center rounded-md border text-[10px] font-medium transition-colors duration-200",
                  state === "right" && "border-[#bbf7d0] bg-soft-mint text-vivid-green",
                  state === "wrong" && "border-[#fecaca] bg-[#fef2f2] text-alert-red",
                  state === "now" && "border-charcoal bg-white text-charcoal",
                  state === "todo" && "border-ash bg-white text-silver",
                )}
              >
                {state === "right" ? <Check className="size-3.5" strokeWidth={2.75} /> : state === "wrong" ? <X className="size-3.5" strokeWidth={2.75} /> : index + 1}
              </span>
            );
          })}
        </div>
        <div
          className={cn(
            "absolute left-2 top-2 flex h-6 w-[calc(100%-16px)] items-center justify-center gap-1.5 rounded-md bg-soft-mint text-xs font-semibold tracking-[-0.02em] text-[#15803d] transition-all duration-500",
            done ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <CircleCheck className="size-3 text-vivid-green" strokeWidth={2.5} />
          Wynik gotowy: {SCORE}%
        </div>
      </div>
      <div className="relative z-10 px-3 pb-1 pt-3">
        <h3 className="flex items-center gap-2 text-pretty text-[16px] font-semibold tracking-[-0.02em] text-charcoal">
          <E8Icon className="size-4" />
          Quiz diagnostyczny · Matematyka
        </h3>
        <div className="mt-3">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-ash">
            <div
              className="absolute inset-0 origin-left rounded-full bg-[#22c55e] transition-transform duration-200 ease-out"
              style={{ transform: `scaleX(${answered / TOTAL})` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium tracking-[-0.02em] text-slate">
            <RollingNumber value={answered} lineHeight={16} className="font-semibold text-charcoal" />
            <span>z</span>
            <span className="font-semibold text-charcoal">{TOTAL}</span>
            <span>zadań</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ shown }: { shown: boolean }) {
  const rise = cn("transition-all duration-500", shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-40");
  return (
    <div className="mx-auto w-full max-w-[344px] lg:max-w-[404px]">
      <div
        className={cn(
          "relative aspect-[404/227] overflow-hidden rounded-[11px] transition-all duration-700",
          // Waiting for the quiz, the plan is a pale draft rather than a gap.
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-40 grayscale",
        )}
      >
        {/* The "thumbnail": the plan's own report, as a picture */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,#dcfce7_0%,#dbeafe_45%,#ede9fe_100%)]" />
        <div className="absolute inset-x-[12%] top-[14%] rounded-lg bg-white/90 p-3 shadow-md ring-1 ring-black/5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-fog">Słabe tematy</p>
          <div className="mt-2 space-y-2">
            {WEAK.map((row) => (
              <div key={row.topic} className="flex items-center gap-2 text-[10px] text-charcoal">
                <span className="w-16 shrink-0">{row.topic}</span>
                <span className="relative h-1.5 grow overflow-hidden rounded-full bg-paper-mist">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-electric-blue transition-[width] delay-300 duration-700 ease-out"
                    style={{ width: shown ? `${row.value}%` : "0%" }}
                  />
                </span>
                <span className="w-7 text-right tabular-nums text-fog">{row.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/75 px-1 py-0.5 text-[10px] font-medium text-white">7 dni</span>
      </div>
      <div className="mt-3 flex gap-3">
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-black/5 bg-[#facc15] text-charcoal transition-all duration-500",
            shown ? "translate-y-0 scale-100 opacity-100" : "scale-95 opacity-40 grayscale",
          )}
        >
          <Zap className="size-4" strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <h3 className={cn(rise, "text-[15px] font-semibold tracking-[-0.01em] text-[#050505]")}>
            Twój plan na pierwszy tydzień
          </h3>
          <div className={cn(rise, "mt-0.5 flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.01em] text-[#606060] delay-100")}>
            <span>Korepetytor AI</span>
            <BadgeCheck className="size-3.5 text-fog" strokeWidth={2} />
          </div>
          <div className={cn(rise, "mt-0.5 flex items-center gap-1 text-[13px] font-medium tracking-[-0.01em] text-[#606060] delay-200")}>
            <RollingNumber value={shown ? 12 : 0} lineHeight={18} />
            <span>zadań w kolejce</span>
            <span>•</span>
            <span>3 tematy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticStage() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const reducedMotion = useReducedMotion();
  const [tick, setTick] = useState(0);
  const { ref: enterRef, inView: entered } = useInView<HTMLDivElement>(0.2, true);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setTick((t) => (t + 1) % (TOTAL + HOLD)), TICK);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  const answered = reducedMotion ? TOTAL : Math.min(tick, TOTAL);
  const done = answered === TOTAL;

  return (
    <div ref={ref} aria-hidden inert className="relative z-10 grid grid-cols-1 border-t border-ash md:min-h-[500px] md:grid-cols-2">
      <div className="relative overflow-visible border-b border-ash px-5 py-10 md:flex md:min-h-[500px] md:items-center md:border-b-0 md:border-r md:px-6 lg:px-8 lg:py-8">
        <div
          ref={enterRef}
          className={cn(
            "relative mx-auto w-full max-w-[340px] transition-all duration-700 lg:max-w-[400px]",
            entered || reducedMotion ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[0.98] opacity-0",
          )}
        >
          <QuizCard answered={answered} done={done} />
          {done && !reducedMotion ? <Confetti className="pointer-events-none absolute left-1/2 top-[110px] z-20" spread={190} count={44} /> : null}
        </div>
      </div>
      <div className="bg-canvas-muted px-5 py-10 md:flex md:min-h-[500px] md:items-center md:px-6 lg:px-8 lg:py-8">
        <PlanCard shown={done} />
      </div>
    </div>
  );
}

export function DiagnosticBand() {
  return (
    <section
      id="diagnostic"
      aria-labelledby="diagnostic-heading"
      className="relative overflow-clip border-b border-ash bg-white px-4"
    >
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] overflow-hidden border-x border-ash bg-white">
        <div className="relative z-10 flex flex-col items-center px-6 pb-12 pt-20 text-center sm:px-10 sm:pb-14 sm:pt-24">
          <div className="flex flex-col items-center gap-3">
            <h2
              id="diagnostic-heading"
              className="mx-auto text-balance font-satoshi text-4xl font-medium tracking-[-0.04em] text-charcoal sm:text-5xl"
            >
              Zacznij od quizu diagnostycznego
            </h2>
            <p className="mx-auto max-w-[564px] text-pretty text-lg tracking-[-0.02em] text-fog">
              Dwadzieścia zadań z całego materiału. Po ostatnim Examax wie, od
              czego zacząć — i proponuje pierwszy tydzień pod Twoje słabe tematy.
            </p>
          </div>
          <Button href="/signup" variant="outline" className="mt-8">
            Zrób quiz diagnostyczny
          </Button>
        </div>

        <DiagnosticStage />

        <div className="relative z-10 border-t border-ash px-6 pb-6 pt-5 sm:px-8">
          <p className="text-center text-xs font-semibold tracking-[-0.02em] text-fog">
            Quiz diagnostyczny dla każdego egzaminu
          </p>
          <div className="mt-5 grid grid-cols-1 gap-y-4 sm:grid-cols-3">
            {[
              { Mark: E8Icon, name: "Egzamin ósmoklasisty" },
              { Mark: MaturaIcon, name: "Matura podstawowa" },
              { Mark: MaturaIcon, name: "Matura rozszerzona" },
            ].map(({ Mark, name }) => (
              <div key={name} className="flex h-12 items-center justify-center gap-2.5 px-4">
                <Mark className="h-7 w-auto" />
                <span className="font-satoshi text-[17px] font-bold tracking-tight text-charcoal">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
