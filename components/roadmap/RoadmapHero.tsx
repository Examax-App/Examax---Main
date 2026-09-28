import { Check, ChevronRight, Lock, Route } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";

/**
 * The hero wash.
 *
 * Same construction as /training's — a flat left-to-right pastel sweep at
 * ~10%, stopping dead at the content column's edges, the way the reference
 * paints its own product hero. Led by the blue that carries Roadmapa
 * everywhere else in the product, where Trening is led by green, so the two
 * product pages are recognisably siblings and not the same page twice.
 */
const HERO_WASH = [
  "linear-gradient(to right",
  "color-mix(in oklab, var(--color-deep-sapphire) 10%, #ffffff) 0%",
  "color-mix(in oklab, var(--color-electric-blue) 12%, #ffffff) 46%",
  "color-mix(in oklab, var(--color-lavender) 12%, #ffffff) 100%)",
].join(", ");

/**
 * The wall's edge falloff.
 *
 * Asymmetric on purpose, and differently from /training's: the left edge and
 * the top stay solid because the lane labels live there, and the falloff runs
 * right and down — so the paths read as continuing toward the exam rather than
 * as a grid that ran out of cards.
 */
const WALL_MASK_X =
  "linear-gradient(to right, black 0%, black 58%, transparent 100%)";
const WALL_MASK_Y =
  "linear-gradient(to bottom, black 0%, black 66%, transparent 100%)";

type NodeState = "done" | "active" | "next" | "locked";

type Node = { label: string; meta: string; state: NodeState };

/* ---------------------------------------------------------------------------
 * PLACEHOLDER DATA — topic order and percentages are illustrative.
 *
 * The node vocabulary is the product's own, lifted from the landing page's
 * roadmap showcase (components/mockups/RoadmapShowcase): green for a topic
 * that is finished, blue for the one in progress, a dashed edge for anything
 * still locked. One vocabulary, so a visitor who has seen the landing page
 * reads this without relearning it.
 * ------------------------------------------------------------------------- */
type Lane = { subject: string; level: string; duration: number; nodes: Node[] };

const lanes: Lane[] = [
  {
    subject: "Matematyka",
    level: "Ósmoklasista",
    duration: 72,
    nodes: [
      { label: "Liczby i działania", meta: "12 tematów", state: "done" },
      { label: "Ułamki i proporcje", meta: "9 tematów", state: "done" },
      { label: "Procenty", meta: "78% opanowania", state: "active" },
      { label: "Wyrażenia algebraiczne", meta: "następny krok", state: "next" },
      { label: "Równania", meta: "po wyrażeniach", state: "locked" },
      { label: "Geometria płaska", meta: "po równaniach", state: "locked" },
      { label: "Bryły", meta: "marzec", state: "locked" },
    ],
  },
  {
    subject: "Język polski",
    level: "Ósmoklasista",
    duration: 88,
    nodes: [
      { label: "Lektury obowiązkowe", meta: "14 tematów", state: "done" },
      { label: "Środki stylistyczne", meta: "88% opanowania", state: "active" },
      { label: "Interpretacja wiersza", meta: "następny krok", state: "next" },
      { label: "Rozprawka", meta: "po interpretacji", state: "locked" },
      { label: "Ortografia", meta: "luty", state: "locked" },
      { label: "Słowotwórstwo", meta: "luty", state: "locked" },
      { label: "Redagowanie tekstu", meta: "marzec", state: "locked" },
    ],
  },
  {
    subject: "Matematyka",
    level: "Matura rozszerzona",
    duration: 64,
    nodes: [
      { label: "Ciągi", meta: "8 tematów", state: "done" },
      { label: "Funkcje wykładnicze", meta: "6 tematów", state: "done" },
      { label: "Trygonometria", meta: "61% opanowania", state: "active" },
      { label: "Rachunek różniczkowy", meta: "następny krok", state: "next" },
      { label: "Całki", meta: "po pochodnych", state: "locked" },
      { label: "Geometria analityczna", meta: "marzec", state: "locked" },
      { label: "Stereometria", meta: "kwiecień", state: "locked" },
    ],
  },
  {
    subject: "Język angielski",
    level: "Matura podstawowa",
    duration: 96,
    nodes: [
      { label: "Czasy przeszłe", meta: "91% opanowania", state: "done" },
      { label: "Mowa zależna", meta: "7 tematów", state: "done" },
      { label: "Środki językowe", meta: "79% opanowania", state: "active" },
      { label: "Rozumienie ze słuchu", meta: "następny krok", state: "next" },
      { label: "Wypowiedź pisemna", meta: "po słuchaniu", state: "locked" },
      { label: "Leksyka tematyczna", meta: "marzec", state: "locked" },
      { label: "Zadania na dobieranie", meta: "kwiecień", state: "locked" },
    ],
  },
];

/**
 * The node's state mark.
 *
 * Every branch sets its own background rather than overriding a shared
 * `bg-white`: `cn()` is a plain join, so a base background and a state's would
 * land at equal specificity and the stylesheet's own order would decide the
 * winner — which is how the finished state first shipped as a white check on a
 * white disc.
 */
