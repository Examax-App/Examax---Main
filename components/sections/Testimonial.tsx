import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Full-width quote band over the dotted texture.
 *
 * Honesty rules: no invented logos, no stock-silhouette portraits, no named
 * personas until real, consented testimonials exist. Attribution is an
 * anonymised, truthful label (e.g. "Uczennica, 8. klasa · Wrocław").
 *
 * TODO: replace the placeholder quotes with real beta-user quotes (with
 * consent) — ideally specific ("z 62% na 84% w trzy miesiące").
 */
export function Testimonial({
  quote,
  attribution,
  context,
}: {
  quote: React.ReactNode;
  attribution: string;
  context?: string;
}) {
  return (
    <section
      aria-label={`Opinia: ${attribution}`}
      className="relative overflow-hidden border-t border-ash bg-white"
    >
      <div className="bg-dots mask-fade-edges absolute inset-0" aria-hidden />
      <Container className="relative py-24">
        <Reveal>
          <figure className="mx-auto max-w-3xl">
            <blockquote className="text-heading-sm font-normal leading-[1.38] text-graphite sm:text-heading">
              &bdquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-pebble" />
              <span className="text-body-lg font-medium text-charcoal">
                {attribution}
              </span>
              {context ? (
                <span className="text-body text-fog">· {context}</span>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
