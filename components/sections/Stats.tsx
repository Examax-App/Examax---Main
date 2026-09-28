import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

/* PLACEHOLDER FIGURES — replace with real product numbers before launch. */
const figures = [
  { label: "Zadań z arkuszy CKE", value: 18420 },
  { label: "Rozwiązanych zadań", value: 2934118 },
  { label: "Godzin nauki w Examax", value: 146275 },
];

/**
 * The reference's counter band: grey surface, editorial column on the left,
 * Geist Mono uppercase micro-labels over oversized figures that count up as
 * they scroll into view.
 */
export function Stats() {
  return (
    <section
      aria-labelledby="scale-heading"
      className="col-rules border-t border-ash bg-canvas-muted"
    >
      <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 id="scale-heading" className={cn("max-w-sm text-charcoal", SECTION_H2)}>
            Zbudowane na prawdziwym materiale
          </h2>
          <p className="mt-3 max-w-sm text-body-lg text-fog">
            Każde zadanie w Examax pochodzi z arkuszy i wymagań CKE — nie z
            generatora. Baza rośnie z każdą sesją egzaminacyjną.
          </p>
          <Button href="#pricing" variant="outline" className="mt-8">
            Zacznij za darmo
          </Button>
        </Reveal>

        <Reveal delay={100}>
          <dl className="space-y-7">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt className="font-geist-mono text-xs uppercase tracking-[0.08em] text-fog">
                  {figure.label}
                </dt>
                <dd className="mt-1.5 font-geist-mono text-[32px] leading-none tracking-tight text-electric-blue tabular-nums sm:text-[40px]">
                  <CountUp value={figure.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
