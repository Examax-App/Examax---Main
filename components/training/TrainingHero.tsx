import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { CornerMarks, RULE_EDGE } from "@/components/ui/CornerMarks";
import { cn } from "@/lib/cn";

/**
 * The hero wash.
 *
 * The reference paints its partners hero with a flat left-to-right pastel
 * sweep that stops dead at the content column's edges — indigo through violet
 * to pink, each roughly a 10% tint over white (sampled off
 * `DesignRules/ExporttoFigma _ dub.co _ Dub Partners …png`). This is the same
 * sweep in Examax's own accents, led by the green that carries Trening
 * everywhere else in the product.
 *
 * DESIGN.md reserves chromatic fills for highlights rather than surfaces; a
 * ~10% tint is the same liberty the closing CTA band already documents, and it
 * is exactly what the reference does on this one band.
 */
const HERO_WASH = [
  "linear-gradient(to right",
  "color-mix(in oklab, var(--color-vivid-green) 12%, #ffffff) 0%",
  "color-mix(in oklab, var(--color-electric-blue) 9%, #ffffff) 52%",
  "color-mix(in oklab, var(--color-lavender) 12%, #ffffff) 100%)",
].join(", ");

/**
 * The rule field's falloff.
 *
 * `.bg-hero-grid` ships with a radial mask centred at 45% of its height, which
 * is right for the landing hero's single block of copy and wrong here: this
 * band is copy *plus* a 420px wall, so that ellipse dies out over exactly the
 * part the grid is there to hold. The pattern is reused; only the falloff is
 * replaced, so the lines run the full height and let go only at the far edges.
 */
const GRID_MASK_Y =
  "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)";
const GRID_MASK_X =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

const ACCENT_STROKE: Record<Accent, string> = {
  blue: "var(--color-electric-blue)",
  green: "var(--color-vivid-green)",
  lavender: "var(--color-lavender)",
  sapphire: "var(--color-deep-sapphire)",
  tangerine: "var(--color-tangerine)",
  yellow: "#eab308",
};

type TopicState = "mastered" | "review" | "new";

const stateStyles: Record<TopicState, { label: string; className: string }> = {
  mastered: { label: "Opanowane", className: "bg-soft-mint text-[#166534]" },
  review: { label: "Do powtórki", className: "bg-soft-peach text-[#7c2d12]" },
  new: { label: "Nowe", className: "bg-soft-blue text-electric-blue" },
};

/* ---------------------------------------------------------------------------
 * PLACEHOLDER DATA — topic counts, accuracies and states are illustrative.
 *
 * Twenty topics in four columns rather than one flat grid of twelve. A grid of
 * identical cards at identical weight has no focal point and reads as a
 * placeholder; a wall that drifts, fades out at all four edges and dims its
 * outer columns has a centre, and the centre is what the eye lands on.
 * ------------------------------------------------------------------------- */
type Topic = {
  topic: string;
  subject: string;
  accent: Accent;
  tasks: number;
  accuracy: number;
  state?: TopicState;
};

const columns: Topic[][] = [
  [
    { topic: "Procenty", subject: "Matematyka", accent: "green", tasks: 128, accuracy: 84, state: "mastered" },
    { topic: "Rozprawka", subject: "Polski", accent: "blue", tasks: 38, accuracy: 66 },
    { topic: "Czasy przeszłe", subject: "Angielski", accent: "lavender", tasks: 118, accuracy: 91, state: "mastered" },
    { topic: "Bryły obrotowe", subject: "Matematyka", accent: "green", tasks: 72, accuracy: 54, state: "review" },
    { topic: "Słowotwórstwo", subject: "Polski", accent: "blue", tasks: 53, accuracy: 74 },
  ],
  [
    { topic: "Geometria płaska", subject: "Matematyka", accent: "green", tasks: 141, accuracy: 63, state: "review" },
    { topic: "Środki językowe", subject: "Angielski", accent: "lavender", tasks: 152, accuracy: 79 },
    { topic: "Lektury", subject: "Polski", accent: "blue", tasks: 74, accuracy: 88, state: "mastered" },
    { topic: "Funkcje", subject: "Matematyka", accent: "green", tasks: 87, accuracy: 58 },
    { topic: "Mowa zależna", subject: "Angielski", accent: "lavender", tasks: 64, accuracy: 70, state: "new" },
  ],
  [
    { topic: "Równania", subject: "Matematyka", accent: "green", tasks: 96, accuracy: 71 },
    { topic: "Interpretacja", subject: "Polski", accent: "blue", tasks: 45, accuracy: 61, state: "review" },
    { topic: "Statystyka", subject: "Matematyka", accent: "green", tasks: 64, accuracy: 82 },
    { topic: "Rozumienie tekstu", subject: "Angielski", accent: "lavender", tasks: 96, accuracy: 86 },
    { topic: "Ciągi", subject: "Matematyka", accent: "green", tasks: 58, accuracy: 49, state: "new" },
  ],
  [
    { topic: "Trygonometria", subject: "Matematyka", accent: "green", tasks: 110, accuracy: 67 },
    { topic: "Środki stylistyczne", subject: "Polski", accent: "blue", tasks: 61, accuracy: 77 },
    { topic: "Czasowniki modalne", subject: "Angielski", accent: "lavender", tasks: 84, accuracy: 89, state: "mastered" },
    { topic: "Prawdopodobieństwo", subject: "Matematyka", accent: "green", tasks: 47, accuracy: 52, state: "review" },
    { topic: "Argumentacja", subject: "Polski", accent: "blue", tasks: 39, accuracy: 64 },
  ],
];

