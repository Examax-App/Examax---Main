import { Gauge, Route } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

type Chip = { label: string; active?: boolean; upcoming?: boolean };

/**
 * The filter rows double as the page's coverage statement.
 *
 * Coverage does not get a strip of its own — a short navigation bar between
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
    ],
  },
  {
    label: "Arkusz",
    chips: [
      { label: "maj 2024", active: true },
      { label: "maj 2023" },
      { label: "maj 2022" },
      { label: "2015–2021" },
    ],
  },
];

const losses = [
  { topic: "Stereometria", lost: 4, reason: "trzy zadania bez odpowiedzi" },
  { topic: "Procenty", lost: 2, reason: "błąd w drugim kroku" },
  { topic: "Statystyka", lost: 1, reason: "brak jednostki" },
];

const nextSteps = [
  { label: "Stereometria", meta: "3 tematy · poniedziałek" },
  { label: "Tempo · zadania otwarte", meta: "seria na czas · środa" },
  { label: "Procenty", meta: "powtórka · piątek" },
];

/**
 * The report, as the screen a student would actually read it on.
 *
 * Heading first, then the visual — the order every other section on the page
 * follows. The three columns are one report inside one panel rather than a
 * fourth feature trio, so the section carries one CTA at the bottom instead of
 * three that would all go to the same place.
 */
export function ReadinessReport() {
  return (
    <section
      id="report"
      aria-labelledby="report-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 text-[12px] font-semibold text-tangerine shadow-subtle">
              <Gauge className="size-3.5" strokeWidth={2} aria-hidden />
              Raport gotowości
            </p>
            <h2
              id="report-heading"
              className={cn("mx-auto mt-5 max-w-xl text-charcoal", SECTION_H2)}
            >
              Po ostatnim zadaniu wiesz dokładnie, gdzie stoisz
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Wynik, rozkład straconych punktów i plan na przyszły tydzień — w
              jednym miejscu.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            role="img"
            aria-label="Podgląd raportu gotowości: filtry arkusza nad wynikiem, straconymi punktami i planem na kolejny tydzień"
            className="mt-12 overflow-hidden rounded-largecards border border-ash bg-white shadow-ring"
          >
            <div className="flex items-center gap-2.5 border-b border-ash px-5 py-3.5">
              <Gauge className="size-4 shrink-0 text-silver" strokeWidth={1.8} aria-hidden />
              <span className="text-body text-charcoal">
                Arkusz próbny · Matematyka · maj 2024
              </span>
              <span className="ml-auto shrink-0 font-geist-mono text-[11px] text-fog tabular-nums">
                18 / 25 pkt · 1:38
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

            {/* gap-px over an ash surface: one hairline between every column,
                vertical on a row and horizontal once they stack. */}
            <div className="grid gap-px bg-ash sm:grid-cols-3">
              <div className="bg-white p-5">
                <p className="text-[13px] font-semibold text-charcoal">
                  Gotowość
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-geist-mono text-[34px] leading-none tracking-tight text-tangerine tabular-nums">
                    78
                  </span>
                  <span className="text-[11px] text-fog">/ 100</span>
                </div>
                <p className="mt-1.5 text-[10.5px] text-fog">
                  +4 względem poprzedniego arkusza
                </p>
                <dl className="mt-4 space-y-2">
                  {[
                    { label: "Punkty", value: "18 / 25" },
                    { label: "Czas", value: "1:38 / 1:40" },
                    { label: "Tempo", value: "1:54 / zadanie" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <dt className="text-[11.5px] text-fog">{row.label}</dt>
                      <dd className="font-geist-mono text-[11.5px] font-medium text-charcoal tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-white p-5">
                <p className="text-[13px] font-semibold text-charcoal">
                  Gdzie straciłeś punkty
                </p>
                <ul className="mt-3 space-y-2">
                  {losses.map((loss) => (
                    <li
                      key={loss.topic}
                      className="flex items-start gap-2.5 rounded-cards border border-ash px-3 py-2.5"
                    >
                      <span className="mt-0.5 shrink-0 rounded-full bg-[#fee2e2] px-1.5 py-0.5 font-geist-mono text-[9.5px] font-medium text-[#991b1b]">
                        −{loss.lost}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11.5px] font-medium text-charcoal">
                          {loss.topic}
                        </span>
                        <span className="block truncate text-[10.5px] text-fog">
                          {loss.reason}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-5">
                <p className="text-[13px] font-semibold text-charcoal">
                  Co dalej
                </p>
                <ul className="mt-3 space-y-2">
                  {nextSteps.map((step) => (
                    <li
                      key={step.label}
                      className="flex items-center gap-2.5 rounded-cards border border-ash px-3 py-2.5"
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-electric-blue bg-white">
                        <span className="size-1.5 rounded-full bg-electric-blue" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11.5px] font-medium text-charcoal">
                          {step.label}
                        </span>
                        <span className="block truncate text-[10.5px] text-fog">
                          {step.meta}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-fog">
                  <Route className="size-3 shrink-0" aria-hidden />
                  Wpisane prosto do roadmapy
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Button href="/signup" variant="primary" size="lg">
              Zapisz się na start symulacji
            </Button>
            <p className="mt-3 text-[13px] text-fog">
              Damy znać mailem, gdy tylko ruszą.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
