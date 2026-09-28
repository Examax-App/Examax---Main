import { Gauge, Home, ListChecks, ScanSearch } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BentoCard, BentoGrid } from "@/components/ui/BentoGrid";
import { AgentIcon } from "@/components/ui/AgentIcon";
import { type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";
import type { IconComponent } from "@/lib/icon";

type Cell = {
  icon: IconComponent;
  accent: Accent;
  name: string;
  description: string;
  href: string;
  cta: string;
  /** Span classes — the composition lives here, not in the card. */
  className: string;
};

/**
 * The dashboard's own surfaces, per `PRODUCT.md`'s Home section: continue
 * where you left off, the diagnostic quiz, exam readiness, agent
 * recommendations, recent activity.
 *
 * The four feature sections above this one each argue for one part of the
 * product in depth. This is where they land — the panel a student actually
 * opens — and nothing on the page said so before.
 */
const cells: Cell[] = [
  {
    icon: Home,
    accent: "blue",
    name: "Start, gdzie skończyłeś",
    description:
      "Panel otwiera się na tym, co przerwałeś: lekcja w połowie, quiz bez wyniku, temat zaplanowany na dziś.",
    href: "/start",
    cta: "Zobacz panel",
    className: "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-4",
  },
  {
    icon: ScanSearch,
    accent: "green",
    name: "Quiz diagnostyczny",
    description:
      "Jedna szeroka seria na początek. Po niej Examax wie, od których tematów zacząć, a które możesz spokojnie pominąć.",
    href: "/training",
    cta: "Rozwiąż diagnozę",
    className: "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3",
  },
  {
    icon: Gauge,
    accent: "sapphire",
    name: "Wskaźnik gotowości",
    description: "Jedna liczba na wszystkie przedmioty — ile egzaminu masz już pewne.",
    href: "/#progress",
    cta: "Zobacz postępy",
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    icon: AgentIcon,
    accent: "lavender",
    name: "Rekomendacje agenta",
    description: "Co zrobić w najbliższe pół godziny, na podstawie ostatnich odpowiedzi.",
    href: "/#agent",
    cta: "Poznaj Agenta",
    className: "md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2",
  },
  {
    icon: ListChecks,
    accent: "blue",
    name: "Ostatnia aktywność",
    description:
      "Co zrobiłeś w tym tygodniu, ile punktów przybyło i które tematy wreszcie ruszyły z miejsca.",
    href: "/start",
    cta: "Zobacz panel",
    className: "md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-4",
  },
];

/**
 * The dashboard bento — a composed field rather than a row of equal cards, so
 * the panel reads as one surface with a centre.
 */
export function DashboardBento() {
  return (
    <section
      id="panel"
      aria-labelledby="panel-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <h2
            id="panel-heading"
            className={cn("max-w-xl text-charcoal", SECTION_H2)}
          >
            Wszystko wraca do jednego panelu
          </h2>
          <p className="mt-4 max-w-xl text-body-xl text-fog">
            Roadmapa, trening, agent i postępy nie są osobnymi aplikacjami.
            Otwierasz Examaxa i widzisz jedno: co robić dalej.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <BentoGrid className="md:grid-rows-3">
            {cells.map((cell) => (
              <BentoCard key={cell.name} {...cell} />
            ))}
          </BentoGrid>
        </Reveal>
      </Container>
    </section>
  );
}
