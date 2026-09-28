import { AlarmClock, BadgeCheck, FileText, ShieldCheck } from "lucide-react";
import { SourceStory, type StorySteps } from "@/components/sections/SourceStory";

/**
 * The card's tint: two wide blooms in the accents this page runs on, pooled at
 * the corners of the near-black surface. Plain radial gradients, so the
 * falloff *is* the blur — no filter, no compositing layer. Tangerine rising
 * from the base, which is the accent `app/globals.css` reserves for the
 * simulation, against the sapphire the other two cards share.
 */
const CARD_TINT = [
  "radial-gradient(72% 92% at 8% 100%, color-mix(in oklab, var(--color-tangerine) 34%, transparent) 0%, transparent 70%)",
  "radial-gradient(64% 86% at 96% 6%, color-mix(in oklab, var(--color-deep-sapphire) 30%, transparent) 0%, transparent 72%)",
].join(", ");

/** What has to be true before a sheet becomes a simulation. */
const steps: StorySteps = [
  {
    icon: FileText,
    title: "Arkusz",
    description:
      "Oryginalny arkusz CKE z danej sesji, w komplecie — bez skracania i bez wyboru zadań.",
  },
  {
    icon: AlarmClock,
    title: "Czas",
    description:
      "Limit przepisany z arkusza, nie ustawiony na oko: 100 minut albo 170, zależnie od egzaminu.",
  },
  {
    icon: BadgeCheck,
    title: "Punktacja",
    description:
      "Zasady oceniania z tej samej sesji, kryterium po kryterium.",
  },
  {
    icon: ShieldCheck,
    title: "Przejście próbne",
    description:
      "Arkusz przechodzimy sami od początku do końca, zanim zobaczy go ktokolwiek inny.",
  },
];

const budget = [
  { label: "Zadania 1–6", width: "w-[38%]" },
  { label: "Zadania 7–12", width: "w-[52%]" },
  { label: "Zadania 13–19", width: "w-[74%]" },
];

/**
 * The sheet's time budget — the reference's hero image slot, filled with the
 * shape this product actually has. /training puts a stack of arkusz sheets
 * here and /roadmap a milestone track; a simulation's own object is a clock
 * with the paper divided under it.
 */
function TimeBudget() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-10 top-1/2 hidden w-56 -translate-y-1/2 lg:block"
    >
      <p className="font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
        Limit arkusza
      </p>
      <p className="mt-1 font-geist-mono text-[40px] leading-none tracking-tight text-white/85 tabular-nums">
        100:00
      </p>
      <ul className="mt-5 space-y-3">
        {budget.map((row) => (
          <li key={row.label}>
            <p className="text-[10.5px] text-white/45">{row.label}</p>
            <span className="mt-1 block h-1.5 rounded-full bg-white/15">
              <span className={`block h-full rounded-full bg-white/45 ${row.width}`} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Where the sheets come from. */
export function SimulationStory() {
  return (
    <SourceStory
      id="sources"
      heading="Skąd biorą się arkusze w symulacji"
      sub="To ten sam arkusz, który opublikowała CKE — co do czasu i co do punktu."
      eyebrowIcon={FileText}
      eyebrow="Przygotowanie arkusza"
      title="Arkusz wchodzi do symulacji dopiero, gdy zgadza się co do minuty i co do punktu"
      linkLabel="Zobacz, jak przygotowujemy arkusze"
      linkHref="/docs"
      tint={CARD_TINT}
      steps={steps}
    >
      <TimeBudget />
    </SourceStory>
  );
}
