import Image from "next/image";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  CircleCheck,
  CircleDashed,
  CornerDownRight,
  GraduationCap,
  Languages,
  PencilLine,
  Sigma,
} from "lucide-react";
import { BotAvatar } from "bot-avatars";
import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

import learnerPhoto from "@/public/mockups/learner.jpg";

/**
 * Artwork for the navbar's Product panel. Each piece is a static picture of the
 * product at the scale of the reference's own card previews (dub.co's Product
 * menu, read off the live DOM — `DesignRules/Product menu _ Dub.png`): the
 * same boxes, type sizes and fade masks, carrying Examax's content instead of
 * links, partners and integrations. Card for card:
 *
 *   Trening zadań       ← Dub Partners    (the partner grid: one cell per question)
 *   Roadmapa nauki      ← Dub Links       (the link rows: one row per chapter)
 *   Śledzenie postępów  ← Dub Analytics   (the chart over a stats and profile card)
 *   Symulacja egzaminu  ← Dub Integrations (its slot: the exam launcher)
 *   Agenci Examax       ← Dub API & MCP   (its slot: one exchange, the agent thinking)
 *
 * Nothing here moves. All of it is `aria-hidden` decoration — the card's title
 * and description are what a screen reader gets.
 */

/** The reference's preview fade: solid for the top half, gone by the bottom. */
const FADE_DOWN = "[mask-image:linear-gradient(black_50%,transparent)]";

/* ------------------------------------------------------------------------ */
/* Trening zadań — the reference's partner grid, 1:1: 180x60 cells with a    */
/* 3px gutter in two columns running off the card's right edge. Where a      */
/* partner has a portrait, a question has its exam's official mark (Matura  */
/* or E8) on a plain white square; where a partner has a flag and a          */
/* name, a question has its subject and topic; revenue and payouts become    */
/* the sheet's year and the task number.                                    */
/* ------------------------------------------------------------------------ */

const SUBJECT = { math: Sigma, polish: BookMarked, english: Languages } as const;

const QUESTIONS: Array<{ exam: "matura" | "e8"; subject: keyof typeof SUBJECT; topic: string; sheet: string; task: string }> = [
  { exam: "matura", subject: "math", topic: "Procenty", sheet: "2024", task: "7" },
  { exam: "e8", subject: "english", topic: "Past Simple", sheet: "2023", task: "3" },
  { exam: "e8", subject: "polish", topic: "Lektury", sheet: "2024", task: "12" },
  { exam: "matura", subject: "math", topic: "Funkcje", sheet: "2022", task: "15" },
  { exam: "matura", subject: "polish", topic: "Rozprawka", sheet: "2023", task: "21" },
  { exam: "e8", subject: "math", topic: "Geometria", sheet: "2024", task: "18" },
];

