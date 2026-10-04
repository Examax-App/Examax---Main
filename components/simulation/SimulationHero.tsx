import { ArrowUpRight, CornerDownRight, Flag, Layers, ListChecks, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { ProMark } from "@/components/ui/ProMark";
import { GridPattern } from "@/components/training/GridPattern";
import { CKE_SHEET_URL, SITTING } from "@/components/simulation/sitting";
import { FinishedSheet } from "@/components/simulation/FinishedSheet";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/* ---------------------------------------------------------------------------
 * The /simulation hero — dub.co/solutions/creators' hero, one to one (live
 * DOM, 2026-10-02): the 60px grid and a three-stop sweep at 15% behind a
 * centred pill, headline, portrait card, subline and two actions, each
 * sliding up in turn; two stacks of small analytics cards either side of
 * the portrait, fading out downward and arriving 400ms and 600ms late.
 *
 * Dub's portrait is a creator with their short link docked at the foot of
 * the photo. Here it is the sheet itself, finished and marked — Zadanie 10
 * of CKE's May 2025 paper worked through in ink on the squared grid, each
 * rubric point ticked — with the sitting docked under it as a real link to
 * that paper in CKE's archive. The side cards are the
 * report's breakdowns and the sheet's last two tasks, where dub has
 * countries, devices and live clicks. Dub's sweep is green and blue; this
 * one is the simulation's lavender.
 *
 * PLACEHOLDER DATA — the learner and her figures are illustrative.
 * ------------------------------------------------------------------------- */

type Row = { label: string; value: string; share: number };

/** One of the side cards: a hairline card with a boxed glyph, a title and its rows. */
function SideCard({ icon: Icon, title, rows }: { icon: IconComponent; title: string; rows: Row[] }) {
  return (
    <div className="w-40 rounded-lg border border-ash bg-white p-2.5 text-left shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-md border border-ash">
          <Icon className="size-3 text-slate" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-medium text-charcoal">{title}</span>
      </div>
      <div className="mt-2.5 flex flex-col gap-1">
        {rows.map((row, index) => (
          <div key={row.label} className={cn("relative flex items-center justify-between px-1.5 py-1 text-[10px]", index === rows.length - 1 && "opacity-50")}>
            <span className="absolute inset-y-0 left-0 rounded-[4px] bg-paper-mist" style={{ width: `${row.share}%` }} />
            <span className="relative text-steel">{row.label}</span>
            <span className="relative tabular-nums text-fog">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The right-hand stack's event card: one task of the sheet, the way it was left. */
function TaskCard({ task, note, status, faded }: { task: string; note: string; status: "saved" | "flagged"; faded?: boolean }) {
  return (
    <div className={cn("w-40 rounded-lg border border-ash bg-white p-2.5 text-left shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]", faded && "opacity-60")}>
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-md border border-ash">
          <PencilLine className="size-3 text-slate" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-medium text-charcoal">{task}</span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-ash px-2 py-1.5 text-[10px]">
        <span className="text-fog">{note}</span>
        {status === "saved" ? (
          <span className="rounded bg-[#dcfce7] px-1 text-[9px] font-medium leading-4 text-[#166534]">Zapisano</span>
        ) : (
          <Flag className="size-3 text-tangerine" strokeWidth={2} />
        )}
      </div>
    </div>
  );
}

/** The right-hand stack's top card: the points as the sheet went on, and its headline figures. */
function ScoreCard() {
  const { curve } = SITTING;
  const w = 136;
  const h = 40;
  const points = curve.map((value, i) => `${(i / (curve.length - 1)) * w},${h - value * (h - 4)}`).join(" ");
  return (
    <div className="w-40 rounded-lg border border-ash bg-white p-2.5 text-left shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <span className="text-[11px] font-medium text-charcoal">Punkty w czasie</span>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-10 w-full overflow-visible">
        <defs>
          <linearGradient id="hero-score-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#hero-score-fill)" />
        <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="mt-2.5 text-[10px] font-medium text-charcoal">Podsumowanie</p>
      <div className="mt-1 flex flex-col gap-0.5 text-[10px]">
        <span className="flex justify-between">
          <span className="text-silver">Wynik</span>
          <span className="text-steel">
            {SITTING.score}/{SITTING.max} pkt
          </span>
        </span>
        <span className="flex justify-between">
          <span className="text-silver">Czas</span>
          <span className="text-steel">{SITTING.minutes} min</span>
        </span>
        <span className="flex justify-between opacity-50">
          <span className="text-silver">Zadania</span>
          <span className="text-steel">{SITTING.tasks}/{SITTING.tasks}</span>
        </span>
      </div>
    </div>
  );
}

export function SimulationHero() {
  return (
    <section aria-labelledby="simulation-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] bg-white px-4 py-8 text-center sm:pb-20 sm:pt-12">
        {/* The column's edges, fading in as they come down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black_50%)]" />

        {/* The grid: one field across the column and two wings beyond it */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 opacity-60 [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="simulation-grid-left" className="bottom-0 right-full h-[600px] w-[360px] text-ash [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="simulation-grid-right" className="bottom-0 left-full h-[600px] w-[360px] text-ash [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden opacity-60 [mask-image:linear-gradient(transparent,black)]">
          <GridPattern id="simulation-grid" className="bottom-0 left-1/2 h-[600px] w-[var(--page-max-width)] -translate-x-1/2 text-ash" />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* The side cards: the report's breakdowns on the left, the sheet's last tasks on the right */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[1200px] -translate-x-1/2 select-none md:block">
            <div className="animate-slide-up-fade absolute inset-0" style={{ "--offset": "10px", "--delay": "400ms" } as React.CSSProperties}>
              <div className="absolute left-1/2 top-[231.5px] flex -translate-x-[400.5px] flex-col gap-2 [mask-image:linear-gradient(black_50%,transparent)]">
                <SideCard
                  icon={Layers}
                  title="Działy"
                  rows={[
                    { label: "Funkcje", value: "93%", share: 93 },
                    { label: "Ciągi", value: "86%", share: 86 },
                    { label: "Planimetria", value: "78%", share: 78 },
                    { label: "Stereometria", value: "67%", share: 67 },
                  ]}
                />
                <SideCard
                  icon={ListChecks}
                  title="Typy zadań"
                  rows={[
                    { label: "Zamknięte", value: "94%", share: 94 },
                    { label: "Prawda / fałsz", value: "83%", share: 83 },
                    { label: "Otwarte", value: "72%", share: 72 },
                    { label: "Dowody", value: "50%", share: 50 },
                  ]}
                />
              </div>
            </div>
            <div className="animate-slide-up-fade absolute inset-0" style={{ "--offset": "10px", "--delay": "600ms" } as React.CSSProperties}>
              <div className="absolute left-1/2 top-[311.5px] flex translate-x-[239.5px] flex-col gap-2 [mask-image:linear-gradient(black_50%,transparent)]">
                <ScoreCard />
                <TaskCard task="Zadanie 10" note="Nierówność" status="saved" />
                <TaskCard task="Zadanie 21" note="Do sprawdzenia" status="flagged" faded />
              </div>
            </div>
          </div>

          {/* The sweep: dub's three-stop wash at 15%, in the simulation's lavender */}
          <div className="absolute -left-1/4 top-0 h-full w-[150%] opacity-15">
            <div className="size-full bg-[linear-gradient(90deg,#C4B5FD,#7C3AED,#93C5FD)] [mask-image:linear-gradient(transparent_25%,black)]" />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <span className="relative flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ash bg-white py-1 pl-1 pr-3 text-xs font-medium leading-tight text-steel">
            <ProMark scale={0.7} />
            Symulacja egzaminu
          </span>
          <h1
            id="simulation-heading"
            className="animate-slide-up-fade mt-5 text-balance text-center font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
            style={{ "--offset": "20px" } as React.CSSProperties}
          >
            Napisz egzamin, zanim zacznie się liczyć
          </h1>

          {/* The portrait: the sheet, finished and marked, and the sitting it belongs to */}
          <div
            className="animate-slide-up-fade relative mt-6 aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl border border-ash bg-white shadow-sm"
            style={{ "--offset": "10px", "--delay": "200ms" } as React.CSSProperties}
          >
            <FinishedSheet />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-current text-[#7C3AED] opacity-60" />
            <div className="absolute inset-x-2 bottom-2 rounded-[12px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <a
                href={CKE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Arkusz CKE: ${SITTING.exam}, ${SITTING.subject.toLowerCase()} (otwiera się w nowej karcie)`}
                className="focus-ring group flex items-center justify-between rounded-md border border-ash bg-white px-4 py-2.5 transition-colors duration-100 hover:bg-paper-mist"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-7 flex-none place-items-center rounded-full border border-ash bg-gradient-to-t from-paper-mist to-white">
                    <MaturaIcon className="h-3 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-col items-start text-sm leading-tight">
                    <span className="truncate font-semibold text-graphite">
                      {SITTING.exam} · {SITTING.subject}
                    </span>
                    <span className="flex items-center gap-1 text-fog">
                      <CornerDownRight className="size-3 shrink-0" strokeWidth={2} />
                      <span className="truncate">
                        {SITTING.score}/{SITTING.max} pkt · {SITTING.minutes} min
                      </span>
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 -translate-x-0.5 translate-y-0.5 text-fog opacity-0 transition-[transform,opacity] duration-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  strokeWidth={2}
                />
              </a>
            </div>
          </div>

          <p
            className="animate-slide-up-fade mt-5 text-pretty text-lg font-medium text-fog sm:text-xl"
            style={{ "--offset": "10px", "--delay": "400ms" } as React.CSSProperties}
          >
            Pełny arkusz CKE na czas, z narzędziami jak na sali — a potem dokładnie widzisz, gdzie tracisz punkty.
          </p>
        </div>
        <div
          className="animate-slide-up-fade relative mx-auto mt-6 flex max-w-fit gap-4"
          style={{ "--offset": "5px", "--delay": "600ms" } as React.CSSProperties}
        >
          <Button href="/signup" variant="primary">
            Zacznij za darmo
          </Button>
          <Button href="/pricing" variant="outline">
            Zobacz cennik
          </Button>
        </div>
      </div>
    </section>
  );
}
