import Link from "@/components/ui/Link";
import { CalendarDays, FileText, Layers, ListFilter, Percent, PencilLine, RefreshCcw, Shapes, TrendingUp, X, Zap } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { accentStyles } from "@/components/ui/FeaturePill";
import { SubjectMark } from "@/components/progress/SubjectMark";
import type { SubjectKey } from "@/components/progress/events";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The pair under the /progress event stream — dub.co/analytics' (live DOM,
 * 2026-10-01):
 *
 *   Detailed filters    → FilterMarquee: three rows of filter pills drifting
 *                         sideways, every other row the other way, 30s a lap
 *   Customer quote cell → TutorNote: the same tinted panel, holding what
 *                         Korepetytor AI makes of the week's results instead
 *                         of a customer's words (Examax has no testimonials
 *                         yet, and invents none)
 *
 * PLACEHOLDER DATA — the filters' values and the note are illustrative.
 */

type Value = { label: string; icon?: IconComponent; subject?: SubjectKey; exam?: boolean };
export type Filter = { field: string; icon: IconComponent; value: Value };

const ROWS: Filter[][] = [
  [
    { field: "Przedmiot", icon: Shapes, value: { label: "Matematyka", subject: "math" } },
    { field: "Dział", icon: Layers, value: { label: "Funkcje", icon: TrendingUp } },
    { field: "Źródło", icon: FileText, value: { label: "Arkusz CKE", exam: true } },
    { field: "Wynik", icon: Percent, value: { label: "poniżej 50%", icon: Percent } },
  ],
  [
    { field: "Typ zadania", icon: ListFilter, value: { label: "Otwarte", icon: PencilLine } },
    { field: "Okres", icon: CalendarDays, value: { label: "Ostatnie 30 dni", icon: CalendarDays } },
    { field: "Przedmiot", icon: Shapes, value: { label: "Język polski", subject: "polish" } },
    { field: "Poziom", icon: TrendingUp, value: { label: "Rozszerzony", icon: TrendingUp } },
  ],
  [
    { field: "Status", icon: RefreshCcw, value: { label: "Do powtórki", icon: RefreshCcw } },
    { field: "Przedmiot", icon: Shapes, value: { label: "Język angielski", subject: "english" } },
    { field: "Arkusz", icon: FileText, value: { label: "Matura 2024", exam: true } },
    { field: "Pomoc AI", icon: Zap, value: { label: "Bez podpowiedzi", icon: Zap } },
  ],
];

/** The reference's filter pill: field, the verb, the value and a close cross, ruled apart. */
function FilterPill({ filter }: { filter: Filter }) {
  const { value } = filter;
  return (
    <div className="flex h-9 shrink-0 divide-x divide-ash rounded-lg border border-ash bg-white text-sm leading-none text-charcoal [&>*]:h-full">
      <div className="flex items-center gap-2 px-2">
        <filter.icon className="size-4 shrink-0 text-fog" strokeWidth={1.75} />
        {filter.field}
      </div>
      <div className="flex items-center px-2 text-fog">to</div>
      <div className="flex items-center gap-2 px-2">
        {value.subject ? (
          <SubjectMark subject={value.subject} />
        ) : value.exam ? (
          <MaturaIcon className="h-3 w-4" />
        ) : value.icon ? (
          <value.icon className="size-4 shrink-0 text-fog" strokeWidth={1.75} />
        ) : null}
        {value.label}
      </div>
      <div className="flex items-center px-2 text-silver">
        <X className="size-3.5" strokeWidth={2} />
      </div>
    </div>
  );
}

/** Three drifting rows of filters; /progress shows its own, other pages pass theirs. */
export function FilterMarquee({ rows = ROWS }: { rows?: Filter[][] } = {}) {
  return (
    <div
      aria-hidden
      className="flex h-full cursor-default select-none flex-col justify-center gap-4 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent),linear-gradient(black_60%,transparent)]"
    >
      {rows.map((row, index) => (
        <div key={index} className="flex">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className={cn(
                "flex min-w-max items-center gap-4 pl-4 [--scroll:-100%] [--scroll-duration:30s] motion-safe:animate-infinite-scroll",
                index % 2 === 1 && "[animation-direction:reverse]",
              )}
            >
              {row.map((filter) => (
                <FilterPill key={`${filter.field}-${filter.value.label}`} filter={filter} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * The reference's quote cell, one to one in build: a softly tinted panel, a
 * wordmark at the top, a paragraph with its lead in bold and one dotted link,
 * and the speaker at the foot. Here the speaker is Korepetytor AI, in its
 * yellow chip, and the paragraph is what it recommends after the week.
 */
export function TutorNote() {
  return (
    <div className="relative flex h-full flex-col justify-between gap-12 overflow-hidden bg-white px-4 py-10 sm:px-10 sm:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,#fef9c3,transparent_60%)] opacity-70" />
      <div className="relative">
        <span className="flex items-center gap-2.5">
          <span className={cn("grid size-7 place-items-center rounded-lg border border-black/5", accentStyles.yellow.chip)}>
            <Zap className="size-4" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="font-satoshi text-xl font-bold tracking-tight text-charcoal">Korepetytor AI</span>
        </span>
        <blockquote className="mt-10 text-pretty text-base text-steel sm:text-[17px] sm:leading-7">
          <strong className="font-semibold text-charcoal">Funkcja kwadratowa idzie Ci coraz lepiej</strong> — 9 z 10 punktów w ostatnim quizie. W
          trygonometrii trzy z czterech ostatnich błędów to{" "}
          <Link
            href="/training"
            className="font-medium text-slate underline decoration-dotted underline-offset-2 transition-colors hover:text-charcoal"
          >
            wzory redukcyjne
          </Link>
          , więc dziś proponuję 15 minut powtórki i dwa zadania z arkusza 2024.
        </blockquote>
      </div>
      <div className="relative flex items-center gap-3">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl border border-black/5", accentStyles.yellow.chip)}>
          <Zap className="size-6" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-charcoal">Rekomendacja na ten tydzień</span>
          <span className="text-sm text-fog">Na podstawie 48 zadań z ostatnich 7 dni</span>
        </div>
      </div>
    </div>
  );
}
