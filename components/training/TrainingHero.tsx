import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile } from "@/components/ui/FeaturePill";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { TaskFigure, type FigureName } from "@/components/training/TaskFigure";
import { GridPattern } from "@/components/training/GridPattern";

/* ---------------------------------------------------------------------------
 * The /training hero — dub.co/partners' hero, one to one (read off the live
 * DOM on 2026-09-30): pill, headline, subline and two actions over a 15%
 * gradient sweep and a 60px grid, then a 4×3 wall of 300×120 cards that is
 * cropped by two intersecting masks and slides in card by card.
 *
 * The reference's cards are partners (portrait, flag, name, Revenue and
 * Payouts). Here they are tasks: the figure the sheet prints, the exam's
 * official mark, the topic, and the two facts a student checks first —
 * which sheet it came from and what it is worth. Maths, Polish and English
 * are mixed through the wall, with a language task in every visible row.
 *
 * PLACEHOLDER DATA — the sheet years and point ranges are illustrative.
 * ------------------------------------------------------------------------- */

type Task = {
  topic: string;
  exam: "e8" | "matura";
  sheet: string;
  points: string;
  figure: FigureName;
};

const TASKS: Task[] = [
  { topic: "Statystyka", exam: "e8", sheet: "2021", points: "0–1", figure: "bars" },
  { topic: "Procenty", exam: "e8", sheet: "2024", points: "0–1", figure: "percent" },
  { topic: "Reading", exam: "matura", sheet: "2024", points: "0–5", figure: "choice" },
  { topic: "Ciągi", exam: "matura", sheet: "2022", points: "0–2", figure: "sequence" },
  { topic: "Nierówności", exam: "matura", sheet: "2020", points: "0–1", figure: "numberLine" },
  { topic: "Funkcja liniowa", exam: "matura", sheet: "2024", points: "0–2", figure: "linear" },
  { topic: "Rozprawka", exam: "e8", sheet: "2023", points: "0–20", figure: "essay" },
  { topic: "Okrąg i koło", exam: "matura", sheet: "2023", points: "0–2", figure: "circle" },
  { topic: "Trapez", exam: "e8", sheet: "2019", points: "0–2", figure: "trapezoid" },
  { topic: "Past Simple", exam: "e8", sheet: "2022", points: "0–1", figure: "gapFill" },
  { topic: "Kombinatoryka", exam: "matura", sheet: "2024", points: "0–2", figure: "tree" },
  { topic: "Ostrosłupy", exam: "matura", sheet: "2023", points: "0–4", figure: "pyramid" },
];

/**
 * The reference's entrance delays: the columns land left to right in about
 * 180ms, and each row a hair after the one above.
 */
const COLUMN_DELAYS = [425, 497, 590, 603];

function TaskCard({ task, delay }: { task: Task; delay: number }) {
  const Mark = task.exam === "e8" ? E8Icon : MaturaIcon;
  return (
    <div className="h-[120px] w-[300px] p-2">
      <div
        className="animate-slide-up-fade flex size-full select-none overflow-hidden rounded-[10px] border border-ash bg-white p-2"
        style={{ "--offset": "10px", "--delay": `${delay}ms` } as React.CSSProperties}
      >
        {/* The thumbnail: the task's figure on sheet paper */}
        <div className="grid aspect-square h-full place-items-center rounded-lg border border-smoke bg-canvas-muted text-graphite">
          <TaskFigure name={task.figure} className="size-[70%]" />
        </div>
        <div className="flex h-full min-w-0 flex-col justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <Mark className="size-3.5" />
            <span className="truncate text-body font-medium text-charcoal">{task.topic}</span>
          </div>
          <div className="flex divide-x divide-ash">
            <div className="flex flex-col pr-6">
              <span className="text-xs font-medium text-silver">Arkusz</span>
              <span className="text-body font-medium text-steel tabular-nums">{task.sheet}</span>
            </div>
            <div className="flex flex-col pl-6">
              <span className="text-xs font-medium text-silver">Punkty</span>
              <span className="text-body font-medium text-steel tabular-nums">{task.points}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainingHero() {
  return (
    <section
      aria-labelledby="training-heading"
      className="relative overflow-clip border-b border-ash bg-white px-4"
    >
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] pt-16 text-center">
        {/* The column's edges, fading in as they come down */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]"
        />

        {/* The grid: one field across the column and two wings beyond it,
            all 600px tall from the bottom edge, fading up and outwards */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black)]"
        >
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="hero-grid-left" className="bottom-0 right-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="hero-grid-right" className="bottom-0 left-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black)]">
          <GridPattern id="hero-grid" className="bottom-0 left-1/2 h-[600px] w-[var(--page-max-width)] -translate-x-1/2 text-ash/60" />
        </div>

        {/* The sweep: the reference's three stops at 15%, led here by the
            green that marks Trening everywhere else */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 h-full w-[150%] opacity-15">
            <div className="size-full bg-[linear-gradient(90deg,#22C55E,#5182FC,#9071F9)] [mask-image:linear-gradient(transparent_25%,black)]" />
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center">
            <span
              className="animate-slide-up-fade relative mx-auto flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ash bg-white px-3 py-1.5 text-xs font-medium leading-tight text-steel"
              style={{ "--offset": "10px" } as React.CSSProperties}
            >
              <AccentTile icon={PencilLine} accent="green" size="xs" />
              Trening zadań
            </span>
            <h1
              id="training-heading"
              className="animate-slide-up-fade mt-6 text-center font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
              style={{ "--offset": "20px", "--delay": "100ms" } as React.CSSProperties}
            >
              Trenuj na zadaniach z arkuszy CKE
            </h1>
            <p
              className="animate-slide-up-fade mt-6 text-balance text-base text-steel sm:text-xl"
              style={{ "--offset": "10px", "--delay": "200ms" } as React.CSSProperties}
            >
              Zadania sprawdzane od razu według zasad oceniania — i dobierane
              do tego, gdzie tracisz punkty.
            </p>
          </div>
          <div
            className="animate-slide-up-fade relative mt-10 flex justify-center gap-2 sm:gap-4"
            style={{ "--offset": "5px", "--delay": "300ms" } as React.CSSProperties}
          >
            <Button href="/signup" variant="primary">
              Zacznij za darmo
            </Button>
            <Button href="#coverage" variant="outline">
              Przejrzyj bazę zadań
            </Button>
          </div>
        </div>

        {/* The wall: faded out below 40% of its height and to both sides
            beyond the middle half — cropped, never ended */}
        <div
          aria-label="Przykładowe zadania z arkuszy CKE"
          role="img"
          className="relative mt-20 h-[420px] [mask-composite:intersect] [mask-image:linear-gradient(black_40%,transparent),linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"
        >
          {/* inert: the cards are the picture; the label above is what assistive tech gets */}
          <div inert className="absolute bottom-[60px] left-[calc(50%+150px)] -translate-x-1/2 sm:left-1/2">
            <div className="grid grid-cols-[repeat(4,300px)] text-left">
              {TASKS.map((task, index) => (
                <TaskCard
                  key={task.topic}
                  task={task}
                  delay={COLUMN_DELAYS[index % 4] + Math.floor(index / 4) * 4}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