export function TrainingPreview() {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute left-0 top-0 size-full overflow-hidden pl-2", FADE_DOWN)}>
      <div className="grid grid-cols-[repeat(2,180px)]">
        {QUESTIONS.map((question) => {
          const Subject = SUBJECT[question.subject];
          return (
            <div key={question.topic} className="h-[60px] w-[180px] p-[3px]">
              <div className="flex size-full select-none overflow-hidden rounded border border-paper-mist bg-white">
                <div className="grid aspect-square h-full place-items-center bg-white">
                  {question.exam === "matura" ? <MaturaIcon className="h-[20px] w-[28px]" /> : <E8Icon className="h-[18px] w-[26px]" />}
                </div>
                <div className="flex h-full flex-col justify-between border-l border-paper-mist px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Subject className="size-2.5 shrink-0 text-charcoal" strokeWidth={2.25} />
                    <span className="text-[9px] font-medium text-slate">{question.topic}</span>
                  </div>
                  <div className="flex divide-x divide-paper-mist">
                    <div className="flex flex-col pr-4">
                      <span className="text-[6px] font-medium text-silver">Arkusz</span>
                      <span className="text-[9px] font-medium text-slate">{question.sheet}</span>
                    </div>
                    <div className="flex flex-col pl-4">
                      <span className="text-[6px] font-medium text-silver">Zadanie</span>
                      <span className="text-[9px] font-medium text-slate">{question.task}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Roadmapa nauki — the reference's link rows: 52px boxes, 8px apart, the     */
/* same row repeated. A chapter per row: its status in the circle, lesson and */
/* quiz marks by the title, the state under it, lessons done in the badge.    */
/* ------------------------------------------------------------------------ */

const CHAPTERS: Array<{ title: string; state: string; status: IconComponent; badge: string; done: boolean }> = [
  { title: "Liczby rzeczywiste", state: "Rozdział ukończony", status: Check, badge: "8/8 lekcji", done: true },
  { title: "Potęgi i pierwiastki", state: "Rozdział ukończony", status: Check, badge: "6/6 lekcji", done: true },
  { title: "Równania", state: "W trakcie", status: CircleDashed, badge: "3/7 lekcji", done: false },
];

export function RoadmapPreview() {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden px-2", FADE_DOWN)}>
      <div className="flex flex-col gap-2 p-1">
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.title}
            className="flex h-[52px] items-center gap-2 rounded-[9px] border-[0.75px] border-ash bg-white pl-[13px] pr-3"
          >
            <span className="grid size-[26px] shrink-0 place-items-center rounded-full border-[0.75px] border-ash bg-gradient-to-b from-transparent to-black/5 text-charcoal">
              <chapter.status className="size-3" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1 pl-0.5">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[10px] font-semibold text-charcoal">{chapter.title}</span>
                <BookOpen className="size-2.5 shrink-0 text-charcoal" strokeWidth={2} />
                <PencilLine className="size-2.5 shrink-0 text-silver" strokeWidth={2} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-fog">
                <CornerDownRight className="size-2.5 shrink-0 text-silver" strokeWidth={2} />
                <span className="truncate">{chapter.state}</span>
              </div>
            </div>
            <span className="flex h-5 shrink-0 items-center gap-1 rounded-md border-[0.75px] border-ash bg-white px-1.5 text-[8.8px] font-medium tabular-nums text-slate">
              {chapter.done ? (
                <CircleCheck className="size-2.5 text-slate" strokeWidth={2} />
              ) : (
                <CircleDashed className="size-2.5 text-slate" strokeWidth={2} />
              )}
              {chapter.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Śledzenie postępów — the reference's analytics art: a rising line that    */
/* runs up beside the copy, over a stats card and a profile card.            */
/* ------------------------------------------------------------------------ */

/** The reference's own chart line, in its 339x168 viewBox. */
const CHART_PATH =
  "m345 1-60.533 76.487a8 8 0 0 1-9.732 2.25l-25.53-12.241a8 8 0 0 0-9.214 1.657l-62.736 64.993a8 8 0 0 1-6.695 2.388L67.303 124.331a8 8 0 0 0-5.193 1.17L-3.166 166.5";

const METRICS = [
  { label: "Zadania", value: "3 214", color: "#3b82f6" },
  { label: "Poprawne", value: "2 705", color: "#a855f7" },
  { label: "Opanowane", value: "38", color: "#14b8a6" },
];

const PROFILE_ROWS = [
  { label: "Arkusz próbny", value: "82%" },
  { label: "Gotowość", value: "76%" },
  { label: "Seria nauki", value: "34 dni" },
];

export function ProgressPreview({ color }: { color: string }) {
  return (
    // 170% tall and bottom-anchored, as in the reference, so the line climbs
    // past the top of the preview slot and up beside the description.
    <div aria-hidden className={cn("pointer-events-none absolute bottom-0 left-0 h-[170%] w-full overflow-hidden", FADE_DOWN)}>
      <div className="absolute bottom-0 left-0 size-full">
        <svg
          viewBox="0 0 339 168"
          fill="none"
          className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          <path stroke={color} strokeWidth={2} d={CHART_PATH} />
          <circle cx={259.333} cy={72} r={3} fill={color} />
          <circle cx={259.333} cy={72} r={4} stroke={color} strokeOpacity={0.3} strokeWidth={2} />
        </svg>

        <div className="absolute bottom-0 left-5 flex items-start gap-2">
          <div className="w-[172px] rounded-lg border border-ash bg-white">
            <div className="p-1.5">
              <div className="flex items-center gap-2 rounded border border-ash bg-canvas-muted p-2 text-xs font-medium leading-none text-charcoal">
                <Sigma className="size-3" strokeWidth={2} />
                Matematyka
              </div>
              <div className="mt-2 px-1.5 pb-0.5 text-[13px] font-medium text-charcoal">Marzec 2027</div>
            </div>
            <div className="flex flex-col gap-2 border-t border-ash p-3">
              {METRICS.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                      style={{ color: metric.color }}
                    />
                    <span className="text-xs font-medium leading-none text-steel">{metric.label}</span>
                  </div>
                  <span className="text-xs leading-none text-charcoal">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 whitespace-nowrap rounded-lg border border-ash bg-white py-0.5">
              <div className="px-3 py-2.5">
                <div className="flex justify-between gap-2">
                  {/* The reference's portrait: a 44px circle on the placeholder grey. */}
                  <span className="relative size-11 overflow-hidden rounded-full bg-paper-mist">
                    <Image src={learnerPhoto} alt="" fill sizes="44px" className="object-cover object-[center_30%]" />
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-charcoal">
                      <GraduationCap className="size-3.5" strokeWidth={1.8} />
                      Matura
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-charcoal">
                      {/* Polish flag, drawn: white over red. */}
                      <span className="flex h-2.5 w-3 flex-col overflow-hidden rounded-sm border-[0.5px] border-black/15">
                        <span className="flex-1 bg-white" />
                        <span className="flex-1 bg-[#dc143c]" />
                      </span>
                      PL
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-[13px] font-medium text-charcoal">Zuzanna Nowakowska</div>
                <div className="mt-px text-xs text-fog">zuzanna@examax.app</div>
              </div>
              <div className="flex flex-col gap-2.5 border-t border-ash px-3 pb-2.5 pt-3">
                {PROFILE_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-6 text-xs leading-none">
                    <span className="truncate font-medium text-fog">{row.label}</span>
                    <span className="text-charcoal">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The wide cards' art stands whole, 20px in from the card's right edge (the */
/* copy's own inset), and lifts off the card on a soft grey glint: a faint   */
/* radial shadow behind it, and a two-layer drop shadow on its surfaces.    */
/* ------------------------------------------------------------------------ */

/** The soft two-layer drop shadow the wide cards' surfaces sit on. */
const LIFT = "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_20px_-6px_rgba(0,0,0,0.16)]";

/** A deeper lift for the launcher panel: the same two layers, spread further. */
const LIFT_DEEP = "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_32px_-8px_rgba(0,0,0,0.22)]";

/** The grey glint behind a wide card's art: a radial shadow, gone by its edges. */
function Glint({ strength = 0.06 }: { strength?: number }) {
  return (
    <span
      className="absolute -inset-x-8 -inset-y-6"
      style={{ backgroundImage: `radial-gradient(closest-side, rgba(0,0,0,${strength}), transparent)` }}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Symulacja egzaminu — in the reference's integrations slot, a picture of   */
/* the simulation's launcher: one quiet row (the CKE mark, then three        */
/* figures) over the button that starts the exam, all in the page's greys   */
/* and black.                                                               */
/* ------------------------------------------------------------------------ */

const EXAM_STATS = [
  { label: "Arkusze", value: "12" },
  { label: "Średni wynik", value: "78%" },
  { label: "Ostatnio", value: "14 wrz" },
];

export function SimulationPreview() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-5 top-1/2 w-[200px] -translate-y-1/2">
        <Glint strength={0.1} />
        <div className={cn("relative rounded-lg border border-black/[0.06] bg-white p-2.5", LIFT_DEEP)}>
          <div className="flex items-center gap-3 px-0.5">
            <CkeIcon className="h-[20px] w-[15px]" />
            {EXAM_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col gap-1">
                <span className="whitespace-nowrap text-[6px] font-medium leading-none text-fog">{stat.label}</span>
                <span className="whitespace-nowrap text-[9px] font-medium leading-none tabular-nums text-charcoal">{stat.value}</span>
              </div>
            ))}
          </div>
          <span className="mt-2.5 flex h-4 items-center justify-center gap-1 rounded-[5px] bg-charcoal text-[6.5px] font-medium leading-none text-white">
            Rozpocznij egzamin
            <ArrowRight className="size-[6px]" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Agenci Examax — in the reference's API slot, one exchange with no window  */
/* around it, drawn for its shape rather than its words: a question sent as */
/* a short message, and the agent's face beside its thinking line —        */
/* TextShimmer's gradient held still mid-sweep.                             */
/* ------------------------------------------------------------------------ */

export function AgentChatPreview() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-5 top-1/2 w-[180px] -translate-y-1/2">
        <Glint strength={0.1} />
        <div className="relative flex flex-col gap-2.5">
          <span className={cn("self-end rounded-[10px] bg-charcoal px-2.5 py-1.5 text-[9px] leading-[11px] text-white", LIFT)}>
            Pomożesz mi z tym zadaniem?
          </span>
          <span className="flex items-center gap-2">
            <span className="relative z-[1] grid size-6 shrink-0 place-items-center">
              <BotAvatar type="circle" size={24} paused interactive={false} turn={0} />
            </span>
            <span
              className="bg-clip-text text-[10.5px] leading-none text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, var(--color-fog) 35%, var(--color-charcoal) 50%, var(--color-fog) 65%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "70% 0",
              }}
            >
              Czytam zadanie…
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
