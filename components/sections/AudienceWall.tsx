import {
  Backpack,
  GraduationCap,
  RefreshCcw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";
import type { IconComponent } from "@/lib/icon";
import { AgentIcon } from "@/components/ui/AgentIcon";

type WallCell = {
  icon: IconComponent;
  iconClass: string;
  title: string;
  description: string;
  wide?: boolean;
};

const cells: WallCell[] = [
  {
    icon: Backpack,
    iconClass: "bg-electric-blue text-white",
    title: "Ósmoklasista",
    description:
      "Trzy przedmioty, jedna roadmapa. Matematyka, polski i angielski rozpisane od września do maja — bez paniki w kwietniu.",
    wide: true,
  },
  {
    icon: GraduationCap,
    iconClass: "bg-vivid-green text-white",
    title: "Matura podstawowa",
    description: "Pewny wynik z przedmiotów obowiązkowych, temat po temacie.",
  },
  {
    icon: TrendingUp,
    iconClass: "bg-deep-sapphire text-white",
    title: "Matura rozszerzona",
    description: "Trening na poziomie, którego wymaga rekrutacja na studia.",
  },
  {
    icon: RefreshCcw,
    iconClass: "bg-lavender text-white",
    title: "Poprawiasz wynik",
    description: "Zaczynasz od diagnozy, nie od zera — system wskaże braki.",
  },
  {
    icon: AgentIcon,
    // The agent mark is a raster that carries its own edges and highlights.
    // It needs no tile behind it, so this cell's slot stays empty while the
    // rest of the wall keeps its accent fills.
    iconClass: "",
    title: "Uczysz się bez korepetycji",
    description: "Agent tłumaczy i pilnuje planu — jak dobry korepetytor.",
  },
  {
    icon: Users,
    iconClass: "bg-electric-blue text-white",
    title: "Rodzice i korepetytorzy",
    description:
      "Realny obraz postępów zamiast „będzie dobrze”. Widać, co zrobione, co opanowane i nad czym trzeba jeszcze usiąść.",
    wide: true,
  },
];

/**
 * Audience wall — a bento grid of hairline-divided cells, one for every kind
 * of student on the way to a CKE exam, in place of the reference's customer
 * wall. Same printed-document grid, honest content.
 */
export function AudienceWall() {
  return (
    <section
      aria-labelledby="audience-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="audience-heading"
              className={cn("max-w-lg text-charcoal", SECTION_H2)}
            >
              Dla każdego, kto ma egzamin przed sobą
            </h2>
            <Button href="#pricing" variant="outline">
              Zacznij za darmo
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <div className="grid gap-px overflow-hidden rounded-largecards border border-ash bg-ash sm:grid-cols-2 lg:grid-cols-4">
            {cells.map((cell) => (
              <div
                key={cell.title}
                className={cn(
                  "bg-white p-7 transition-colors duration-200 hover:bg-[#fafafa]",
                  cell.wide && "sm:col-span-2",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 place-items-center rounded-buttons",
                    cell.iconClass,
                  )}
                >
                  <cell.icon className="size-4.5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-body-xl font-semibold text-charcoal">
                  {cell.title}
                </h3>
                <p className="mt-2 max-w-md text-body-lg text-steel">
                  {cell.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
