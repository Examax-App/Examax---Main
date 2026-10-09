"use client";

import { CircleCheck, Eraser, FileCheck, PencilLine, Route, SquareFunction, Timer } from "lucide-react";
import { SheetPage, SourcesCarousel, type Story } from "@/components/training/SourcesCarousel";
import { SITTING } from "@/components/simulation/sitting";
import { cn } from "@/lib/cn";
import type { FigureName } from "@/components/training/TaskFigure";

/*
 * dub.co/solutions/creators' "From content to growth" (live DOM,
 * 2026-10-02) — the same carousel /training runs: a heading between dotted
 * wings, a muted band with 2:1 slides (picture, colour rising from the
 * foot, a tag top right, the headline and a link bottom left) and pill tabs
 * under it, advancing every six seconds and pausing under the pointer.
 *
 * Dub tells customer stories. Examax has none yet and invents none, so the
 * four slides are the four steps of one simulation, each picture the sheet
 * on the desk with the screen of that step laid over it.
 */

/** The step's screen, floating over the sheets — from `sm` up; a phone's slide has room only for the headline. */
function Screen({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("absolute w-[34%] min-w-[150px] rounded-xl border border-black/5 bg-white p-4 text-charcoal shadow-2xl max-sm:hidden", className)}>
      {children}
    </div>
  );
}

function Desk({ figure, children }: { figure: FigureName; children: React.ReactNode }) {
  return (
    <>
      <SheetPage figure={figure} className="right-[30%] top-[10%] w-[26%] rotate-[-6deg] opacity-90" />
      <SheetPage figure={figure} className="right-[6%] top-[-6%] w-[30%] rotate-[4deg]" />
      {children}
    </>
  );
}

const STEPS: Story[] = [
  {
    tab: "Start",
    icon: Timer,
    tag: "Krok 1",
    colour: "#7c3aed",
    figure: "parabola",
    title: "Wybierasz arkusz, a zegar rusza jak na sali",
    link: { href: "/training#coverage", label: "Zobacz arkusze" },
    picture: (
      <Desk figure="parabola">
        <Screen className="right-[40%] top-[14%]">
          <p className="text-[8px] text-fog sm:text-xs">
            {SITTING.exam} · {SITTING.subject}
          </p>
          <p className="mt-1 text-lg font-medium tabular-nums sm:text-4xl">179:58</p>
          <p className="text-[8px] text-fog sm:text-xs">do końca egzaminu</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper-mist sm:mt-3">
            <div className="h-full w-[2%] rounded-full bg-lavender" />
          </div>
        </Screen>
      </Desk>
    ),
  },
  {
    tab: "Arkusz",
    icon: PencilLine,
    tag: "Krok 2",
    colour: "#4f46e5",
    figure: "parabola",
    title: "Piszesz piórem po arkuszu, z kartą wzorów pod ręką",
    link: { href: "#tools", label: "Zobacz narzędzia" },
    picture: (
      <Desk figure="parabola">
        <Screen className="right-[40%] top-[14%]">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-medium sm:text-xs">Zadanie 10. (0–2)</p>
            <span className="flex gap-0.5 sm:gap-1">
              {[PencilLine, Eraser, SquareFunction].map((Icon, index) => (
                <span key={index} className={cn("grid size-4 place-items-center rounded sm:size-6", index === 0 ? "bg-soft-blue text-deep-sapphire" : "text-fog")}>
                  <Icon className="size-2.5 sm:size-3.5" strokeWidth={2} />
                </span>
              ))}
            </span>
          </div>
          <div className="mt-2 space-y-1 border-t border-ash pt-2 text-[9px] italic text-charcoal sm:mt-3 sm:space-y-1.5 sm:pt-3 sm:text-sm">
            <p>6x² − 11x + 3 &lt; 0</p>
            <p>Δ = 121 − 72 = 49</p>
            <p className="text-electric-blue">x ∈ (1/3, 3/2)</p>
          </div>
        </Screen>
      </Desk>
    ),
  },
  {
    tab: "Sprawdzanie",
    icon: FileCheck,
    tag: "Krok 3",
    colour: "#9333ea",
    figure: "bars",
    title: "Examax sprawdza arkusz według zasad oceniania CKE",
    link: { href: "#report", label: "Zobacz raport" },
    picture: (
      <Desk figure="bars">
        <Screen className="right-[40%] top-[14%]">
          <p className="text-[8px] text-fog sm:text-xs">Wynik</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="text-lg font-medium tabular-nums sm:text-4xl">{SITTING.score}</span>
            <span className="text-[9px] text-fog sm:text-sm">/ {SITTING.max} pkt · {SITTING.percent}%</span>
          </p>
          <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
            {[
              ["Funkcje", 93],
              ["Planimetria", 78],
              ["Stereometria", 67],
            ].map(([label, share]) => (
              <div key={label} className="relative flex justify-between rounded px-1.5 py-0.5 text-[8px] sm:text-xs">
                <span className="absolute inset-y-0 left-0 rounded bg-[#ede9fe]" style={{ width: `${share}%` }} />
                <span className="relative text-steel">{label}</span>
                <span className="relative tabular-nums text-fog">{share}%</span>
              </div>
            ))}
          </div>
        </Screen>
      </Desk>
    ),
  },
  {
    tab: "Plan",
    icon: Route,
    tag: "Krok 4",
    colour: "#2563eb",
    figure: "pyramid",
    title: "Działy do poprawy trafiają do Twojej roadmapy",
    link: { href: "/roadmap", label: "Zobacz roadmapę" },
    picture: (
      <Desk figure="pyramid">
        <Screen className="right-[40%] top-[14%]">
          <p className="flex items-center gap-1.5 text-[8px] font-medium sm:text-xs">
            <Route className="size-3 text-electric-blue sm:size-4" strokeWidth={2} />
            Dodano do roadmapy
          </p>
          <div className="mt-2 space-y-1 border-t border-ash pt-2 sm:mt-3 sm:space-y-1.5 sm:pt-3">
            {["Stereometria · 2 lekcje", "Planimetria · 6 zadań", "Statystyka · quiz"].map((row) => (
              <p key={row} className="flex items-center gap-1.5 text-[8px] text-steel sm:text-xs">
                <CircleCheck className="size-2.5 text-vivid-green sm:size-3.5" strokeWidth={2} />
                {row}
              </p>
            ))}
          </div>
        </Screen>
      </Desk>
    ),
  },
];

export function StepsCarousel() {
  return (
    <SourcesCarousel
      id="steps"
      title="Od arkusza do wyniku"
      sub="Cztery kroki: rozpoczęcie arkusza, rozwiązanie, sprawdzenie i plan dalszej nauki."
      stories={STEPS}
      tail={false}
    />
  );
}
