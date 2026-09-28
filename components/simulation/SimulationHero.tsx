import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";

/**
 * The hero wash.
 *
 * Same construction as /training's and /roadmap's — a flat left-to-right
 * pastel sweep at ~10% that stops dead at the content column's edges. Led by
 * tangerine, which `app/globals.css` reserves for exactly this feature: the
 * simulation is the one surface meant to read as an event rather than as a
 * study screen, and it is the only page in the set that runs warm.
 */
const HERO_WASH = [
  "linear-gradient(to right",
  "color-mix(in oklab, var(--color-tangerine) 11%, #ffffff) 0%",
  "color-mix(in oklab, var(--color-soft-amber) 42%, #ffffff) 50%",
  "color-mix(in oklab, var(--color-electric-blue) 9%, #ffffff) 100%)",
].join(", ");

/**
 * The wall's edge falloff.
 *
 * Third variation in the set, and the one that suits a desk of papers: a
 * radial that keeps the middle of the block crisp and lets every edge go,
 * rather than /training's downward fade or /roadmap's rightward one. Nothing
 * here runs off toward anything — the sheets simply carry on past the frame.
 */
const WALL_MASK =
  "radial-gradient(ellipse 78% 82% at 50% 42%, black 42%, transparent 100%)";

type SheetState = "done" | "running" | "new";

type Sheet = {
  subject: string;
  session: string;
  points: string;
  percent: number | null;
  time: string;
  state: SheetState;
};

/* ---------------------------------------------------------------------------
 * PLACEHOLDER DATA — sessions and scores are illustrative.
 *
 * Sheets rather than topics or nodes: the object a simulation produces is a
 * graded arkusz, so the wall is a stack of them. It does not drift — the other
 * two product walls do, and an exam is the one thing in the product that holds
 * still. Focus comes from contrast instead: the sheet in progress and the two
 * beside it stay at full weight while the rest fall away with the mask.
 * ------------------------------------------------------------------------- */
const sheets: Sheet[] = [
  { subject: "Matematyka", session: "maj 2024", points: "21 / 25", percent: 84, time: "1:38", state: "done" },
  { subject: "Język polski", session: "maj 2024", points: "38 / 45", percent: 84, time: "2:41", state: "done" },
  { subject: "Matematyka", session: "maj 2023", points: "14 / 25", percent: 56, time: "1:52", state: "running" },
  { subject: "Język angielski", session: "maj 2024", points: "—", percent: null, time: "—", state: "new" },

  { subject: "Matematyka", session: "kwiecień 2022", points: "19 / 25", percent: 76, time: "1:44", state: "done" },
  { subject: "Język polski", session: "maj 2023", points: "31 / 45", percent: 69, time: "2:58", state: "done" },
  { subject: "Matematyka PR", session: "maj 2024", points: "—", percent: null, time: "—", state: "new" },
  { subject: "Język angielski", session: "maj 2023", points: "42 / 50", percent: 84, time: "1:12", state: "done" },

  { subject: "Matematyka", session: "maj 2021", points: "17 / 25", percent: 68, time: "1:49", state: "done" },
  { subject: "Język polski", session: "maj 2022", points: "—", percent: null, time: "—", state: "new" },
  { subject: "Matematyka PP", session: "maj 2024", points: "33 / 45", percent: 73, time: "2:26", state: "done" },
  { subject: "Język angielski", session: "maj 2022", points: "—", percent: null, time: "—", state: "new" },
];

const stateLabel: Record<SheetState, { label: string; className: string }> = {
  done: { label: "Sprawdzony", className: "bg-soft-mint text-[#166534]" },
  running: { label: "W trakcie", className: "bg-soft-peach text-[#7c2d12]" },
  new: { label: "Nierozwiązany", className: "bg-paper-mist text-fog" },
};

