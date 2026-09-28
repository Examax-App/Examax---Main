import { Check, ChevronRight, Lock, Map } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

type Chip = { label: string; active?: boolean; upcoming?: boolean };

/**
 * The filter rows double as the page's coverage statement.
 *
 * Coverage does not get a strip of its own — a 194px navigation bar between
 * the hero and the first feature section duplicates the Egzaminy dropdown two
 * centimetres above it and breaks the page's only moment of momentum. It says
 * the same thing here, where a reader is actually asking it, and earns its
 * space by being product.
 */
const filters: Array<{ label: string; chips: Chip[] }> = [
  {
    label: "Egzamin",
    chips: [
      { label: "Ósmoklasisty", active: true },
      { label: "Matura podstawowa" },
      { label: "Matura rozszerzona" },
    ],
  },
  {
    label: "Przedmiot",
    chips: [
      { label: "Matematyka", active: true },
      { label: "Język polski" },
      { label: "Język angielski" },
      { label: "Fizyka", upcoming: true },
      { label: "Chemia", upcoming: true },
      { label: "Biologia", upcoming: true },
    ],
  },
  {
    label: "Widok",
    chips: [
      { label: "Etapy", active: true },
      { label: "Lista tematów" },
      { label: "Kalendarz" },
    ],
  },
];

type TopicState = "done" | "active" | "next" | "locked";

/* PLACEHOLDER ROADMAP — the real one is generated per student from the
   requirements and the exam date. */
const stages: Array<{
  label: string;
  months: string;
  percent: number;
  topics: Array<{ label: string; state: TopicState; meta: string }>;
}> = [
  {
    label: "Etap 1",
    months: "wrzesień – listopad",
    percent: 100,
    topics: [
      { label: "Liczby i działania", state: "done", meta: "12 tematów" },
      { label: "Ułamki i proporcje", state: "done", meta: "9 tematów" },
      { label: "Potęgi i pierwiastki", state: "done", meta: "7 tematów" },
      { label: "Wyrażenia arytmetyczne", state: "done", meta: "5 tematów" },
    ],
  },
  {
    label: "Etap 2",
    months: "grudzień – luty",
    percent: 64,
    topics: [
      { label: "Procenty", state: "active", meta: "78% opanowania" },
      { label: "Wyrażenia algebraiczne", state: "next", meta: "następny krok" },
      { label: "Równania", state: "locked", meta: "po wyrażeniach" },
      { label: "Układy równań", state: "locked", meta: "po równaniach" },
    ],
  },
  {
    label: "Etap 3",
    months: "marzec – maj",
    percent: 0,
    topics: [
      { label: "Geometria płaska", state: "locked", meta: "marzec" },
      { label: "Bryły", state: "locked", meta: "marzec" },
      { label: "Statystyka", state: "locked", meta: "kwiecień" },
      { label: "Powtórka arkuszowa", state: "locked", meta: "maj" },
    ],
  },
];

function TopicMark({ state }: { state: TopicState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border-2",
        state === "done" && "border-vivid-green bg-vivid-green text-white",
        state === "active" && "border-electric-blue bg-white text-electric-blue",
        state === "next" && "border-smoke bg-white text-fog",
        state === "locked" && "border-dashed border-smoke bg-white text-silver",
      )}
    >
      {state === "done" ? (
        <Check className="size-2.5" strokeWidth={3} />
      ) : state === "active" ? (
        <span className="size-1.5 rounded-full bg-electric-blue" />
      ) : state === "locked" ? (
        <Lock className="size-2.5" />
      ) : (
        <ChevronRight className="size-2.5" />
      )}
    </span>
  );
}

/**
 * The roadmap, as the screen a student would actually use it through.
 *
 * Heading first, then the visual — the order every other section on the page
 * follows. The three stages are columns inside one panel rather than a fourth
 * feature trio, so the section carries one CTA at the bottom instead of three
 * that would all go to the same place.
 */
export function SubjectMap() {
  return (
    <section
      id="map"
      aria-labelledby="map-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 text-[12px] font-semibold text-deep-sapphire shadow-subtle">
              <Map className="size-3.5" strokeWidth={2} aria-hidden />
              Cała roadmapa
            </p>
            <h2
              id="map-heading"
              className={cn("mx-auto mt-5 max-w-xl text-charcoal", SECTION_H2)}
            >
              Zobacz całą drogę, nie tylko następny krok
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Filtruj po egzaminie i przedmiocie, przełączaj między etapami,
              listą i kalendarzem.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            role="img"
            aria-label="Podgląd roadmapy: filtry egzaminu, przedmiotu i widoku nad trzema etapami nauki"
            className="mt-12 overflow-hidden rounded-largecards border border-ash bg-white shadow-ring"
          >
            <div className="flex items-center gap-2.5 border-b border-ash px-5 py-3.5">
              <Map className="size-4 shrink-0 text-silver" strokeWidth={1.8} aria-hidden />
              <span className="text-body text-charcoal">
                Matematyka · Egzamin ósmoklasisty
              </span>
              <span className="ml-auto shrink-0 font-geist-mono text-[11px] text-fog tabular-nums">
                63 tematy · 38 tygodni
              </span>
            </div>

            <div className="space-y-3 border-b border-ash bg-canvas-muted px-5 py-5">
              {filters.map((group) => (
                <div key={group.label} className="flex flex-wrap items-center gap-2">
                  <p className="w-full shrink-0 font-geist-mono text-[10px] uppercase tracking-[0.1em] text-silver sm:w-20">
                    {group.label}
                  </p>
                  {group.chips.map((chip) => (
                    <span
                      key={chip.label}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[12px] font-medium",
                        chip.active
                          ? "border-charcoal bg-charcoal text-white"
                          : chip.upcoming
                            ? "border-dashed border-smoke bg-white text-silver"
                            : "border-ash bg-white text-steel",
                      )}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* gap-px over an ash surface: one hairline between every stage,
                vertical on a row and horizontal once they stack. */}
            <ul className="grid gap-px bg-ash sm:grid-cols-3">
              {stages.map((stage) => (
                <li key={stage.label} className="bg-white p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[13px] font-semibold text-charcoal">
                      {stage.label}
                    </p>
                    <p className="font-geist-mono text-[10px] text-fog tabular-nums">
                      {stage.percent}%
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-fog">{stage.months}</p>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-paper-mist">
                    <span
                      className={cn(
                        "block h-full rounded-full",
                        stage.percent === 100
                          ? "bg-vivid-green"
                          : "bg-electric-blue",
                      )}
                      style={{ width: `${stage.percent}%` }}
                    />
                  </div>

                  <ol className="mt-4 space-y-2">
                    {stage.topics.map((topic) => (
                      <li
                        key={topic.label}
                        className={cn(
                          "flex items-center gap-2.5",
                          topic.state === "locked" && "opacity-70",
                        )}
                      >
                        <TopicMark state={topic.state} />
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-medium text-charcoal">
                            {topic.label}
                          </span>
                          <span className="block truncate text-[10.5px] text-fog">
                            {topic.meta}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Button href="/signup" variant="primary" size="lg">
              Otwórz swoją roadmapę
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
