import Image from "next/image";
import Link from "@/components/ui/Link";
import { ArrowRight, CircleCheck, FileCheck, FileText, ListChecks, PencilLine, Route, Timer, Zap } from "lucide-react";
import { E8Icon } from "@/components/ui/E8Icon";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

import kacperPhoto from "@/public/mockups/learner-kacper.jpg";

/*
 * The pair under the /progress funnel — dub.co/analytics' (live DOM,
 * 2026-10-01):
 *
 *   Customer insights        → LearnerInsight (a learner's card: how long
 *                              from the diagnostic to the first sheet, his
 *                              average, and his latest activity)
 *   Integrate with your stack → ExamaxTiles   (the parts of Examax that feed
 *                              the tracking, each tile a link; empty tiles
 *                              fade out below, as the reference's do)
 *
 * PLACEHOLDER DATA — the learner and his figures are illustrative.
 */

const ACTIVITY = [
  { icon: FileCheck, text: <><span className="font-medium text-charcoal">31/50 pkt</span> z arkusza próbnego</>, date: "28 wrz, 18:04" },
  { icon: CircleCheck, text: <>Opanowany temat <span className="font-medium text-charcoal">Ułamki</span></>, date: "26 wrz, 17:40" },
];

export function LearnerInsight() {
  return (
    <div aria-hidden inert className="h-full cursor-default select-none overflow-clip [mask-image:linear-gradient(black_75%,transparent)]">
      {/* Drawn a tenth small, as the reference's card is, so its activity shows above the fade */}
      <div className="w-[111%] origin-top-left scale-90 rounded-xl border border-ash bg-canvas-muted">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-2">
            <span className="relative size-10 overflow-hidden rounded-full bg-paper-mist">
              <Image src={kacperPhoto} alt="" fill sizes="40px" className="object-cover object-[center_30%]" />
            </span>
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-[11px] text-slate">
                <E8Icon className="h-2.5 w-3.5" />
                Ósmoklasista 2027
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-[11px] text-slate">
                <span className="flex h-2.5 w-3 flex-col overflow-hidden rounded-sm border-[0.5px] border-black/15">
                  <span className="flex-1 bg-white" />
                  <span className="flex-1 bg-[#dc143c]" />
                </span>
                Gdańsk
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">Kacper Lewandowski</span>
            <span className="rounded-full border border-ash bg-white px-1.5 text-[11px] font-medium leading-4 text-charcoal">Pro</span>
            <span className="rounded-full border border-ash bg-ash px-1.5 text-[11px] leading-4 text-slate">5 mies.</span>
          </div>
          <span className="text-xs text-fog">kacper@examax.app</span>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ash bg-ash">
              <div className="relative flex flex-col bg-canvas-muted p-2.5">
                <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Diagnoza</span>
                <span className="text-sm text-charcoal">2 dni</span>
                <span className="absolute inset-y-0 right-0 z-10 my-auto -mr-2 flex size-4 items-center justify-center rounded-full border border-ash bg-canvas-muted">
                  <ArrowRight className="size-2.5" strokeWidth={2} />
                </span>
              </div>
              <div className="flex flex-col bg-canvas-muted p-2.5 pl-4">
                <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Arkusz</span>
                <span className="text-sm text-charcoal">3 tyg.</span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-ash bg-canvas-muted p-2.5">
              <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Średni wynik</span>
              <span className="text-sm text-charcoal">74%</span>
            </div>
          </div>

          <div className="mt-2 flex text-xs">
            <div className="relative">
              <span className="block px-2 pb-2.5 pt-1 text-steel">Aktywność</span>
              <div className="absolute bottom-0 w-full px-1 text-charcoal">
                <div className="h-0.5 rounded-t-full bg-current" />
              </div>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-3.5 rounded-b-xl border-t border-ash bg-white px-5 py-4">
          {ACTIVITY.map((entry, index) => (
            <li key={entry.date} className="flex items-center text-xs">
              <span className="relative mr-2.5 shrink-0">
                <entry.icon className="size-3.5 text-fog" strokeWidth={1.75} />
                {index < ACTIVITY.length - 1 ? <span className="absolute left-1/2 mt-1 h-3 border-l border-smoke" /> : null}
              </span>
              <span className="grow text-steel">{entry.text}</span>
              <span className="shrink-0 pl-3 text-silver">{entry.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type Tile = { label: string; href: string; icon: IconComponent; accent: Accent };

/** The reference's six filled tiles; the rest of its 4·4·3 grid stays empty. */
const TILES: Tile[] = [
  { label: "Trening zadań", href: "/training", icon: PencilLine, accent: "green" },
  { label: "Roadmapa nauki", href: "/roadmap", icon: Route, accent: "blue" },
  { label: "Symulacja egzaminu", href: "/simulation", icon: Timer, accent: "lavender" },
  { label: "Korepetytor AI", href: "/agents", icon: Zap, accent: "yellow" },
  { label: "Arkusze CKE", href: "/training#coverage", icon: FileText, accent: "sapphire" },
  { label: "Quiz diagnostyczny", href: "/training#diagnostic", icon: ListChecks, accent: "green" },
];
const EMPTY = 5;

const TILE = "relative size-[72px] rounded-xl border border-ash sm:size-[94px]";

export function ExamaxTiles() {
  return (
    <div className="h-full [mask-image:linear-gradient(black_45%,transparent)]">
      {/* Headroom above the top row: a hovered tile lifts, and the cell's
          frame clips whatever rises past its edge */}
      <div className="grid w-fit grid-cols-4 gap-2.5 px-px pb-px pt-2.5">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            title={tile.label}
            aria-label={tile.label}
            className={cn(TILE, "focus-ring group grid place-items-center bg-gradient-to-b from-paper-mist to-white shadow-subtle transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md")}
          >
            <span className={cn("grid size-9 place-items-center rounded-[10px] border border-black/5 sm:size-11 sm:rounded-xl", accentStyles[tile.accent].chip)}>
              <tile.icon className="size-5 sm:size-6" strokeWidth={2.25} aria-hidden />
            </span>
          </Link>
        ))}
        {Array.from({ length: EMPTY }, (_, index) => (
          <div key={index} aria-hidden className={cn(TILE, "bg-gradient-to-b from-canvas-muted to-white")} />
        ))}
      </div>
    </div>
  );
}