function SheetCard({ sheet }: { sheet: Sheet }) {
  const state = stateLabel[sheet.state];
  return (
    <article
      className={cn(
        "rounded-cards border bg-white p-3 shadow-subtle",
        sheet.state === "running" ? "border-tangerine/40" : "border-ash",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium leading-tight text-charcoal">
            {sheet.subject}
          </p>
          <p className="mt-0.5 truncate text-[10.5px] text-fog">
            Arkusz CKE · {sheet.session}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none",
            state.className,
          )}
        >
          {state.label}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 divide-x divide-ash border-t border-ash pt-2">
        <div className="pr-2">
          <p className="text-[10px] leading-none text-fog">Punkty</p>
          <p className="mt-1 font-geist-mono text-[11px] leading-none text-charcoal tabular-nums">
            {sheet.points}
          </p>
        </div>
        <div className="pl-2">
          <p className="text-[10px] leading-none text-fog">Czas</p>
          <p className="mt-1 font-geist-mono text-[11px] leading-none text-charcoal tabular-nums">
            {sheet.time}
          </p>
        </div>
      </div>

      {/* The bar is the sheet's score, so an unsolved sheet gets an empty
          track rather than a bar at zero pretending to be a result. */}
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-paper-mist">
        {sheet.percent === null ? null : (
          <span
            className={cn(
              "block h-full rounded-full",
              sheet.state === "running" ? "bg-tangerine" : "bg-vivid-green",
            )}
            style={{ width: `${sheet.percent}%` }}
          />
        )}
      </div>
    </article>
  );
}

/**
 * The /simulation hero.
 *
 * Above the fold, so the copy stack animates with the reference's pure-CSS
 * slide-up-fade staggered by `animation-delay` rather than through `<Reveal>`
 * and an observer — the same construction as the other product heroes.
 *
 * The "Wkrótce" marker beside the badge is not decoration: simulations are not
 * shipped yet (see `components/sections/Simulation.tsx` and the landing FAQ),
 * and a product page that reads as available would be the one dishonest
 * surface on the site.
 */
export function SimulationHero() {
  return (
    <section
      aria-labelledby="simulation-heading"
      className="col-rules relative overflow-hidden bg-white"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-full max-w-[var(--page-max-width)] -translate-x-1/2"
        style={{ backgroundImage: HERO_WASH }}
      />

      <div className="relative mx-auto w-full max-w-[var(--page-max-width)] px-5 pb-16 pt-14 sm:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span
            style={{ "--offset": "10px" } as React.CSSProperties}
            className="animate-slide-up-fade inline-flex items-center gap-2 rounded-full border border-ash bg-white/80 py-1.5 pl-1.5 pr-2 text-[12px] font-medium text-charcoal shadow-subtle backdrop-blur-sm"
          >
            <AccentTile icon={Timer} accent="tangerine" />
            Symulacja egzaminu
            <span className="ml-1 rounded-full bg-soft-peach px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#7c2d12]">
              Wkrótce
            </span>
          </span>

          <h1
            id="simulation-heading"
            style={{ "--delay": "100ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty font-satoshi text-4xl font-medium leading-[1.15] text-charcoal sm:text-5xl"
          >
            Przeżyj egzamin, zanim zacznie się liczyć
          </h1>

          <p
            style={{ "--delay": "200ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty text-xl leading-7 text-steel"
          >
            Pełny arkusz CKE, czas liczony jak na sali i punktacja według zasad
            oceniania — zakończone raportem gotowości.
          </p>

          <div
            style={{ "--delay": "300ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="/signup" variant="primary">
              Zapisz się na start
            </Button>
            <Button href="#run" variant="outline">
              Zobacz, jak to wygląda
            </Button>
          </div>

          <p
            style={{ "--delay": "380ms" } as React.CSSProperties}
            className="animate-slide-up-fade mt-4 text-[13px] text-fog"
          >
            Symulacje wchodzą do planów Pro i Max. Konto zakładasz już teraz.
          </p>
        </div>

        {/* The desk: twelve sheets, still. The other two product walls drift;
            this one is the exam, and the exam does not move. */}
        <div
          aria-label="Arkusze próbne: rozwiązane, w trakcie i jeszcze nierozwiązane"
          style={
            {
              "--delay": "420ms",
              "--offset": "24px",
              maskImage: WALL_MASK,
              WebkitMaskImage: WALL_MASK,
            } as React.CSSProperties
          }
          className="animate-slide-up-fade relative mt-14 grid h-[340px] grid-cols-2 gap-3 overflow-hidden sm:h-[380px] lg:grid-cols-4"
        >
          {sheets.map((sheet, index) => (
            <div
              key={`${sheet.subject}-${sheet.session}-${index}`}
              className={cn(index >= 8 && "hidden lg:block")}
            >
              <SheetCard sheet={sheet} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
