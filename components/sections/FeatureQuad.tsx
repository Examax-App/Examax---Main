import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";

export type QuadCard = {
  icon: IconComponent;
  accent: Accent;
  title: string;
  description: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * The reference's *compact* feature row — four cells, no mockup.
 *
 * The third density in its vocabulary (`… Dub Analytics …png` and
 * `… Dub Links …png` both close their feature stack with one): a small
 * accent-coloured glyph, a title, two lines, and the same outline action. No
 * product fragment at all, which is the point — it is where a page lists the
 * things that are real and worth naming but do not each deserve a screenshot.
 *
 * It also carries no heading of its own. The reference hangs it directly off
 * the row above, sharing that section's heading, which is what keeps a page
 * from picking up a fourth centred title it does not need.
 *
 * The glyph is a bare accent-coloured icon rather than the tinted chip used
 * elsewhere: at this size the chip's 20px tile crowds a 4-across row, and the
 * reference's own compact row is a plain coloured mark.
 */
export function FeatureQuad({
  label,
  cards,
}: {
  /** Screen-reader name for the row, since it has no visible heading. */
  label: string;
  cards: [QuadCard, QuadCard, QuadCard, QuadCard];
}) {
  return (
    <section aria-label={label} className="col-rules border-t border-ash bg-white">
      {/* Hairlines are drawn per cell rather than with `divide-*`, which
          borders children 2..n in DOM order and so paints a rule through the
          middle of a two-column row. Every cell carries its top and left
          edge; the wrapper's overflow crops the outermost pair via the 1px
          negative offset, leaving only the internal rules at every count. */}
      <div className="mx-auto w-full max-w-[var(--page-max-width)] overflow-hidden">
        <div className="-ml-px -mt-px grid sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={index * 60}
              className="flex flex-col border-l border-t border-ash p-6 sm:p-7"
            >
              <card.icon
                className={cn("size-4", accentStyles[card.accent].text)}
                strokeWidth={2}
                aria-hidden
              />
              <h3 className="mt-3 text-body font-semibold text-charcoal">
                {card.title}
              </h3>
              <p className="mt-2 text-body leading-relaxed text-fog">
                {card.description}
              </p>
              <div className="mt-auto pt-5">
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
