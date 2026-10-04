"use client";

import Image from "next/image";
import { BookOpen, Copy, CornerDownRight, Globe, Layers, ListChecks } from "lucide-react";
import { StageStack, type Stage } from "@/components/roadmap/ScheduleVisuals";
import { cn } from "@/lib/cn";

import learnerPhoto from "@/public/mockups/learner.jpg";

/*
 * The two pictures under the /progress chart — dub.co/analytics' pair (live
 * DOM, 2026-10-01):
 *
 *   Share dashboard               → ShareProgress (a public link for a parent or tutor)
 *   Tilted devices/browsers/geo   → SubjectStack  (the roadmap's tilted stack:
 *                                   task types, sections, subjects)
 *
 * PLACEHOLDER DATA — the learner, link and figures are illustrative.
 */

/** The reference's switch, drawn on: black track, the knob at the right. */
function Switch({ on = true }: { on?: boolean }) {
  return (
    <span className={cn("relative inline-flex h-4 w-8 shrink-0 rounded-full border-2 border-transparent", on ? "bg-black" : "bg-ash")}>
      <span className={cn("size-3 rounded-full bg-white shadow-lg", on && "translate-x-4")} />
    </span>
  );
}

export function ShareProgress() {
  return (
    <div aria-hidden className="-mx-3.5 h-full cursor-default select-none overflow-clip [mask-image:radial-gradient(140%_100%_at_-10%_0%,black_80%,transparent_100%)]">
      <div className="mx-3.5 origin-top scale-95 rounded-xl border border-ash bg-white shadow-[0_20px_20px_0_#00000017] md:origin-top-left">
        <h3 className="border-b border-ash px-4 py-4 text-lg font-medium text-charcoal sm:px-6">Udostępnij postępy</h3>
        <div className="min-h-[300px] bg-canvas-muted px-6 pb-6 pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-smoke bg-white p-3">
            <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ash bg-paper-mist">
              <Image src={learnerPhoto} alt="" fill sizes="36px" className="object-cover object-[center_30%]" />
            </span>
            <div className="flex min-w-0 flex-col text-sm">
              <span className="truncate font-semibold leading-normal text-graphite">Zuzanna Nowakowska</span>
              <span className="flex items-center gap-1 text-fog">
                <CornerDownRight className="size-3.5 shrink-0" strokeWidth={1.75} />
                <span className="truncate">Matura 2027 · trzy przedmioty</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-6">
            <span className="flex items-center gap-2 text-sm text-steel">
              <Globe className="size-4" strokeWidth={1.75} />
              Publiczny link do postępów
            </span>
            <Switch />
          </div>
          <div className="pt-4 text-sm">
            <div className="flex items-center justify-between overflow-hidden rounded-md border border-ash bg-paper-mist">
              <p className="min-w-0 truncate whitespace-nowrap pl-3 text-silver">https://examax.app/p/zuzanna-7Hk2mQ9xLr</p>
              <span className="flex h-8 shrink-0 items-center gap-2 whitespace-nowrap border-l border-ash bg-white px-3 text-charcoal">
                <Copy className="size-3.5" strokeWidth={1.75} />
                Kopiuj link
              </span>
            </div>
            <div className="grid w-full gap-3 px-px pt-4">
              <p className="text-base font-medium text-charcoal">Ustawienia</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-steel">Pokaż wyniki arkuszy</p>
                <Switch />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-steel">Cotygodniowy raport e-mailem</p>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Back to front: task types, sections, then the subjects on top — each row's share already mastered. */
const PANELS: Stage[] = [
  {
    title: "Typy zadań",
    icon: ListChecks,
    tx: 0,
    opacity: 0.3,
    rows: [
      { topic: "Zamknięte", done: 84 },
      { topic: "Otwarte krótkie", done: 71 },
      { topic: "Otwarte rozszerzone", done: 52 },
      { topic: "Wypracowanie", done: 64 },
      { topic: "Słuchanie", done: 88 },
    ],
  },
  {
    title: "Działy",
    icon: Layers,
    tx: 55,
    opacity: 0.8,
    rows: [
      { topic: "Funkcje", done: 82 },
      { topic: "Ciągi", done: 88 },
      { topic: "Trygonometria", done: 64 },
      { topic: "Planimetria", done: 58 },
      { topic: "Stereometria", done: 31 },
    ],
  },
  {
    title: "Przedmioty",
    icon: BookOpen,
    tx: 110,
    opacity: 1,
    rows: [
      { topic: "Matematyka", done: 72 },
      { topic: "Język angielski", done: 86 },
      { topic: "Język polski", done: 64 },
    ],
  },
];

export function SubjectStack() {
  return <StageStack stages={PANELS} />;
}
