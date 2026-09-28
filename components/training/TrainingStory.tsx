import {
  BadgeCheck,
  FileText,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { SourceStory, type StorySteps } from "@/components/sections/SourceStory";
import { cn } from "@/lib/cn";

/**
 * The card's tint: two wide blooms in the accents this page runs on, pooled at
 * the corners of the near-black surface. Plain radial gradients, so the
 * falloff *is* the blur — no filter, no compositing layer. The same
 * construction as the closing CTA band's own tint.
 */
const CARD_TINT = [
  "radial-gradient(72% 92% at 8% 100%, color-mix(in oklab, var(--color-vivid-green) 26%, transparent) 0%, transparent 70%)",
  "radial-gradient(64% 86% at 96% 6%, color-mix(in oklab, var(--color-deep-sapphire) 34%, transparent) 0%, transparent 72%)",
].join(", ");

/** The four steps a task goes through before a student sees it. */
const steps: StorySteps = [
  {
    icon: FileText,
    title: "Źródło",
    description:
      "Arkusz, informator albo wymagania CKE. Każde zadanie ma przypisaną sesję.",
  },
  {
    icon: BadgeCheck,
    title: "Punktacja",
    description:
      "Kryteria przepisane z zasad oceniania — osobno metoda, obliczenia i odpowiedź.",
  },
  {
    icon: ShieldCheck,
    title: "Weryfikacja",
    description:
      "Zadanie wchodzi do bazy dopiero, gdy da się je ocenić tak jak arkuszowe.",
  },
  {
    icon: RefreshCcw,
    title: "Aktualizacja",
    description:
      "Po każdej sesji dochodzi nowy rocznik, razem z jego zasadami oceniania.",
  },
];

/** A decorative stack of arkusz sheets — the reference's hero image slot,
    filled with product rather than photography (DESIGN.md). */
function SheetStack() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-6 top-1/2 hidden h-72 w-72 -translate-y-1/2 lg:block"
    >
      {[
        { offset: "left-14 top-10 rotate-6", opacity: "opacity-30" },
        { offset: "left-7 top-5 rotate-3", opacity: "opacity-60" },
        { offset: "left-0 top-0 rotate-0", opacity: "opacity-100" },
      ].map((sheet) => (
        <div
          key={sheet.offset}
          className={cn(
            "absolute h-64 w-48 rounded-cards border border-white/15 bg-white/[0.07] p-4 backdrop-blur-[2px]",
            sheet.offset,
            sheet.opacity,
          )}
        >
          <p className="font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
            Arkusz CKE
          </p>
          <div className="mt-4 space-y-2.5">
            {["w-full", "w-4/5", "w-full", "w-2/3", "w-full", "w-3/4", "w-1/2"].map(
              (width, index) => (
                <span
                  key={index}
                  className={cn("block h-1.5 rounded-full bg-white/15", width)}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Where the questions come from. */
export function TrainingStory() {
  return (
    <SourceStory
      id="sources"
      heading="Skąd biorą się zadania w Examaxie"
      sub="Nie generujemy pytań. Każde zadanie ma źródło i punktację, którą da się sprawdzić."
      eyebrowIcon={FileText}
      eyebrow="Redakcja bazy"
      title="Każde zadanie przechodzi przez zasady oceniania, zanim trafi do treningu"
      linkLabel="Zobacz, jak powstaje baza"
      linkHref="/docs"
      tint={CARD_TINT}
      steps={steps}
    >
      <SheetStack />
    </SourceStory>
  );
}
