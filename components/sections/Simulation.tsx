import { AlarmClock, ChevronRight, FileText, Flag, Gauge } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  { icon: FileText, label: "Format 1:1 z arkuszem", iconClass: "text-tangerine" },
  { icon: AlarmClock, label: "Czas jak na sali", iconClass: "text-vivid-green" },
  { icon: Gauge, label: "Raport gotowości", iconClass: "text-electric-blue" },
];

/**
 * Upcoming exam-simulation mode as a compact, honest card — a roadmap tease,
 * not a full-height sell for an unshipped feature.
 */
export function Simulation() {
  return (
    <section
      id="symulacja"
      aria-labelledby="symulacja-heading"
      className="border-t border-ash bg-white"
    >
      <Container className="py-24">
        <Reveal>
          <div className="grid overflow-hidden rounded-largecards border border-ash lg:grid-cols-[1.5fr_1fr]">
            <div className="p-8 sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 text-[12px] font-semibold text-charcoal shadow-subtle">
                <span className="size-2 rounded-full bg-lavender" aria-hidden />
                <span className="bg-gradient-to-r from-[#db2777] to-lavender bg-clip-text text-transparent">
                  Wkrótce · Examax Premium
                </span>
              </p>
              <h2
                id="symulacja-heading"
                className="mt-5 max-w-lg font-satoshi text-heading-sm font-medium leading-[1.2] text-charcoal sm:text-heading"
              >
                Symulacja egzaminu — przećwicz, zanim będzie się liczył
              </h2>
              <p className="mt-3 max-w-lg text-body-lg text-steel">
                Pracujemy nad pełną symulacją: arkusz w egzaminacyjnym
                formacie, czas liczony jak na sali i raport gotowości po
                zakończeniu.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {pillars.map((pillar) => (
                  <li
                    key={pillar.label}
                    className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-2 text-body font-medium text-charcoal"
                  >
                    <pillar.icon
                      className={`size-4 ${pillar.iconClass}`}
                      strokeWidth={1.8}
                      aria-hidden
                    />
                    {pillar.label}
                  </li>
                ))}
              </ul>
              <a
                href="#faq"
                className="link-underline mt-6 inline-flex items-center gap-1 text-body-lg font-medium text-electric-blue"
              >
                Dowiedz się, kiedy startujemy
                <ChevronRight className="size-4" aria-hidden />
              </a>
            </div>

            {/* Compact arkusz preview */}
            <div
              aria-hidden
              className="relative hidden border-l border-ash bg-paper-mist p-8 lg:block"
            >
              <div className="bg-dots mask-fade-edges absolute inset-0" />
              <div className="relative mx-auto max-w-64 rounded-cards border border-ash bg-white p-5 shadow-md">
                <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                  Arkusz próbny · Examax
                </p>
                <p className="mt-2 font-satoshi text-body-xl font-bold tracking-tight text-charcoal">
                  Matematyka
                </p>
                <p className="font-geist-mono text-[11px] text-steel">
                  100 minut · 25 punktów
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-[11px] font-semibold text-charcoal">
                      Zadanie 1. <span className="font-normal text-fog">(0–1)</span>
                    </p>
                    <Flag className="size-3 text-silver" />
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-paper-mist" />
                  <div className="h-1.5 w-4/5 rounded-full bg-paper-mist" />
                  <div className="mt-2 flex gap-1.5">
                    {["P", "F"].map((letter) => (
                      <span
                        key={letter}
                        className="rounded-[6px] border border-smoke px-2 py-0.5 font-geist-mono text-[10px] text-fog"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-ash bg-white px-3 py-1.5 text-[11px] font-medium text-charcoal shadow-md">
                <AlarmClock className="size-3 text-tangerine" />
                <span className="font-geist-mono tabular-nums">98:42</span>
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
