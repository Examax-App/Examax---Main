"use client";

import { useEffect, useState } from "react";
import { Check, Download, Flag, HelpCircle, Timer } from "lucide-react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const choices = [
  { key: "A", label: "42 zł", selected: false },
  { key: "B", label: "48 zł", selected: true },
  { key: "C", label: "52 zł", selected: false },
  { key: "D", label: "56 zł", selected: false },
];

const difficulties = [
  { label: "Podstawowy", className: "bg-[#86efac]" },
  { label: "Średni", className: "bg-[#fde047]" },
  { label: "Trudny", className: "bg-[#fdba74]" },
  { label: "Egzaminacyjny", className: "bg-[#f87171]" },
];

const START_SECONDS = 24 * 60 + 36;

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Practice showcase — a browser-framed timed question card (the exam clock
 * ticks down live) with a floating quiz-builder panel whose difficulty
 * selection cycles.
 */
export function PracticeShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [difficulty, setDifficulty] = useState(2);

  // Live exam clock.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current <= 20 * 60 ? START_SECONDS : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  // The builder's difficulty selection drifts on its own.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(
      () => setDifficulty((current) => (current + 1) % difficulties.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);


  return (
    <div ref={ref} className="relative mx-auto max-w-3xl lg:pr-40">

      <div
        role="img"
        aria-label="Podgląd treningu w Examax: zadanie egzaminacyjne na czas oraz panel generatora quizu"
      >
        {/* Browser frame */}
        <div
          className="animate-view-swap overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
        >

          <div className="p-6 sm:p-8 lg:pr-44">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body font-semibold text-charcoal">
                Matematyka · E8
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ash px-3 py-1.5 text-[12px] font-medium text-charcoal">
                <Timer className="size-3.5 text-vivid-green" aria-hidden />
                <span className="font-geist-mono tabular-nums">
                  {formatClock(seconds)}
                </span>{" "}
                do końca
              </span>
            </div>

            <div className="mt-5 rounded-cards border border-ash p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[12px] font-medium text-fog">
                  Zadanie 14 z 19 · Arkusz CKE 2024
                </p>
                <Flag className="size-4 text-silver" aria-hidden />
              </div>
              <p className="mt-2 max-w-md text-body-lg font-medium text-charcoal">
                Cena biletu wynosiła 40 zł, a następnie wzrosła o 20%. Ile
                kosztuje bilet po podwyżce?
              </p>
              <ul className="mt-4 space-y-2">
                {choices.map((choice) => (
                  <li
                    key={choice.key}
                    className={cn(
                      "flex items-center gap-3 rounded-buttons border px-3.5 py-2.5 text-body transition-colors duration-200",
                      choice.selected
                        ? "border-charcoal bg-paper-mist font-medium text-charcoal"
                        : "border-ash text-steel hover:border-smoke",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border text-[11px] font-semibold",
                        choice.selected
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-smoke text-fog",
                      )}
                      aria-hidden
                    >
                      {choice.selected ? <Check className="size-3" /> : choice.key}
                    </span>
                    {choice.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Floating builder panel */}
        <div
          className="animate-view-swap mt-6 lg:absolute lg:-right-2 lg:top-1/2 lg:mt-0 lg:w-80 lg:-translate-y-1/2"
          style={{ animationDelay: "120ms" }}
        >
          <div className="rounded-largecards border border-ash bg-white p-5 shadow-md transition-shadow duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-charcoal">
                Generator quizu
              </p>
              <span className="flex gap-2 text-silver" aria-hidden>
                <Download className="size-4" />
                <HelpCircle className="size-4" />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-medium text-fog">Przedmiot</p>
              <div className="mt-1.5 rounded-inputs border border-midnight-ink px-3 py-2 text-body font-medium text-charcoal">
                Matematyka — E8
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[12px] font-medium text-fog">Tryb na czas</p>
              <span
                className="relative inline-flex h-5 w-9 items-center rounded-full bg-vivid-green"
                aria-hidden
              >
                <span className="absolute right-0.5 size-4 rounded-full bg-white shadow-subtle" />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-medium text-fog">Poziom trudności</p>
              <div className="mt-2 flex items-center gap-2.5">
                {difficulties.map((level, index) => (
                  <span
                    key={level.label}
                    title={level.label}
                    className={cn(
                      "grid size-7 place-items-center rounded-full transition-all duration-300",
                      level.className,
                      index === difficulty && "ring-2 ring-charcoal ring-offset-2",
                    )}
                    aria-hidden
                  >
                    {index === difficulty ? (
                      <Check className="size-3.5 text-charcoal" />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>

            <span className="mt-5 block cursor-default rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white transition-colors duration-200 hover:bg-graphite">
              Wygeneruj 20 zadań
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