/**
 * The wall's edge falloff, one axis at a time.
 *
 * Held asymmetric on purpose: the top edge barely fades because the cards
 * there sit right under the CTAs and should read as solid, while the bottom
 * carries most of the falloff so the wall dissolves into the wash instead of
 * ending on a row of half-cards.
 */
const WALL_MASK_Y =
  "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)";
const WALL_MASK_X =
  "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Topic mastery as a ring.
 *
 * The reference puts a square product thumbnail in this slot. Examax has no
 * photography to put there (DESIGN.md), and a grey placeholder box is exactly
 * the failure mode `DesignRules/pending-changes.md` warns about — so the slot
 * carries the one number the card is actually about instead.
 */
function MasteryRing({ value, accent }: { value: number; accent: Accent }) {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center" aria-hidden>
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90">
        <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="#e5e5e5" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke={ACCENT_STROKE[accent]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(CIRCUMFERENCE * value) / 100} ${CIRCUMFERENCE}`}
        />
      </svg>
      <span className="font-geist-mono text-caption font-medium text-charcoal tabular-nums">
        {value}
      </span>
    </span>
  );
}

/**
 * One topic in the wall.
 *
 * Every step of type here is a token from the scale in `DESIGN.md` —
 * `body` for the topic, `caption` for the subject, the badge and both stat
 * cells — rather than the ad-hoc 9/10/11/13px ladder this card used to carry.
 * The reference's own cards do the same: a 14px name over 11px labels, which
 * is the page's type system running straight through the small boxes instead
 * of a second one invented for them.
 */
function TopicCard({ topic }: { topic: Topic }) {
  const state = topic.state ? stateStyles[topic.state] : null;
  return (
    <article className="flex items-center gap-3 rounded-cards border border-ash bg-white p-3 shadow-subtle">
      <MasteryRing value={topic.accuracy} accent={topic.accent} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 truncate text-body font-medium leading-tight text-charcoal">
            {topic.topic}
          </p>
          {state ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-caption font-medium leading-none",
                state.className,
              )}
            >
              {state.label}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-caption text-fog">{topic.subject}</p>
        <div className="mt-2 grid grid-cols-2 divide-x divide-ash border-t border-ash pt-2">
          <div className="pr-2">
            <p className="text-caption leading-none text-fog">Zadania</p>
            <p className="mt-1 font-geist-mono text-caption font-medium leading-none text-charcoal tabular-nums">
              {topic.tasks}
            </p>
          </div>
          <div className="pl-2">
            <p className="text-caption leading-none text-fog">Skuteczność</p>
            <p className="mt-1 font-geist-mono text-caption font-medium leading-none text-charcoal tabular-nums">
              {topic.accuracy}%
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * One drifting column of the wall.
 *
 * The stack is rendered twice and each card carries its own bottom padding
 * instead of a flex `gap`, which is what makes the -50% loop point exact — a
 * gap would leave it half a gap out and the loop would visibly jump.
 * `prefers-reduced-motion` stops the drift in globals.css; the wall then just
 * stands still, which is a fine second state.
 */
function TopicColumn({
  topics,
  motion,
  duration,
  className,
}: {
  topics: Topic[];
  motion: "up" | "down" | null;
  duration: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <ul
        className={cn(
          "flex flex-col",
          motion === "up" && "animate-marquee-up",
          motion === "down" && "animate-marquee-down",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[...topics, ...topics].map((topic, index) => (
          <li
            key={`${topic.topic}-${index}`}
            className="pb-3"
            // The second pass is the loop's tail, not more content.
            aria-hidden={index >= topics.length}
          >
            <TopicCard topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The /training hero.
 *
 * Above-the-fold, so the copy stack animates with the reference's pure-CSS
 * slide-up-fade staggered by `animation-delay` rather than through `<Reveal>`
 * and an IntersectionObserver — the same construction as the landing hero.
 */
export function TrainingHero() {
  return (
    <section
      aria-labelledby="training-heading"
      className="col-rules relative overflow-hidden bg-white"
    >
      {/* The wash stops at the column rules, as it does in the reference —
          the band around it stays paper white. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-full max-w-[var(--page-max-width)] -translate-x-1/2"
        style={{ backgroundImage: HERO_WASH }}
      />

      {/* The rule field, over the wash rather than under it — in the reference
          the grid stays visible straight through the tinted column and carries
          on into the white band beside it, which is what makes the whole hero
          read as one measured surface instead of a coloured panel sitting on
          paper. Same 60px squares as the landing hero. */}
      <div
        aria-hidden
        className="bg-hero-grid absolute inset-0"
        style={{
          maskImage: `${GRID_MASK_Y}, ${GRID_MASK_X}`,
          WebkitMaskImage: `${GRID_MASK_Y}, ${GRID_MASK_X}`,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Crop marks on the column rules. Led by green here, as the wash is —
          the landing band runs blue into violet. */}
      <CornerMarks offset={RULE_EDGE} tint="from-vivid-green/45 to-electric-blue/45" />

      <div className="relative mx-auto w-full max-w-[var(--page-max-width)] px-5 pb-16 pt-14 sm:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span
            style={{ "--offset": "10px" } as React.CSSProperties}
            className="animate-slide-up-fade inline-flex items-center gap-2 rounded-full border border-ash bg-white/80 py-1.5 pl-1.5 pr-3.5 text-[12px] font-medium text-charcoal shadow-subtle backdrop-blur-sm"
          >
            <AccentTile icon={PencilLine} accent="green" />
            Trening zadań
          </span>

          <h1
            id="training-heading"
            style={{ "--delay": "100ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty font-satoshi text-4xl font-medium leading-[1.15] text-charcoal sm:text-5xl"
          >
            Trenuj na zadaniach, które zobaczysz na egzaminie
          </h1>

          <p
            style={{ "--delay": "200ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty text-xl leading-7 text-steel"
          >
            Zadania z arkuszy CKE, quizy do każdego tematu i sprawdzanie z
            wyjaśnieniem — dobierane do tego, na czym stoisz.
          </p>

          <div
            style={{ "--delay": "300ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="/signup" variant="primary">
              Zacznij za darmo
            </Button>
            <Button href="#library" variant="outline">
              Przejrzyj bazę zadań
            </Button>
          </div>
        </div>

        {/* The wall. Fixed height and cropped at all four edges, so it reads as
            a surface continuing past the frame rather than a grid that ran
            out. Two of the four columns drift, in opposite directions.

            The crop marks are a sibling of the masked block, not a child, so
            they stay at full strength while the cards under them fade away —
            the corners stay measured even where the content dissolves. */}
        <div className="relative mt-14">
          <CornerMarks
            inset="-inset-4"
            tint="from-vivid-green/45 to-electric-blue/45"
          />
          <div
            aria-label="Tematy w bazie zadań, z opanowaniem i skutecznością"
            style={
              {
                "--delay": "420ms",
                "--offset": "24px",
                // Two linear fades intersected, rather than the shared
                // `.mask-fade-edges` ellipse: this box is wide and short, and a
                // single radial falls off far too slowly on the vertical axis —
                // the bottom row stayed near-opaque and read as a hard crop.
                maskImage: `${WALL_MASK_Y}, ${WALL_MASK_X}`,
                WebkitMaskImage: `${WALL_MASK_Y}, ${WALL_MASK_X}`,
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              } as React.CSSProperties
            }
            className="animate-slide-up-fade relative grid h-[360px] grid-cols-1 gap-3 overflow-hidden sm:h-[420px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <TopicColumn
              topics={columns[0]}
              motion={null}
              duration={0}
              className="opacity-60"
            />
            <TopicColumn
              topics={columns[1]}
              motion="down"
              duration={58}
              className="hidden sm:block"
            />
            <TopicColumn
              topics={columns[2]}
              motion="up"
              duration={68}
              className="hidden lg:block"
            />
            <TopicColumn
              topics={columns[3]}
              motion={null}
              duration={0}
              className="hidden opacity-60 xl:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
