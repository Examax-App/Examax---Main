import { BookOpen, CalendarDays, GitBranch, RefreshCcw, Route } from "lucide-react";
import { SourceStory, type StorySteps } from "@/components/sections/SourceStory";
import { cn } from "@/lib/cn";

/**
 * The card's tint: two wide blooms in the accents this page runs on, pooled at
 * the corners of the near-black surface. Plain radial gradients, so the
 * falloff *is* the blur — no filter, no compositing layer. Sapphire rising
 * from the base and lavender at the top, where /training's card runs green,
 * so the two dark cards are siblings rather than duplicates.
 */
const CARD_TINT = [
  "radial-gradient(72% 92% at 8% 100%, color-mix(in oklab, var(--color-deep-sapphire) 36%, transparent) 0%, transparent 70%)",
  "radial-gradient(64% 86% at 96% 6%, color-mix(in oklab, var(--color-lavender) 30%, transparent) 0%, transparent 72%)",
].join(", ");

/** What the order is derived from, in the order it is derived. */
const steps: StorySteps = [
  {
    icon: BookOpen,
    title: "Wymagania",
    description:
      "Pełna lista wymagań CKE na dany egzamin i poziom — nie spis treści podręcznika.",
  },
  {
    icon: GitBranch,
    title: "Zależności",
    description:
      "Temat wchodzi dopiero wtedy, gdy masz już czym go zrozumieć.",
  },
  {
    icon: CalendarDays,
    title: "Kalendarz",
    description:
      "Plan liczony wstecz od dnia egzaminu, nie do przodu od września.",
  },
  {
    icon: RefreshCcw,
    title: "Twoje odpowiedzi",
    description:
      "Kolejność przelicza się z tego, co już Ci wychodzi, a co jeszcze nie.",
  },
];

const milestones = [
  { label: "Wrzesień", note: "start", state: "done" as const },
  { label: "Grudzień", note: "etap 1 zamknięty", state: "done" as const },
  { label: "Luty", note: "etap 2", state: "active" as const },
  { label: "Maj", note: "egzamin", state: "target" as const },
];

/**
 * A milestone track — the reference's hero image slot, filled with the shape
 * this product actually has. /training puts a stack of arkusz sheets here;
 * a roadmap's own object is a line with dates on it.
 */
function MilestoneTrack() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-10 top-1/2 hidden w-56 -translate-y-1/2 lg:block"
    >
      <ol className="relative space-y-6">
        <span className="absolute bottom-2 left-[9px] top-2 w-px bg-white/15" />
        {milestones.map((milestone) => (
          <li key={milestone.label} className="relative flex items-center gap-3">
            <span
              className={cn(
                "relative z-10 size-[19px] shrink-0 rounded-full border-2",
                milestone.state === "done" && "border-white/40 bg-white/25",
                milestone.state === "active" && "border-white bg-white/80",
                milestone.state === "target" &&
                  "border-dashed border-white/40 bg-transparent",
              )}
            />
            <span className="min-w-0">
              <span className="block text-[12px] font-medium text-white/85">
                {milestone.label}
              </span>
              <span className="block text-[10.5px] text-white/45">
                {milestone.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Where the order comes from. */
export function RoadmapStory() {
  return (
    <SourceStory
      id="sources"
      heading="Skąd bierze się kolejność tematów"
      sub="Roadmapa nie jest spisem treści — kolejność wynika z zależności i z daty egzaminu."
      eyebrowIcon={Route}
      eyebrow="Konstrukcja roadmapy"
      title="Każdy temat ma swoje miejsce w kolejności i swój termin przed egzaminem"
      linkLabel="Zobacz, jak układamy roadmapę"
      linkHref="/docs"
      tint={CARD_TINT}
      steps={steps}
    >
      <MilestoneTrack />
    </SourceStory>
  );
}
