"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Expand, Flag, Gauge } from "lucide-react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const START_SECONDS = 98 * 60 + 42;

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const reportRows = [
  { label: "Procenty", pct: 92, className: "bg-vivid-green" },
  { label: "Równania", pct: 74, className: "bg-electric-blue" },
  { label: "Geometria", pct: 51, className: "bg-tangerine" },
];

/**
 * Simulation showcase — an Examax-branded mock exam sheet presented as a
 * floating document, with a live countdown chip and a readiness-report card
 * anchored to its edges. Deliberately calm: this is the product vision.
 */
export function SimulationShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current <= 90 * 60 ? START_SECONDS : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  return (
    <div ref={ref} className="relative mx-auto max-w-2xl">
      <div
        role="img"
        aria-label="Podgląd symulacji egzaminu w Examax: arkusz próbny w egzaminacyjnym formacie, licznik czasu i raport gotowości"
      >
        {/* The exam sheet */}
        <div className="relative overflow-hidden rounded-largecards border border-ash bg-white shadow-ring">
          {/* Sheet header — deliberately formal, mono metadata */}
          <div className="border-b border-ash px-6 py-5 sm:px-10 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                  Arkusz próbny · Examax
                </p>
                <p className="mt-2 font-satoshi text-heading-sm font-bold tracking-tight text-charcoal">
                  Matematyka
                </p>
                <p className="text-[13px] text-steel">
                  Egzamin ósmoklasisty · poziom egzaminacyjny
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#fef3c7] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#92400e]">
                W przygotowaniu
              </span>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-geist-mono text-[12px] text-steel">
              <div className="flex gap-1.5">
                <dt>Czas pracy:</dt>
                <dd className="text-charcoal">100 minut</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Zadania:</dt>
                <dd className="text-charcoal">1–19</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Punkty:</dt>
                <dd className="text-charcoal">25</dd>
              </div>
            </dl>
          </div>

          {/* Sheet body — one real task, the rest as calm skeleton lines */}
          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] font-semibold text-charcoal">
                Zadanie 1. <span className="font-normal text-fog">(0–1)</span>
              </p>
              <Flag className="size-4 text-silver" aria-hidden />
            </div>
            <p className="mt-2 max-w-lg text-body text-slate">
              Dane są liczby: a = 3⁴ oraz b = 4³. Oceń, czy poniższe zdania są
              prawdziwe.
            </p>
            <div className="mt-3 space-y-2">
              {["Liczba a jest większa od liczby b.", "Suma liczb a i b jest liczbą parzystą."].map(
                (statement) => (
                  <div
                    key={statement}
                    className="flex items-center justify-between gap-3 rounded-buttons border border-ash px-3.5 py-2.5 text-[13px] text-steel"
                  >
                    {statement}
                    <span className="flex shrink-0 gap-1.5" aria-hidden>
                      <span className="rounded-[6px] border border-smoke px-2 py-0.5 font-geist-mono text-[11px] text-fog">
                        P
                      </span>
                      <span className="rounded-[6px] border border-smoke px-2 py-0.5 font-geist-mono text-[11px] text-fog">
                        F
                      </span>
                    </span>
                  </div>
                ),
              )}
            </div>

            {/* Remaining tasks as skeleton */}
            <div className="mt-6 space-y-4" aria-hidden>
              <div className="space-y-2">
                <div className="h-2.5 w-24 rounded-full bg-ash/80" />
                <div className="h-2 w-full rounded-full bg-paper-mist" />
                <div className="h-2 w-4/5 rounded-full bg-paper-mist" />
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-24 rounded-full bg-ash/80" />
                <div className="h-2 w-full rounded-full bg-paper-mist" />
                <div className="h-2 w-3/5 rounded-full bg-paper-mist" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating timer chip */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-ash bg-white py-2 pl-3 pr-4 text-body font-medium text-charcoal shadow-md">
            <AlarmClock className="size-4 text-tangerine" aria-hidden />
            <span className="font-geist-mono tabular-nums">
              {formatClock(seconds)}
            </span>
            <span className="hidden text-fog sm:inline">do końca</span>
          </span>
        </div>

        {/* Floating fullscreen chip */}
        <div className="absolute -left-5 bottom-24 hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-2 text-[12px] font-medium text-steel shadow-md">
            <Expand className="size-3.5" aria-hidden />
            Tryb pełnoekranowy
          </span>
        </div>

        {/* Floating readiness report card */}
        <div className="mt-6 sm:absolute sm:-bottom-12 sm:-right-8 sm:mt-0 sm:w-60 lg:-right-20">
          <div className="animate-float rounded-largecards border border-ash bg-white p-4 shadow-md">
            <p className="flex items-center gap-2 text-body font-semibold text-charcoal">
              <Gauge className="size-4 text-vivid-green" aria-hidden />
              Raport po symulacji
            </p>
            <div className="mt-3 space-y-2.5">
              {reportRows.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-steel">{row.label}</span>
                    <span className="font-geist-mono text-fog">{row.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-mist">
                    <div
                      className={cn("h-full rounded-full", row.className)}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-ash pt-2.5 text-[11px] text-fog">
              Wiesz, co dopracować — zanim zabraknie czasu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
