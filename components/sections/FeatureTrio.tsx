import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

export type TrioCard = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** The card's product fragment — see TrainingVisuals. */
  visual: React.ReactNode;
};

/**
 * The reference's product-page workhorse: a centred heading block, a
 * column-width hairline under it, and three hairline-divided cells, each
 * holding a product fragment over a title, a description and one outline
 * action.
 *
 * Measured off `DesignRules/ExporttoFigma _ dub.co _ Dub Partners …png`, where
 * the same block carries "Revenue on autopilot", "Effortless payouts" and
 * "Seamless integration". The cell grid deliberately does NOT sit inside
 * `Container`: the reference's dividers land exactly on the 1080px column
 * rules, and Container's own gutter would inset them.
 *
 * Cards are equal-height and the action is pinned to the bottom (`mt-auto`),
 * so the three buttons line up however long a description runs.
 */
export function FeatureTrio({
  id,
  eyebrow,
  heading,
  sub,
  cards,
}: {
  id: string;
  /** Optional pill above the heading — the reference uses one for its
      plan-gated section and nothing above the rest. */
  eyebrow?: React.ReactNode;
  heading: string;
  sub: string;
  cards: [TrioCard, TrioCard, TrioCard];
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20 text-center">
        <Reveal>
          {eyebrow ? <div className="mb-5">{eyebrow}</div> : null}
          <h2 id={`${id}-heading`} className={cn("text-charcoal", SECTION_H2)}>
            {heading}
          </h2>
          {/* max-w-lg, not max-w-xl: three centred lines under a heading is
              the tell of a template, and the reference caps every one of its
              subheads at two. */}
          <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
            {sub}
          </p>
        </Reveal>
      </Container>

      <div className="border-t border-ash">
        <div className="mx-auto grid w-full max-w-[var(--page-max-width)] divide-y divide-ash sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={index * 80}
              className="flex flex-col p-6 sm:p-8"
            >
              {/* Fixed frame: the fragments inside are cropped by it rather
                  than scaled, which is what keeps their type at product size
                  instead of shrinking to fit. */}
              <div className="h-60 overflow-hidden rounded-cards bg-canvas-muted">
                {card.visual}
              </div>
              <h3 className="mt-6 text-body-lg font-semibold text-charcoal">
                {card.title}
              </h3>
              <p className="mt-2 text-body-lg leading-relaxed text-fog">
                {card.description}
              </p>
              <div className="mt-auto pt-6">
                <Button
                  href={card.ctaHref}
                  variant="outline"
                  size="compare"
                >
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
