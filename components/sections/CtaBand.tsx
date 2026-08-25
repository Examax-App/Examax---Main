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
      {/* Warm radial highlight behind the headline */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 58% at 50% 26%, rgba(255,178,120,0.14), transparent 65%), radial-gradient(ellipse 60% 80% at 72% 90%, rgba(255,120,90,0.05), transparent 60%)",
        }}
      />
      {/* Scalloped white notch where the grid rules of the page end */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 rounded-b-full bg-white"
      />
      <Container className="relative flex flex-col items-center py-20 text-center">
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
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {assurances.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5"
              >
                <item.icon className="size-3.5 text-white/70" aria-hidden />
                <span className="text-[13px] text-white/70">{item.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
