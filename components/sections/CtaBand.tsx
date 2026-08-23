import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/* PLACEHOLDER RATINGS — swap for real store/review figures before launch. */
const ratings = [
  { source: "App Store", initial: "A", stars: 5 },
  { source: "Google Play", initial: "G", stars: 5 },
  { source: "Opinie uczniów", initial: "O", stars: 4.5 },
];

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.min(1, Math.max(0, value - index));
        return (
          <svg key={index} viewBox="0 0 20 20" className="size-3.5">
            <defs>
              <linearGradient id={`star-${index}-${value}`}>
                <stop offset={`${fill * 100}%`} stopColor="#ffffff" />
                <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.25)" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.5 5.3 5.6.8-4 4 .9 5.7L10 14.7 5 17.4l1-5.7-4.1-4 5.6-.8L10 1.6z"
              fill={`url(#star-${index}-${value})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

/**
 * Closing CTA band. Full-bleed near-black with no texture — the reference
 * keeps this surface completely flat — cut at the top by a wide scallop where
 * the content column meets the band, and closed by a row of rating badges.
 */
export function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="col-rules relative bg-charcoal [--rule:rgb(255_255_255/0.06)]"
    >
      {/* Scallop: the white column plateaus over the band, with a concave
          fillet joining it back to the full-bleed dark on either side. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[2] flex justify-center"
      >
        <div className="relative h-14 w-full max-w-[var(--page-max-width)] rounded-b-[28px] bg-white">
          <span className="absolute right-full top-0 size-7 bg-[radial-gradient(circle_at_0_0,transparent_0_28px,#fff_28px)]" />
          <span className="absolute left-full top-0 size-7 bg-[radial-gradient(circle_at_100%_0,transparent_0_28px,#fff_28px)]" />
        </div>
      </div>

      <Container className="relative z-[3] flex flex-col items-center pb-24 pt-32 text-center">
        <Reveal>
          <h2
            id="cta-heading"
            className="max-w-2xl font-satoshi text-heading-lg font-medium leading-[1.1] text-white sm:text-display"
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
            <Button href="#cennik" variant="translucent" size="lg">
              Zobacz cennik
            </Button>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {ratings.map((rating) => (
              <li key={rating.source} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="grid size-6 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-white/80"
                >
                  {rating.initial}
                </span>
                <Stars value={rating.stars} />
                <span className="sr-only">
                  {rating.source}: {rating.stars} na 5
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
