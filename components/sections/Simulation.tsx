import { AlarmClock, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SimulationShowcase } from "@/components/mockups/SimulationShowcase";

const pillars = [
  {
    icon: FileText,
    title: "Format 1:1 z arkuszem",
    description: "Te same typy zadań, polecenia i punktacja, co na egzaminie.",
  },
  {
    icon: AlarmClock,
    title: "Czas jak na sali",
    description: "Licznik ustawiony dokładnie tak, jak w dniu egzaminu.",
  },
  {
    icon: Gauge,
    title: "Raport gotowości",
    description: "Po symulacji wiesz, które tematy jeszcze dopracować.",
  },
];

/**
 * Product-vision section for the upcoming exam simulation mode: centered
 * intro over the dotted texture, the exam-sheet mockup, then a calm
 * three-cell pillar row. Honest framing — badged as "in preparation".
 */
export function Simulation() {
  return (
    <section
      id="symulacja"
      aria-labelledby="symulacja-heading"
      className="relative overflow-hidden border-t border-ash bg-paper-mist/60"
    >
      <div className="bg-dots mask-fade-edges absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 text-[12px] font-semibold text-charcoal shadow-subtle">
              <span className="size-2 rounded-full bg-tangerine" aria-hidden />
              Wkrótce · Examax Premium
            </p>
            <h2
              id="symulacja-heading"
              className="mt-6 font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
            >
              Przećwicz egzamin, zanim będzie się liczył
            </h2>
            <p className="mt-5 text-body-xl text-steel">
              Pracujemy nad pełną symulacją: arkusz w egzaminacyjnym formacie,
              czas liczony jak na sali i raport gotowości po zakończeniu. Bez
              presji, na spokojnie — za to z konkretną informacją, co jeszcze
              dopracować.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-14 sm:mt-16">
          <SimulationShowcase />
        </Reveal>

        <Reveal delay={100} className="mt-16 sm:mt-20">
          <div className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-largecards border border-ash bg-ash sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white p-6">
                <pillar.icon
                  className="size-5 text-vivid-green"
                  strokeWidth={1.8}
                  aria-hidden
                />
                <h3 className="mt-3 text-body-lg font-semibold text-charcoal">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-body text-steel">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Button href="#faq" variant="outline">
              Dowiedz się, kiedy startujemy
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
