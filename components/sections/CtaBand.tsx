import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const assurances = [
  { icon: Sparkles, label: "Konto w 2 minuty" },
  { icon: ShieldCheck, label: "Bez karty na start" },
  { icon: Lock, label: "Zgodne z RODO" },
];

/**
 * Closing dark CTA band — near-black surface with the faint grid, a white
 * shelf notch at the top, centered display headline, and assurance row.
 */
export function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-midnight-ink"
    >
      <div className="bg-grid-dark absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 30%, rgba(124,58,237,0.16), transparent 65%), radial-gradient(ellipse 60% 80% at 75% 85%, rgba(124,58,237,0.06), transparent 60%)",
        }}
      />
      <Container className="relative flex flex-col items-center py-24 text-center">
        <Reveal>
          <h2
            id="cta-heading"
            className="max-w-2xl font-satoshi text-heading-lg font-medium leading-[1.15] text-white sm:text-display sm:leading-[1.15]"
          >
            Wejdź na salę ze spokojną głową
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-lg text-body-xl text-silver">
            Załóż darmowe konto, zobacz swoją roadmapę i zrób dziś pierwszy
            krok do dobrego wyniku.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="#cennik" variant="inverted" size="lg">
              Zacznij za darmo
            </Button>
            <Button
              href="#cennik"
              size="lg"
              className="border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
            >
              Zobacz cennik
            </Button>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {assurances.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid size-6 place-items-center rounded-full bg-white/15 text-white"
                >
                  <item.icon className="size-3.5" />
                </span>
                <span className="text-body font-medium text-white/90">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