function StateMark({ state, meta }: { state: NodeState; meta: string }) {
  // The active node prints its own mastery figure, so it is pulled out of the
  // meta line rather than repeated under it.
  const percent = state === "active" ? meta.match(/^\d+%/)?.[0] : null;
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full border-2",
        state === "done" && "border-vivid-green bg-vivid-green text-white",
        state === "active" && "border-electric-blue bg-white text-electric-blue",
        state === "next" && "border-smoke bg-white text-fog",
        state === "locked" && "border-dashed border-smoke bg-white text-silver",
      )}
    >
      {state === "done" ? (
        <Check className="size-3.5" strokeWidth={3} />
      ) : state === "active" ? (
        <span className="font-geist-mono text-[9px] font-medium tabular-nums">
          {percent ?? "•"}
        </span>
      ) : state === "locked" ? (
        <Lock className="size-3" />
      ) : (
        <ChevronRight className="size-3.5" />
      )}
    </span>
  );
}

function NodeCard({ node }: { node: Node }) {
  return (
    <article
      className={cn(
        "flex w-[13.5rem] items-center gap-2.5 rounded-cards border bg-white px-3 py-2.5 shadow-subtle",
        node.state === "active" ? "border-electric-blue/40" : "border-ash",
        node.state === "locked" && "opacity-70",
      )}
    >
      <StateMark state={node.state} meta={node.meta} />
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-medium leading-tight text-charcoal">
          {node.label}
        </span>
        <span className="block truncate text-[10.5px] leading-tight text-fog">
          {node.meta}
        </span>
      </span>
    </article>
  );
}

/**
 * One drifting lane.
 *
 * The nodes are rendered twice and each carries its own right padding rather
 * than a flex `gap`, which is what makes the -50% loop point exact. The
 * hairline behind them runs the full width and is covered by every card, so it
 * only shows in the space between two nodes — which is where a connector
 * belongs.
 */
function TrackLane({ lane }: { lane: Lane }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0 sm:w-32">
        <p className="truncate text-[12px] font-semibold text-charcoal">
          {lane.subject}
        </p>
        <p className="truncate text-[10.5px] text-fog">{lane.level}</p>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-ash"
        />
        <ul
          className="animate-marquee-left relative flex w-max"
          style={{ "--marquee-duration": `${lane.duration}s` } as React.CSSProperties}
        >
          {[...lane.nodes, ...lane.nodes].map((node, index) => (
            <li
              key={`${node.label}-${index}`}
              className="pr-3"
              // The second pass is the loop's tail, not more content.
              aria-hidden={index >= lane.nodes.length}
            >
              <NodeCard node={node} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The /roadmap hero.
 *
 * Above the fold, so the copy stack animates with the reference's pure-CSS
 * slide-up-fade staggered by `animation-delay` rather than through `<Reveal>`
 * and an observer — the same construction as the landing and training heroes.
 */
export function RoadmapHero() {
  return (
    <section
      aria-labelledby="roadmap-heading"
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
            className="animate-slide-up-fade inline-flex items-center gap-2 rounded-full border border-ash bg-white/80 py-1.5 pl-1.5 pr-3.5 text-[12px] font-medium text-charcoal shadow-subtle backdrop-blur-sm"
          >
            <AccentTile icon={Route} accent="blue" />
            Roadmapa nauki
          </span>

          <h1
            id="roadmap-heading"
            style={{ "--delay": "100ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty font-satoshi text-4xl font-medium leading-[1.15] text-charcoal sm:text-5xl"
          >
            Cały egzamin rozpisany na kolejne kroki
          </h1>

          <p
            style={{ "--delay": "200ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-5 text-pretty text-xl leading-7 text-steel"
          >
            Wymagania CKE ułożone w kolejności, która ma sens. Widzisz, co masz
            opanowane i co robić dziś.
          </p>

          <div
            style={{ "--delay": "300ms", "--offset": "20px" } as React.CSSProperties}
            className="animate-slide-up-fade mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="/signup" variant="primary">
              Zacznij za darmo
            </Button>
            <Button href="#map" variant="outline">
              Zobacz roadmapę
            </Button>
          </div>
        </div>

        {/* Four lanes drifting at four speeds. Same mechanism as the training
            wall turned on its side, which is the axis a roadmap actually runs
            on — and the parallax is what stops four tracks reading as one
            block sliding. */}
        <div
          aria-label="Roadmapy przedmiotów: tematy opanowane, w trakcie i jeszcze zablokowane"
          style={
            {
              "--delay": "420ms",
              "--offset": "24px",
              maskImage: `${WALL_MASK_X}, ${WALL_MASK_Y}`,
              WebkitMaskImage: `${WALL_MASK_X}, ${WALL_MASK_Y}`,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            } as React.CSSProperties
          }
          className="animate-slide-up-fade relative mt-14 space-y-5 overflow-hidden"
        >
          {lanes.map((lane) => (
            <TrackLane key={`${lane.subject}-${lane.level}`} lane={lane} />
          ))}
        </div>
      </div>
    </section>
  );
}
