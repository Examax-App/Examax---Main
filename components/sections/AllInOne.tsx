import type { LucideIcon } from "lucide-react";
import {
  BookMarked,
  CalendarDays,
  BookOpen,
  Bot,
  FileText,
  Languages,
  Layers,
  ListChecks,
  PenLine,
  RefreshCcw,
  Sigma,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Tile = {
  name?: string;
  icon?: LucideIcon;
  bg?: string;
  iconClass?: string;
  size: "sm" | "lg";
  position: string;
  ghost?: boolean;
};

const tiles: Tile[] = [
  { name: "Lekcje", icon: BookOpen, bg: "bg-electric-blue", iconClass: "text-white", size: "lg", position: "col-start-3 row-start-1" },
  { ghost: true, size: "sm", position: "col-start-5 row-start-1" },
  { ghost: true, size: "sm", position: "col-start-1 row-start-2" },
  { name: "Notatki", icon: PenLine, bg: "bg-white border border-ash", iconClass: "text-steel", size: "sm", position: "col-start-2 row-start-2" },
  { name: "Arkusze CKE", icon: FileText, bg: "bg-white border border-ash", iconClass: "text-tangerine", size: "lg", position: "col-start-4 row-start-2" },
  { name: "Wzory", icon: Sigma, bg: "bg-white border border-ash", iconClass: "text-charcoal", size: "sm", position: "col-start-6 row-start-2" },
  { name: "Słówka", icon: Languages, bg: "bg-white border border-ash", iconClass: "text-vivid-green", size: "sm", position: "col-start-1 row-start-3" },
  { name: "Quizy", icon: ListChecks, bg: "bg-white border border-ash", iconClass: "text-electric-blue", size: "sm", position: "col-start-3 row-start-3" },
  { name: "Fiszki", icon: Layers, bg: "bg-lavender", iconClass: "text-white", size: "lg", position: "col-start-5 row-start-3" },
  { ghost: true, size: "sm", position: "col-start-2 row-start-4" },
  { name: "Lektury", icon: BookMarked, bg: "bg-white border border-ash", iconClass: "text-lavender", size: "sm", position: "col-start-4 row-start-4" },
  { ghost: true, size: "sm", position: "col-start-6 row-start-4" },
  { name: "Powtórki", icon: RefreshCcw, bg: "bg-white border border-ash", iconClass: "text-steel", size: "sm", position: "col-start-1 row-start-5" },
  { name: "Agent AI", icon: Bot, bg: "bg-midnight-ink", iconClass: "text-white", size: "lg", position: "col-start-3 row-start-5" },
  { name: "Terminy", icon: CalendarDays, bg: "bg-tangerine", iconClass: "text-white", size: "sm", position: "col-start-5 row-start-5" },
  { ghost: true, size: "sm", position: "col-start-6 row-start-6" },
];

/**
 * "All in one place" scatter — content-type tiles at two sizes drifting
 * across the grid with ghost placeholders between them, the whole field
 * fading toward its edges. Tiles lift on hover.
 */
export function AllInOne() {
  return (
    <section
      aria-labelledby="allinone-heading"
      className="relative overflow-hidden border-t border-ash bg-white"
    >
      <div className="bg-grid mask-fade-edges absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2
              id="allinone-heading"
              className="max-w-sm font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
            >
              Wszystko do egzaminu w jednym miejscu
            </h2>
            <p className="mt-5 max-w-md text-body-xl text-fog">
              Koniec z arkuszami w PDF-ach, notatkami w chmurze i playlistami
              z tłumaczeniami. Lekcje, zadania, powtórki i wyniki są połączone
              w jeden system, który wie, co dalej.
            </p>
            <Button href="#roadmapa" variant="outline" className="mt-7">
              Zobacz, jak to działa
            </Button>
          </Reveal>

          <Reveal delay={100}>
            <div className="mask-fade-edges">
              <ul
                aria-label="Materiały dostępne w Examax"
                className="grid grid-cols-6 grid-rows-6 place-items-center gap-1"
              >
                {tiles.map((tile, index) => (
                  <li key={tile.name ?? `ghost-${index}`} className={tile.position}>
                    {tile.ghost ? (
                      <span
                        aria-hidden
                        className="block size-12 rounded-cards border border-ash/70 bg-white/60 sm:size-14"
                      />
                    ) : (
                      <span
                        title={tile.name}
                        aria-label={tile.name}
                        className={cn(
                          "grid cursor-default place-items-center rounded-cards shadow-subtle transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
                          tile.bg,
                          tile.size === "lg"
                            ? "size-16 sm:size-[76px]"
                            : "size-12 sm:size-14",
                        )}
                      >
                        {tile.icon ? (
                          <tile.icon
                            strokeWidth={1.8}
                            className={cn(
                              tile.iconClass,
                              tile.size === "lg"
                                ? "size-8 sm:size-9"
                                : "size-6 sm:size-7",
                            )}
                          />
                        ) : null}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
