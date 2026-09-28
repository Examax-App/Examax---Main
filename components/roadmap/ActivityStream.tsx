import { Activity, BookMarked, Languages, Sigma } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DataTable, TableRow } from "@/components/ui/Table";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { SECTION_H2 } from "@/lib/type";

/**
 * The analytics set's other signature block: the live event stream.
 *
 * From the "Design for Roadmap" cluster in the Figma file
 * (`wuO3Pq5OaVJb1pBWGznjAl`) — a flag eyebrow, a centred heading, three
 * **bordered** stat cards (deliberately not the hairline-divided cells of the
 * glance block above; the reference draws the two differently, and that
 * difference is what keeps two stat rows on one page from reading as a
 * repeat), then a dense column-ruled table that runs off the bottom of its
 * frame rather than ending on a last row.
 *
 * The funnel from the same cluster is folded in above the table instead of
 * getting a band of its own: it summarises the very rows underneath it, and
 * the page has enough sections already.
 */

/* PLACEHOLDER FIGURES — illustrative. */
const tiles = [
  { label: "Kroki dzisiaj", value: "12" },
  { label: "Seria nauki", value: "34 dni" },
  { label: "Tematy w tym tygodniu", value: "5", active: true },
];

/** Plan → started → mastered → retained: the reference's funnel, narrowing. */
const funnel = [
  { label: "W planie", value: 63, width: "w-full", fill: "bg-electric-blue" },
  { label: "Rozpoczęte", value: 41, width: "w-[65%]", fill: "bg-[#60a5fa]" },
  { label: "Opanowane", value: 24, width: "w-[38%]", fill: "bg-lavender" },
  { label: "Utrwalone", value: 18, width: "w-[28%]", fill: "bg-vivid-green" },
];

const subjects: Record<string, { icon: IconComponent; accent: Accent }> = {
  Matematyka: { icon: Sigma, accent: "green" },
  Polski: { icon: BookMarked, accent: "blue" },
  Angielski: { icon: Languages, accent: "lavender" },
};

const rows: Array<{
  kind: string;
  topic: string;
  subject: keyof typeof subjects;
  result: string;
  unit?: string;
  when: string;
}> = [
  { kind: "Quiz", topic: "Procenty", subject: "Matematyka", result: "8 / 10", when: "14:32" },
  { kind: "Lekcja", topic: "Procenty", subject: "Matematyka", result: "ukończona", when: "14:05" },
  { kind: "Powtórka", topic: "Ułamki", subject: "Matematyka", result: "5 / 5", when: "12:40" },
  { kind: "Arkusz", topic: "Lektury obowiązkowe", subject: "Polski", result: "12 / 14", when: "wczoraj" },
  { kind: "Quiz", topic: "Środki językowe", subject: "Angielski", result: "9 / 12", when: "wczoraj" },
  { kind: "Lekcja", topic: "Interpretacja wiersza", subject: "Polski", result: "ukończona", when: "wczoraj" },
  { kind: "Powtórka", topic: "Proporcje", subject: "Matematyka", result: "4 / 5", when: "2 dni temu" },
  { kind: "Quiz", topic: "Czasy przeszłe", subject: "Angielski", result: "11 / 12", when: "2 dni temu" },
];

export function ActivityStream() {
  return (
    <section
      id="stream"
      aria-labelledby="stream-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-[12px] font-medium text-steel">
              <Activity className="size-3.5 text-electric-blue" strokeWidth={2} aria-hidden />
              Strumień postępów
            </p>
            <h2
              id="stream-heading"
              className={cn("mx-auto mt-4 max-w-xl text-charcoal", SECTION_H2)}
            >
              Widać każdy krok w chwili, w której się dzieje
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Roadmapa nie czeka do końca tygodnia z podsumowaniem — status
              zmienia się przy każdej odpowiedzi.
            </p>
          </div>
        </Reveal>

        {/* Bordered cards, not divided cells — see the block comment. */}
        <Reveal delay={80}>
          <ul className="mt-12 grid gap-3 sm:grid-cols-3">
            {tiles.map((tile) => (
              <li
                key={tile.label}
                className={cn(
                  "rounded-cards border bg-white px-4 py-3.5",
                  tile.active ? "border-smoke" : "border-ash",
                )}
              >
                <p className="text-[12px] text-fog">{tile.label}</p>
                <p className="mt-1.5 text-heading-sm font-medium leading-none text-charcoal tabular-nums">
                  {tile.value}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-4 rounded-cards border border-ash bg-white p-5">
            <p className="text-[12px] font-medium text-charcoal">
              Z planu do pamięci
            </p>
            <ul className="mt-3.5 space-y-2.5">
              {funnel.map((stage) => (
                <li key={stage.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[11.5px] text-steel">
                    {stage.label}
                  </span>
                  <span className={cn("h-5 rounded-[4px]", stage.width, stage.fill)} />
                  <span className="shrink-0 font-geist-mono text-[11px] text-fog tabular-nums">
                    {stage.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* The table runs off the bottom of its frame, as the reference's
            does — a list that ends on a tidy last row reads as a screenshot
            of everything there is. */}
        <Reveal delay={160}>
          <div
            className="mask-fade-bottom mt-4 h-[22rem] overflow-hidden"
            aria-hidden
          >
            <DataTable divided columns={["Krok", "Temat", "Przedmiot", "Wynik", "Kiedy"]}>
              {rows.map((row, index) => {
                const subject = subjects[row.subject];
                return (
                  <TableRow
                    key={`${row.kind}-${index}`}
                    divided
                    cells={[
                      <span key="k" className="font-medium text-charcoal">
                        {row.kind}
                      </span>,
                      row.topic,
                      <span key="s" className="flex items-center gap-2">
                        <AccentTile icon={subject.icon} accent={subject.accent} />
                        <span className="text-steel">{row.subject}</span>
                      </span>,
                      <span key="r" className="font-geist-mono tabular-nums">
                        {row.result}
                      </span>,
                      <span key="w" className="text-fog">
                        {row.when}
                      </span>,
                    ]}
                  />
                );
              })}
            </DataTable>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
