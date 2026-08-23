import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/* PLACEHOLDER FIGURES — replace with real product numbers before launch. */
const figures = [
  { label: "Zadań z arkuszy CKE", value: "18 420" },
  { label: "Rozwiązanych zadań", value: "2 934 118" },
  { label: "Godzin nauki w Examax", value: "146 275" },
];

/**
 * The reference's "Built to scale" band: grey surface, editorial column on the
 * left, oversized Geist Mono figures in tangerine under uppercase micro-labels.
 */
export function Stats() {
  return (
    <section
      aria-labelledby="skala-heading"
      className="col-rules border-t border-ash bg-[#fafafa]"
    >
      <Container className="grid gap-12 py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2
            id="skala-heading"
            className="max-w-sm font-satoshi text-heading-lg font-medium leading-[1.1] text-charcoal"
          >
            Zbudowane na prawdziwym materiale
          </h2>
          <p className="mt-4 max-w-sm text-body-lg text-steel">
            Każde zadanie w Examax pochodzi z arkuszy i wymagań CKE — nie z
            generatora. Baza rośnie z każdą sesją egzaminacyjną.
          </p>
          <Button href="#cennik" variant="outline" size="lg" className="mt-8">
            Zacznij za darmo
          </Button>
        </Reveal>

        <Reveal delay={100}>
          <dl className="space-y-8">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt className="text-[12px] font-medium uppercase tracking-[0.1em] text-steel">
                  {figure.label}
                </dt>
                <dd className="mt-1.5 font-geist-mono text-[32px] leading-none tracking-tight text-tangerine tabular-nums sm:text-[40px]">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
