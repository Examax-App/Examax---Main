"use client";

import { useRef } from "react";
import Link from "@/components/ui/Link";
import { ArrowUpRight, ChartNoAxesColumnIncreasing, ListChecks, Repeat, Sparkles } from "lucide-react";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { Reveal } from "@/components/ui/Reveal";
import { GridPattern } from "@/components/training/GridPattern";
import { TaskFigure, type FigureName } from "@/components/training/TaskFigure";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/* ---------------------------------------------------------------------------
 * "Zadania podobne do Twoich błędów" — dub.co/partners' "Partner discovery",
 * one to one: three 172px cards on a faded grid, the middle one raised 28px,
 * each tilting towards the pointer in 3D with a soft glow following it; then
 * a plan pill and the heading block underneath.
 *
 * The reference's cards are partners it recommends. Examax recommends tasks:
 * the same skill (here, Pythagoras) met on another sheet, in another shape,
 * or one level up.
 *
 * PLACEHOLDER DATA — the task numbers and sheets are illustrative.
 * ------------------------------------------------------------------------- */

type Similar = {
  task: string;
  exam: "e8" | "matura";
  sheet: string;
  figure: FigureName;
  facts: [{ icon: IconComponent; label: string }, { icon: IconComponent; label: string }];
  raised?: boolean;
};

const CARDS: Similar[] = [
  {
    task: "Zadanie 9",
    exam: "e8",
    sheet: "E8 · 2021",
    figure: "rightTriangle",
    facts: [
      { icon: Repeat, label: "Ta sama metoda" },
      { icon: ListChecks, label: "0–2 pkt" },
    ],
  },
  {
    task: "Zadanie 14",
    exam: "e8",
    sheet: "E8 · 2024",
    figure: "trapezoid",
    raised: true,
    facts: [
      { icon: Sparkles, label: "Najbliższe" },
      { icon: ListChecks, label: "0–2 pkt" },
    ],
  },
  {
    task: "Zadanie 11",
    exam: "matura",
    sheet: "Matura · 2023",
    figure: "pyramid",
    facts: [
      { icon: ChartNoAxesColumnIncreasing, label: "Poziom wyżej" },
      { icon: ListChecks, label: "0–3 pkt" },
    ],
  },
];

/** The reference's tilt: up to ~10° either way, a 2% lift, glow at the pointer. */
const MAX_TILT = 10;

function TiltCard({ card }: { card: Similar }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const Mark = card.exam === "e8" ? E8Icon : MaturaIcon;

  const set = (vars: Record<string, string>) => {
    const node = ref.current;
    if (!node) return;
    for (const [key, value] of Object.entries(vars)) node.style.setProperty(key, value);
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    set({
      "--card-rotate-x": `${(0.5 - y) * MAX_TILT * 2}deg`,
      "--card-rotate-y": `${(x - 0.5) * MAX_TILT * 2}deg`,
      "--card-scale": "1.02",
      "--glow-x": `${x * 100}%`,
      "--glow-y": `${y * 100}%`,
      "--glow-opacity": "1",
    });
  };

  const onLeave = () =>
    set({ "--card-rotate-x": "0deg", "--card-rotate-y": "0deg", "--card-scale": "1", "--glow-opacity": "0" });

  return (
    <div className={cn("pointer-events-auto [perspective:1200px]", card.raised && "-translate-y-7")}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative flex w-[172px] transform-gpu flex-col items-center rounded-xl border border-ash bg-paper-mist p-3 pt-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-200 ease-out will-change-transform [transform-style:preserve-3d] hover:shadow-[0_24px_40px_-18px_rgba(0,0,0,0.08),0_12px_20px_-16px_rgba(0,0,0,0.08),inset_0_0_4px_rgba(255,255,255,0.08)]"
        style={{
          transform:
            "rotateX(var(--card-rotate-x,0deg)) rotateY(var(--card-rotate-y,0deg)) scale(var(--card-scale,1)) translateZ(0)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-[var(--glow-opacity,0)] transition-opacity duration-200"
          style={{
            background:
              "radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,0.72), rgba(255,255,255,0.18) 28%, transparent 62%)",
          }}
        />
        <div className="relative mt-4 grid aspect-square size-20 place-items-center rounded-full border border-ash bg-white text-graphite [transform:translateZ(28px)]">
          <TaskFigure name={card.figure} className="size-12" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_#fff] [mask-image:linear-gradient(transparent,black)]" />
        </div>
        <div className="relative mt-3 flex flex-col items-center gap-1.5 [transform:translateZ(22px)]">
          <span className="font-satoshi text-body font-bold text-charcoal">{card.task}</span>
          <div className="flex items-center gap-1">
            <Mark className="h-2.5 w-3" />
            <span className="text-[10px] font-medium text-steel">{card.sheet}</span>
          </div>
        </div>
        <div className="relative mt-4 flex w-full flex-col gap-2 [transform:translateZ(36px)]">
          <div className="grid grid-cols-2 rounded-lg bg-white px-2 py-3 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)]">
            {card.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col items-center gap-1 text-graphite">
                <fact.icon className="size-3" strokeWidth={2} />
                <span className="text-center text-[8px] font-semibold leading-normal text-steel">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimilarTasks() {
  return (
    <section
      id="similar"
      aria-labelledby="similar-heading"
      className="relative overflow-clip border-b border-ash bg-white px-4"
    >
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash py-24">
        {/* The grid, fading in and out top to bottom, wings beyond the column */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black,transparent)]"
        >
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="similar-grid-left" className="bottom-0 right-full h-[600px] w-[360px] text-ash/40 [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="similar-grid-right" className="bottom-0 left-full h-[600px] w-[360px] text-ash/40 [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black,transparent)]">
          <GridPattern id="similar-grid" className="bottom-0 left-1/2 h-[600px] w-[var(--page-max-width)] -translate-x-1/2 text-ash/50" />
        </div>

        <Reveal className="relative flex w-full justify-center overflow-hidden py-12">
          <div aria-hidden className="flex w-max gap-8 sm:gap-16">
            {CARDS.map((card) => (
              <TiltCard key={card.task} card={card} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={80} className="relative mx-auto mt-8 w-full max-w-[640px] px-4 text-center">
          <Link
            href="/pricing"
            className="group mb-4 inline-flex items-center rounded-full bg-soft-violet px-2 py-1 text-xs font-semibold tracking-[-0.24px] text-lavender transition-[background-color,padding] duration-200 hover:pr-1"
          >
            <span className="leading-4">Plan Pro</span>
            <span className="-mr-4 ml-0 flex w-4 items-center justify-center opacity-0 transition-[margin,opacity] duration-200 group-hover:ml-1 group-hover:mr-0 group-hover:opacity-100">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#ddd6fe]">
                <ArrowUpRight className="size-2.5 -translate-x-1 text-lavender opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={2.5} />
              </span>
            </span>
          </Link>
          <h2
            id="similar-heading"
            className="text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-5xl"
          >
            Zadania podobne do Twoich błędów
          </h2>
          <p className="mt-3 text-pretty text-lg text-fog">
            Pomyliłeś się? Examax znajdzie zadania, które sprawdzają tę samą
            umiejętność — z innych arkuszy, na innych liczbach albo o poziom
            trudniej.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
