"use client";

import { useEffect, useState } from "react";
import { BookMarked, Dna, FlaskConical, Languages, Sigma } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { MarkChip } from "@/components/simulation/ExamBand";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/about's logo strip (live DOM, 2026-10-02): a ruled band of
 * wordmarks, five to a row, every slot holding two of them. Every few
 * seconds the whole strip turns over, slot by slot 50ms apart: the one
 * showing tips back on its X axis and fades as the other swings up into
 * place, over 500ms. Some marks carry a tiny "case study" chip.
 *
 * Dub's marks are its customers. Examax has none to name yet, so the strip
 * shows what it covers instead: the exams (by their official marks, as
 * they are) on one side, the subjects (in the navbar's accents) on the other.
 */

type Mark = { key: string; mark: React.ReactNode; name: string; chip: string; soon?: boolean };

function SubjectMark({ icon, accent }: { icon: IconComponent; accent: Accent }) {
  return <AccentTile icon={icon} accent={accent} />;
}

/** A subject still to come: the footer's neutral chip, silver glyph. */
function SoonMark({ icon: Icon }: { icon: IconComponent }) {
  return (
    <span className="grid size-5 place-items-center rounded-[5px] border border-black/5 bg-paper-mist text-silver">
      <Icon className="size-3" strokeWidth={2} aria-hidden />
    </span>
  );
}

const EXAMS: Mark[] = [
  { key: "e8", mark: <E8Icon className="h-5 w-6" />, name: "Ósmoklasista", chip: "Egzamin ósmoklasisty" },
  { key: "mp", mark: <MaturaIcon className="h-5 w-6" />, name: "Matura", chip: "Poziom podstawowy" },
  { key: "mr", mark: <MaturaIcon className="h-5 w-6" />, name: "Rozszerzona", chip: "Poziom rozszerzony" },
  { key: "sheets", mark: <CkeIcon className="h-5 w-auto" />, name: "Arkusze", chip: "Oficjalne CKE" },
  { key: "guides", mark: <CkeIcon className="h-5 w-auto" />, name: "Informatory", chip: "Wymagania CKE" },
];

const SUBJECTS: Mark[] = [
  { key: "math", mark: <SubjectMark icon={Sigma} accent="blue" />, name: "Matematyka", chip: "E8 i matura" },
  { key: "polish", mark: <SubjectMark icon={BookMarked} accent="green" />, name: "Polski", chip: "E8 i matura" },
  { key: "english", mark: <SubjectMark icon={Languages} accent="lavender" />, name: "Angielski", chip: "E8 i matura" },
  { key: "biology", mark: <SoonMark icon={Dna} />, name: "Biologia", chip: "Wkrótce", soon: true },
  { key: "chemistry", mark: <SoonMark icon={FlaskConical} />, name: "Chemia", chip: "Wkrótce", soon: true },
];

const SETS = [EXAMS, SUBJECTS];

/** How long each side of the strip stays up. */
const HOLD_MS = 3000;
/** The turn ripples across the strip, one slot after another. */
const STAGGER_MS = 50;

function MarkFace({ mark, shown, delay }: { mark: Mark; shown: boolean; delay: number }) {
  return (
    <div
      inert={!shown}
      className={cn("absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none", !shown && "pointer-events-none opacity-0")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "absolute inset-x-0 inset-y-3 flex h-6 items-center justify-center gap-2 opacity-90 transition-transform duration-500 motion-reduce:transition-none",
          !shown && "[transform:rotateX(100deg)]",
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {mark.mark}
        <span className={cn("whitespace-nowrap font-satoshi text-lg font-bold tracking-tight", mark.soon ? "text-silver" : "text-charcoal")}>
          {mark.name}
        </span>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <MarkChip>{mark.chip}</MarkChip>
      </div>
    </div>
  );
}

export function ExamStrip() {
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setSide((current) => (current + 1) % SETS.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <section aria-label="Egzaminy i przedmioty w Examax" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash">
        <ul aria-hidden className="grid grid-cols-2 items-center gap-4 px-4 py-10 sm:grid-cols-3 md:grid-cols-5">
          {EXAMS.map((_, slot) => (
            <li key={slot} className="relative h-12">
              {SETS.map((set, index) => (
                <MarkFace key={set[slot].key} mark={set[slot]} shown={index === side} delay={slot * STAGGER_MS} />
              ))}
            </li>
          ))}
        </ul>
        {/* Screen readers get both sides at once rather than a strip that changes under them */}
        <p className="sr-only">
          Egzamin ósmoklasisty, matura na poziomie podstawowym i rozszerzonym. Matematyka, język polski i język angielski; biologia i chemia wkrótce.
        </p>
      </div>
    </section>
  );
}
