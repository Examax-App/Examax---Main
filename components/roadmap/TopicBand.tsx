"use client";

import { useEffect, useState } from "react";
import { BookMarked, Languages, Sigma } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The band under the hero — dub.co/links' logo band: ten marks in a 5×2 grid,
 * each slot flipping on its X axis to a second set, 50ms after its
 * neighbour. Dub shows customers; Examax has none to name yet, so the band
 * shows what a roadmap is made of — its topics — and flips between the
 * Ósmoklasista roadmaps and the Matura ones. Each topic wears its subject's
 * chip, as the footer and the training band draw them. The pill under the
 * first mark (dub's "Case study") names the exam.
 */

type Subject = { icon: IconComponent; accent: Accent };

const MATH: Subject = { icon: Sigma, accent: "blue" };
const POLISH: Subject = { icon: BookMarked, accent: "green" };
const ENGLISH: Subject = { icon: Languages, accent: "lavender" };

type Topic = { name: string; subject: Subject };

/** One face of the band: ten marks and the name its pill shows. */
export type BandSet = { exam: string; topics: Topic[] };

const SETS: BandSet[] = [
  {
    exam: "Ósmoklasista",
    topics: [
      { name: "Ułamki", subject: MATH },
      { name: "Lektury", subject: POLISH },
      { name: "Past Simple", subject: ENGLISH },
      { name: "Procenty", subject: MATH },
      { name: "Rozprawka", subject: POLISH },
      { name: "Geometria", subject: MATH },
      { name: "Słownictwo", subject: ENGLISH },
      { name: "Równania", subject: MATH },
      { name: "Części mowy", subject: POLISH },
      { name: "Reading", subject: ENGLISH },
    ],
  },
  {
    exam: "Matura",
    topics: [
      { name: "Funkcje", subject: MATH },
      { name: "Romantyzm", subject: POLISH },
      { name: "Grammar", subject: ENGLISH },
      { name: "Ciągi", subject: MATH },
      { name: "Wypracowanie", subject: POLISH },
      { name: "Trygonometria", subject: MATH },
      { name: "Listening", subject: ENGLISH },
      { name: "Stereometria", subject: MATH },
      { name: "Pozytywizm", subject: POLISH },
      { name: "Writing", subject: ENGLISH },
    ],
  },
];

/** How long a set stays up before the slots flip. */
const HOLD_MS = 3500;

/**
 * /roadmap shows its topics; other pages pass their own two sets and a label
 * (/progress: what the tracking measures) and keep the flip as it is here.
 */
export function TopicBand({ sets = SETS, label = "Tematy w roadmapach" }: { sets?: BandSet[]; label?: string } = {}) {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setInterval(() => setActive((set) => (set + 1) % sets.length), HOLD_MS);
    return () => window.clearInterval(timer);
  }, [inView, reduced, sets.length]);

  return (
    <section aria-label={label} className="relative overflow-clip border-b border-ash bg-white px-4">
      <div ref={ref} className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash">
        <ul className="grid grid-cols-2 items-center gap-4 px-4 py-10 sm:grid-cols-3 md:grid-cols-5">
          {sets[0].topics.map((_, slot) => (
            <li key={slot} className="relative h-12 [perspective:600px]">
              {sets.map((set, index) => {
                const shown = index === active;
                const topic = set.topics[slot];
                const delay = `${slot * 50}ms`;
                return (
                  <div
                    key={set.exam}
                    aria-hidden={!shown}
                    className={cn("absolute inset-0 transition-opacity duration-500", !shown && "pointer-events-none opacity-0")}
                    style={{ transitionDelay: delay }}
                  >
                    <div
                      className={cn(
                        "absolute inset-x-0 inset-y-3 flex h-6 items-center justify-center transition-transform duration-500",
                        !shown && "[transform:rotateX(100deg)]",
                      )}
                      style={{ transitionDelay: delay }}
                    >
                      <span className="flex items-center gap-2 opacity-90">
                        <AccentTile icon={topic.subject.icon} accent={topic.subject.accent} />
                        <span className="whitespace-nowrap font-satoshi text-[17px] font-bold tracking-tight text-charcoal">{topic.name}</span>
                      </span>
                      {slot === 0 ? (
                        <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper-mist px-1 py-0.5 text-[8px] font-semibold uppercase leading-none text-steel">
                          {set.exam}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
