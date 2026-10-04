import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

export type TrioCard = {
  title: string;
  description: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
  /** The card's product fragment — a picture drawn for its cell. */
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
  variant = "panel",
}: {
  id: string;
  /** Optional pill above the heading — the reference uses one for its
      plan-gated section and nothing above the rest. */
  eyebrow?: React.ReactNode;
  heading: string;
  sub: React.ReactNode;
  cards: [TrioCard, TrioCard, TrioCard];
  /**
   * `panel` frames each fragment in a muted 240px box (the product pages'
   * original look). `open` is dub.co/partners exactly, read off its DOM: the
   * picture stands straight on the page in a 280px band, the header sits on
   * 96px of air, and each cell is 20px of padding round a 32px gap — the
   * pictures carry their own masks, so no box is drawn round them.
   */
  variant?: "panel" | "open";
}) {
  if (variant === "open") {
    return (
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="relative overflow-clip border-b border-ash bg-white px-4"
      >
        <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-24">
          <Reveal className="mx-auto w-full max-w-[560px] px-4 text-center">
            {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
            <h2
              id={`${id}-heading`}
              className="text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-5xl"
            >
              {heading}
            </h2>
            <p className="mt-3 text-pretty text-base text-fog sm:text-lg">{sub}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 border-t border-ash md:grid-cols-3">
            <div className="contents divide-ash max-md:divide-y md:divide-x">
              {cards.map((card, index) => (
                <Reveal key={card.title} delay={index * 80} className="flex flex-col gap-8 p-5">
                  <div className="relative h-[280px] cursor-default select-none overflow-hidden">
                    {card.visual}
                  </div>
                  <div className="relative flex grow flex-col gap-1 text-base sm:pb-3 sm:pl-2.5 sm:pr-1">
                    <h3 className="font-semibold text-slate">{card.title}</h3>
                    <p className="text-fog">{card.description}</p>
                    <a
                      href={card.ctaHref}
                      className="focus-ring mt-3 w-fit whitespace-nowrap rounded-lg border border-smoke bg-white px-3 py-2 text-body font-medium leading-none text-charcoal transition-colors duration-75 hover:bg-canvas-muted active:bg-paper-mist"
                    >
                      {card.ctaLabel}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
