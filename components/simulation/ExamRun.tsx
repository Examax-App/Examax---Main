"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Check, FileText, Flag, Gauge, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { SECTION_H2 } from "@/lib/type";

/* The film's own fixture, to the second: `demoData.simulation` opens its beat
   at 48:12 on a 25-task sheet with 14 answered and 11 points banked. The film
   and this page describe one sitting, not two. */
const START_SECONDS = 48 * 60 + 12;
const FLOOR_SECONDS = 44 * 60;

const options = [
  { key: "A", label: "x = 4" },
  { key: "B", label: "x = 8", picked: true },
  { key: "C", label: "x = −8" },
  { key: "D", label: "x = 2" },
];

const graded = [
  { label: "Zadanie 12 · Procenty", state: "correct" as const, points: "+1" },
  { label: "Zadanie 13 · Wyrażenia", state: "wrong" as const, points: "0" },
  { label: "Zadanie 14 · Równania", state: "current" as const, points: "—" },
];

/* The landing page's three simulation pillars, unchanged — the promise is the
   same one it already makes there. */
const perks = [
  { icon: FileText, label: "Format 1:1 z arkuszem" },
  { icon: AlarmClock, label: "Czas liczony jak na sali" },
  { icon: Gauge, label: "Raport gotowości po ostatnim zadaniu" },
];

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** The sheet page: one task at a time, with room to work. */
function SheetPage() {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-charcoal">
          Zadanie 14 z 25{" "}
          <span className="font-normal text-fog">(0–1)</span>
        </p>
        <Flag className="size-4 text-silver" aria-hidden />
      </div>

      <p className="mt-3 text-body font-medium leading-snug text-charcoal">
        Rozwiąż równanie: 3x + 12 = 5x − 4
      </p>

      <ul className="mt-4 space-y-2">
        {options.map((option) => (
          <li
            key={option.key}
            className={cn(
              "flex items-center gap-3 rounded-buttons border px-3.5 py-2.5 text-body",
              option.picked
                ? "border-charcoal bg-paper-mist font-medium text-charcoal"
                : "border-ash text-steel",
            )}
          >
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                option.picked
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-smoke bg-white text-fog",
              )}
              aria-hidden
            >
              {option.picked ? <Check className="size-3" /> : option.key}
            </span>
            {option.label}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <p className="text-[11px] font-medium text-fog">Brudnopis</p>
        <div className="mt-1.5 rounded-inputs border border-midnight-ink px-3 py-2.5">
          <p className="font-geist-mono text-[12px] leading-relaxed text-charcoal">
            3x − 5x = −4 − 12
            <br />
            −2x = −16
          </p>
          <span className="mt-1 block h-3.5 w-px bg-charcoal" />
        </div>
      </div>
    </div>
  );
}

/** Live scoring, beside the sheet rather than after it. */
function LiveScore() {
  return (
    <div className="border-t border-ash p-5 sm:p-6 lg:border-l lg:border-t-0">
      <p className="text-[13px] font-semibold text-charcoal">Ocena na bieżąco</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-mist">
        <span className="block h-full w-[56%] rounded-full bg-tangerine" />
      </div>
      <p className="mt-1.5 text-[11px] text-fog">14 z 25 zadań</p>

      <ul className="mt-4 space-y-2">
        {graded.map((task) => (
          <li
            key={task.label}
            className="flex items-center gap-2.5 rounded-cards bg-canvas-muted px-3 py-2"
          >
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full",
                task.state === "correct" && "bg-vivid-green text-white",
                task.state === "wrong" && "bg-[#ef4444] text-white",
                task.state === "current" && "border border-smoke bg-white",
              )}
              aria-hidden
            >
              {task.state === "correct" ? (
                <Check className="size-2.5" strokeWidth={3} />
              ) : task.state === "wrong" ? (
                <X className="size-2.5" strokeWidth={3} />
              ) : (
                <span className="size-1.5 rounded-full bg-tangerine" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-charcoal">
              {task.label}
            </span>
            <span className="shrink-0 font-geist-mono text-[10px] text-fog">
              {task.points}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {[
          { label: "Punkty", value: "11 / 25", hint: "liczone na bieżąco" },
          { label: "Tempo", value: "1:54", hint: "śr. na zadanie" },
        ].map((tile) => (
          <div key={tile.label} className="rounded-cards border border-ash p-3">
            <p className="text-[10px] text-fog">{tile.label}</p>
            <p className="mt-1 font-geist-mono text-body-lg font-medium leading-none text-charcoal tabular-nums">
              {tile.value}
            </p>
            <p className="mt-1 text-[9.5px] text-silver">{tile.hint}</p>
          </div>
        ))}
      </div>

      <span className="mt-4 block rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white">
        Zakończ arkusz
      </span>
    </div>
  );
}

/**
 * The page's one moving visual: a sheet under a running clock.
 *
 * The clock is the whole point of the feature, so it actually runs — gated on
 * `useInView` so it costs nothing while scrolled away, and on
 * `prefers-reduced-motion` so it holds still for anyone who asked for that.
 * It counts down from the film fixture's own 48:12 and resets before it can
 * drift far enough to contradict the "14 z 25" beside it.
 */
export function ExamRun() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const reducedMotion = useReducedMotion();
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setSeconds((current) =>
        current <= FLOOR_SECONDS ? START_SECONDS : current - 1,
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  return (
    <section
      id="run"
      aria-labelledby="run-heading"
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="py-20 text-center">
          <Reveal>
            <h2
              id="run-heading"
              className={cn("mx-auto max-w-2xl text-charcoal", SECTION_H2)}
            >
              Jedna kartka, zegar w rogu, punkty od pierwszego zadania
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Tak wygląda arkusz w Examaxie — bez pauzy, bez podpowiedzi i bez
              czekania na wynik.
            </p>
            <Button href="/signup" variant="outline" size="lg" className="mt-8">
              Zapisz się na start
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
              aria-label="Podgląd symulacji: zadanie czternaste z dwudziestu pięciu, zegar odliczający do końca arkusza i punkty liczone na bieżąco"
              className="mx-auto max-w-4xl overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ash px-5 py-3.5 sm:px-6">
                <p className="text-body font-semibold text-charcoal">
                  Arkusz próbny CKE · Matematyka
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ash px-3 py-1.5 text-[12px] font-medium text-charcoal">
                  <AlarmClock className="size-3.5 text-tangerine" aria-hidden />
                  <span className="font-geist-mono tabular-nums">
                    {formatClock(seconds)}
                  </span>{" "}
                  do końca
                </span>
              </div>

              <div className="grid lg:grid-cols-[1fr_20rem]">
                <SheetPage />
                <LiveScore />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-12 text-center text-[11px] font-medium text-fog">
              W symulacji dostajesz
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
