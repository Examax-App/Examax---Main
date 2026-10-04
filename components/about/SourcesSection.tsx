import { Library } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";

/*
 * dub.co/about's investors band: a centred header (eyebrow, title, muted
 * line), then a four-column hairline grid of cards — a round 48px avatar,
 * a name and a muted line — each a link that greys a step on hover and
 * another on press.
 *
 * Examax has no investors to list. What it does have is the paper trail it
 * is built on: the documents CKE publishes for each exam. One row per exam,
 * under its official mark, each card opening that page on cke.gov.pl
 * (every address checked live on 2026-10-02).
 */

const CKE = "https://cke.gov.pl";
const E8 = `${CKE}/egzamin-osmoklasisty`;
const MATURA = `${CKE}/egzamin-maturalny/egzamin-maturalny-w-formule-2023`;

type Source = { exam: "e8" | "matura"; name: string; href: string };

const SOURCES: Source[] = [
  { exam: "e8", name: "Arkusze egzaminacyjne", href: `${E8}/arkusze/` },
  { exam: "e8", name: "Informatory", href: `${E8}/informatory/` },
  { exam: "e8", name: "Harmonogram i komunikaty", href: `${E8}/harmonogram-komunikaty-i-informacje/` },
  { exam: "e8", name: "Wyniki", href: `${E8}/wyniki/` },
  { exam: "matura", name: "Arkusze egzaminacyjne", href: `${MATURA}/arkusze/` },
  { exam: "matura", name: "Informatory", href: `${MATURA}/informatory/` },
  { exam: "matura", name: "Harmonogram i komunikaty", href: `${MATURA}/harmonogram-komunikaty-i-informacje/` },
  { exam: "matura", name: "Wyniki i sprawozdania", href: `${MATURA}/wyniki-sprawozdania/` },
];

const EXAM_LABEL = { e8: "Egzamin ósmoklasisty", matura: "Matura · formuła 2023" } as const;

export function SourcesSection() {
  return (
    <section aria-labelledby="sources-heading" className="relative overflow-clip bg-white px-4 pb-28">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-32">
        <Reveal className="relative mx-auto flex max-w-xl shrink-0 flex-col items-center gap-3 px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-base font-medium text-steel">
            <Library className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            Źródła
          </div>
          <h2 id="sources-heading" className="text-pretty font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
            Nie zgadujemy, co będzie na egzaminie.
          </h2>
          <p className="text-pretty text-lg text-fog">
            Uczymy z dokumentów, które Centralna Komisja Egzaminacyjna publikuje dla uczniów i nauczycieli. Sprawdź je u źródła.
          </p>
        </Reveal>

        <ul className="relative mt-20 grid w-full grid-cols-1 gap-px border-y border-ash bg-ash sm:grid-cols-2 md:grid-cols-4">
          {SOURCES.map((source) => (
            <li key={source.href} className="flex">
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring group relative flex w-full flex-col items-center gap-5 bg-white px-6 py-10 transition-colors duration-150 hover:bg-canvas-muted active:bg-paper-mist sm:px-5"
              >
                <span className="grid size-12 place-items-center rounded-full border border-black/5 bg-white">
                  {source.exam === "e8" ? <E8Icon className="h-5 w-6" /> : <MaturaIcon className="h-5 w-6" />}
                </span>
                <span className="flex flex-col items-center text-center">
                  <span className="whitespace-nowrap text-base font-medium text-graphite">{source.name}</span>
                  <span className="text-sm text-fog">{EXAM_LABEL[source.exam]}</span>
                </span>
                <span className="sr-only">(otwiera stronę CKE w nowej karcie)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
