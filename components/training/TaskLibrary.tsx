import { BookMarked, Bookmark, Languages, Search, Sigma } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { SECTION_H2 } from "@/lib/type";

type Chip = { label: string; active?: boolean; upcoming?: boolean };

/**
 * The filter rows double as the page's coverage statement.
 *
 * Coverage used to be a 194px strip of its own between the hero and the first
 * feature section — a navigation bar cosplaying as a section, duplicating the
 * Egzaminy dropdown two centimetres above it and breaking the page's only
 * moment of momentum. It says the same thing here, in the one place where a
 * reader is actually asking it, and earns its space by being product.
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
    label: "Rok",
    chips: [
      { label: "2024", active: true },
      { label: "2023" },
      { label: "2022" },
      { label: "2021" },
      { label: "2015–2020" },
    ],
  },
  {
    label: "Typ",
    chips: [
      { label: "Zamknięte" },
      { label: "Otwarte", active: true },
      { label: "Z luką" },
    ],
  },
];

/* PLACEHOLDER TASKS — typical of the format rather than lifted from one
   arkusz. Rendered flat rather than staggered: the reference lifts a card to
   mark it as featured, and none of these is. */
const results: Array<{
  icon: IconComponent;
  accent: Accent;
  subject: string;
  prompt: string;
  sheet: string;
  points: string;
}> = [
  {
    icon: Sigma,
    accent: "green",
    subject: "Matematyka",
    prompt: "Oblicz pole trapezu o podstawach 8 cm i 5 cm oraz wysokości 4 cm.",
    sheet: "CKE 2024",
    points: "0–2 pkt",
  },
  {
    icon: BookMarked,
    accent: "blue",
    subject: "Język polski",
    prompt:
      "Wskaż środek stylistyczny w podanym fragmencie i określ jego funkcję.",
    sheet: "CKE 2023",
    points: "0–1 pkt",
  },
  {
    icon: Languages,
    accent: "lavender",
    subject: "Język angielski",
    prompt: "Complete the sentence with the correct form of the verb in brackets.",
    sheet: "CKE 2022",
    points: "0–1 pkt",
  },
];

/**
 * The bank, as the screen a student would actually use it through.
 *
 * Heading first, then the visual — the order every other section on the page
 * follows. The three cards are results inside the panel rather than a fourth
 * feature trio, so the section carries one CTA at the bottom instead of three
 * that would all go to the same place.
 */
export function TaskLibrary() {
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 text-[12px] font-semibold text-deep-sapphire shadow-subtle">
              <Search className="size-3.5" strokeWidth={2} aria-hidden />
              Cała baza zadań
            </p>
            <h2
              id="library-heading"
              className={cn("mx-auto mt-5 max-w-xl text-charcoal", SECTION_H2)}
            >
              Znajdź dokładnie to zadanie, którego szukasz
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Filtruj po egzaminie, przedmiocie, roku i typie zadania.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            role="img"
            aria-label="Podgląd bazy zadań: filtry egzaminu, przedmiotu, roku i typu zadania nad listą wyników"
            className="mt-12 overflow-hidden rounded-largecards border border-ash bg-white shadow-ring"
          >
            <div className="flex items-center gap-2.5 border-b border-ash px-5 py-3.5">
              <Search className="size-4 shrink-0 text-silver" strokeWidth={1.8} aria-hidden />
              <span className="text-body text-charcoal">procenty</span>
              <span className="ml-auto shrink-0 font-geist-mono text-[11px] text-fog tabular-nums">
                18 420 zadań
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

            {/* gap-px over an ash surface: one hairline between every result,
                vertical on a row and horizontal once they stack. */}
            <ul className="grid gap-px bg-ash sm:grid-cols-3">
              {results.map((result) => (
                <li key={result.subject} className="bg-white p-5">
                  <div className="flex items-center gap-2">
                    <AccentTile icon={result.icon} accent={result.accent} />
                    <p className="text-[11px] font-medium text-fog">
                      {result.subject}
                    </p>
                    <Bookmark className="ml-auto size-3.5 text-silver" aria-hidden />
                  </div>
                  <p className="mt-3 text-[13px] font-medium leading-snug text-charcoal">
                    {result.prompt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ash pt-3">
                    {[result.sheet, result.points].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-paper-mist px-2 py-0.5 font-geist-mono text-[10px] text-steel"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Button href="/signup" variant="primary" size="lg">
              Przeglądaj bazę zadań
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
