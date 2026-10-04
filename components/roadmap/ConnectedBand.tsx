import Link from "next/link";
import { BadgePercent, BookOpen, Brain, FileText, ListChecks, PencilLine, RefreshCcw, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { GridPattern } from "@/components/training/GridPattern";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/links' "Connect with your favorite tools": copy on the left of a
 * muted band, a 60px grid running off to the right, and app tiles sitting in
 * its cells — some empty and sunk, the rest raised, each lifting a little
 * under the pointer. Tile positions are the reference's own. Dub's tiles are
 * third-party apps; these are the parts of Examax the roadmap works with,
 * each in its own chip colour (Trening green, Korepetytor AI yellow, Postępy
 * orange, Symulacja violet — as everywhere else on the site), and each
 * one is a link to that part.
 */

type Tile = { top: number; left: number; label?: string; href?: string; icon?: IconComponent; accent?: Accent };

const TILES: Tile[] = [
  { top: 239, left: 599, label: "Trening zadań", href: "/training", icon: PencilLine, accent: "green" },
  { top: 119, left: 659, label: "Powtórki", href: "/training#autopilot", icon: RefreshCcw, accent: "blue" },
  { top: 359, left: 719, label: "Arkusze CKE", href: "/training#coverage", icon: FileText, accent: "sapphire" },
  { top: 59, left: 779, label: "Korepetytor AI", href: "/agents", icon: Zap, accent: "yellow" },
  { top: 179, left: 779, label: "Lekcje", href: "#plan", icon: BookOpen, accent: "blue" },
  { top: 299, left: 839, label: "Quiz diagnostyczny", href: "/training#diagnostic", icon: ListChecks, accent: "green" },
  { top: 239, left: 899, label: "Symulacja egzaminu", href: "/simulation", icon: Timer, accent: "lavender" },
  { top: 119, left: 1019, label: "Śledzenie postępów", href: "/progress", icon: BadgePercent, accent: "tangerine" },
  { top: 359, left: 1079, label: "Techniki zapamiętywania", href: "#schedule", icon: Brain, accent: "lavender" },
  { top: 119, left: 539 },
  { top: 359, left: 599 },
  { top: 299, left: 659 },
  { top: 119, left: 899 },
  { top: 359, left: 959 },
  { top: 299, left: 1019 },
];

const TILE = "absolute size-[61px] rounded-lg bg-gradient-to-b from-paper-mist to-white transition-[transform,box-shadow] duration-150 ease-out";

/** A raised tile is a link to that part of Examax; the sunk ones are empty cells. */
function AppTile({ tile }: { tile: Tile }) {
  const Icon = tile.icon;
  const edge = <div aria-hidden className="absolute inset-0 rounded-[inherit] border border-black/20 [mask-image:linear-gradient(#000a,black)]" />;
  if (!Icon || !tile.accent || !tile.href) {
    return (
      <div aria-hidden className={cn(TILE, "opacity-30 shadow-[0_2px_6px_0_#0003_inset]")} style={{ top: tile.top, left: tile.left }}>
        {edge}
      </div>
    );
  }
  return (
    <Link
      href={tile.href}
      title={tile.label}
      aria-label={tile.label}
      className={cn(
        TILE,
        "focus-ring grid place-items-center shadow-md hover:z-10 hover:-translate-y-0.5 hover:scale-[1.025] hover:shadow-xl focus-visible:z-10",
      )}
      style={{ top: tile.top, left: tile.left }}
    >
      <span className={cn("grid size-9 place-items-center rounded-[10px] border border-black/5", accentStyles[tile.accent].chip)}>
        <Icon className="size-5" strokeWidth={2.25} aria-hidden />
      </span>
      {edge}
    </Link>
  );
}

export function ConnectedBand() {
  return (
    <section aria-labelledby="connected-heading" className="relative overflow-clip border-b border-ash bg-canvas-muted px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash md:h-[440px]">
        <div className="absolute inset-0 max-md:overflow-clip">
          <div className="absolute left-[-590px] h-[360px] w-[1600px] max-md:bottom-0 max-md:[mask-image:linear-gradient(black_80%,transparent)] md:-left-px md:top-1/2 md:h-[480px] md:-translate-y-1/2">
            <GridPattern id="connected-grid" className="inset-0 text-ash" />
            <div className="absolute inset-0">
              {TILES.map((tile) => (
                <AppTile key={`${tile.top}-${tile.left}`} tile={tile} />
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none relative px-4 pb-8 pt-14 md:px-10 md:py-28">
          <h2 id="connected-heading" className="max-w-sm text-pretty font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-[2.5rem] md:leading-[1.1]">
            Połączona z całym Examaxem
          </h2>
          <p className="mt-3 max-w-sm text-pretty text-base text-fog sm:text-lg">
            Trening, symulacje, Korepetytor AI i&nbsp;powtórki zasilają roadmapę — a&nbsp;ona podpowiada im, co robić dalej.
          </p>
          <div className="pointer-events-auto mt-8">
            <Button href="/" variant="outline">
              Poznaj Examax
            </Button>
          </div>
        </div>
        <div className="relative h-[360px] md:hidden" />
      </div>
    </section>
  );
}
