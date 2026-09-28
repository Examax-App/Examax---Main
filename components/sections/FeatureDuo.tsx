import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { SECTION_H2 } from "@/lib/type";

export type DuoCard = {
  title: string;
  /** ReactNode rather than string: the reference threads underlined links
      through this copy, and that texture is half of what makes the block
      read as editorial rather than as a caption. */
  description: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
  visual: React.ReactNode;
};

/**
 * The reference's *wide* feature row — two blocks instead of three.
 *
 * Measured off `DesignRules/ExporttoFigma _ dub.co _ Dub Analytics …png` and
 * `… Dub Links …png`, where it carries the pair of features that need a
 * bigger mockup than a third of the column allows. Half the column each, so
 * the product fragment gets ~490px of width and a 288px frame rather than the
 * trio's 240px — enough for a fragment with two panes in it.
 *
 * It exists so a product page can change density between sections. Three
 * identical trios stacked is the tell of a template; the reference alternates
 * wide → narrow → compact, and so should we.
 */
export function FeatureDuo({
  id,
  eyebrowIcon,
  eyebrowLabel,
  accent,
  heading,
  sub,
  cards,
}: {
  id: string;
  /** Optional icon + label above the heading — the reference's own eyebrow. */
  eyebrowIcon?: IconComponent;
  eyebrowLabel?: string;
  accent: Accent;
  heading: string;
  sub: string;
  cards: [DuoCard, DuoCard];
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20 text-center">
        <Reveal>
          {eyebrowIcon && eyebrowLabel ? (
            <p className="mb-5 flex items-center justify-center gap-2.5 text-[12px] font-medium leading-5 text-steel">
              <AccentTile icon={eyebrowIcon} accent={accent} />
              {eyebrowLabel}
            </p>
          ) : null}
          <h2 id={`${id}-heading`} className={cn("mx-auto max-w-xl text-charcoal", SECTION_H2)}>
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
            {sub}
          </p>
        </Reveal>
      </Container>

      <div className="border-t border-ash">
        <div className="mx-auto grid w-full max-w-[var(--page-max-width)] divide-y divide-ash sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={index * 80}
              className="flex flex-col p-6 sm:p-8"
            >
              <div className="h-72 overflow-hidden rounded-cards bg-canvas-muted">
                {card.visual}
              </div>
              <h3 className="mt-6 text-body-lg font-semibold text-charcoal">
                {card.title}
              </h3>
              <p className="mt-2 max-w-md text-body-lg leading-relaxed text-fog">
                {card.description}
              </p>
              <div className="mt-auto pt-6">
                <Button href={card.ctaHref} variant="outline" size="compare">
                  {card.ctaLabel}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
