import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { GLOW_LAYER, GLOW_LAYER_DEEP, baseGlow, bottomGlow } from "@/lib/glow";
import { plans, priceFor } from "@/lib/pricing";

type TierGlow = {
  /** The gradient itself — {@link bottomGlow} or {@link baseGlow}. */
  image: string;
  /** Rest/hover opacities: {@link GLOW_LAYER} or {@link GLOW_LAYER_DEEP}. */
  layer: string;
};

/**
 * Per-tier tint, and the one place the tiers are ranked by weight.
 *
 * Both colours are already this page's own: Lavender is what the Pro card
 * wears on its "Polecany" badge, so the glow is that same accent rather than a
 * second chromatic colour on one component (DESIGN.md's Don'ts), and Midnight
 * Ink is the palette's near-black, which reads as weight rather than as hue.
 *
 * The ladder those two build is the point:
 *
 *   Free        no tint — the plain surface
 *   Enterprise  ink, pulled back and held low; a custom quote rather than a
 *               rung above Max, so it stays the quietest of the tinted three
 *   Pro         lavender at the shared strength — the recommended tier
 *   Max         solid ink, deep layer, pooled at the base. The top tier has to
 *               out-weigh the one below it, and near-black at Pro's opacity
 *               does not: an achromatic wash is pure luminance and settles
 *               into haze where a hue still reads as colour.
 */
const TIER_GLOW: Record<string, TierGlow> = {
  Pro: { image: bottomGlow("var(--color-lavender)"), layer: GLOW_LAYER },
  Max: {
    image: baseGlow("var(--color-midnight-ink)"),
    layer: GLOW_LAYER_DEEP,
  },
  Enterprise: {
    image: bottomGlow(
      "color-mix(in oklab, var(--color-midnight-ink) 72%, transparent)",
    ),
    layer: GLOW_LAYER,
  },
};

/**
 * The hairlines between cards, drawn inset rather than full-bleed.
 *
 * A `gap-px` weld runs every rule corner to corner, so the four tiers read as
 * one slab crossed by a plus sign. Holding each rule 24px short of the panel's
 * edges breaks that cross open: the cards still share one bordered, rounded
 * container — still merged — but each one now closes on its own whitespace.
 */
const RULE_TOP =
  "after:absolute after:inset-x-6 after:top-0 after:h-px after:bg-ash after:content-['']";
const RULE_LEFT =
  "sm:before:absolute sm:before:inset-y-6 sm:before:left-0 sm:before:w-px sm:before:bg-ash sm:before:content-['']";

/**
 * The four plan cards, on a 2×2 grid: Free and Pro above, Max and Enterprise
 * below.
 *
 * One bordered panel split by hairlines rather than four detached cards. The
 * rules are inset rather than full-bleed (see RULE_TOP / RULE_LEFT), so the
 * four tiers stay merged inside a single frame without welding into one slab.
 *
 * Card anatomy is the reference frame's (Figma `105:2035`), measured off it
 * rather than approximated:
 *
 *   card    white, 8px padding, hairline-divided from its neighbours
 *   header  224px tall, #f5f5f5 fill, 12px radius, 24/20/20 padding, lifted by
 *           a 1px rgba(229,229,229,0.7) ring, contents spread top-to-bottom so
 *           the CTA sits on the card's own baseline
 *   name    Inter 500, 20px on a 20px line, #262626
 *   price   Inter 500, 16px on a 16px line, #404040, period after it at 14px
 *   blurb   Inter 400, 14px on a 22.75px line, #525252
 *   list    20px inset, 20px above and 28px below, 12px between rows; 16px
 *           glyph, 12px from its 14px #525252 label
 */
export function PlanCards({ yearly }: { yearly: boolean }) {
  return (
    <div className="grid overflow-hidden rounded-largecards border border-ash bg-white sm:grid-cols-2">
      {plans.map((plan, index) => {
        const price = priceFor(plan, yearly);
        const glow = TIER_GLOW[plan.name];

        // One column below `sm`, two above it, so which neighbours a card has
        // — and therefore which rules it draws — changes at the breakpoint.
        const rules = cn(
          index > 0 && RULE_TOP,
          // Stacked, Pro follows Free; side by side, it sits beside it.
          index > 0 && index < 2 && "sm:after:hidden",
          index % 2 === 1 && RULE_LEFT,
        );

        return (
          <Reveal key={plan.name} delay={index * 60} className="flex bg-white">
            <article
              aria-label={`Plan ${plan.name}`}
              className={cn(
                "group relative isolate flex h-full w-full flex-col p-2",
                rules,
              )}
            >
              {/* The reference's card light: a tint rising from the bottom
                  edge, barely there at rest and lifted on hover. Free carries
                  none — it keeps the plain surface. */}
              {glow ? (
                <span
                  aria-hidden
                  className={glow.layer}
                  style={{ backgroundImage: glow.image }}
                />
              ) : null}

              {/* Tinted header block: name, price, blurb, CTA. Fixed 224px so
                  the CTAs share one baseline across the row regardless of how
                  long each blurb runs. */}
              <div className="flex h-[224px] flex-col justify-between rounded-cards bg-paper-mist px-5 pb-5 pt-6 shadow-[0px_0px_0px_1px_rgba(229,229,229,0.7)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[20px] font-medium leading-[20px] text-graphite">
                      {plan.name}
                    </h3>
                    {plan.highlight ? (
                      <span className="rounded-full bg-[#ddd6fe] px-2 py-1.5 text-[8px] font-semibold uppercase leading-[8px] text-[#4c1d95]">
                        Polecany
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1">
                    {/* Keyed on the period so React remounts the figure and
                        the zoom replays when the switch is thrown. */}
                    <span
                      key={String(yearly)}
                      className="animate-price-swap inline-block text-[16px] font-medium leading-[16px] text-slate"
                    >
                      {price === null ? "Wycena" : `${price} zł`}
                    </span>{" "}
                    <span className="text-body font-medium text-fog">
                      {plan.priceNote}
                    </span>
                  </p>
                </div>

                <p className="text-body leading-[22.75px] text-steel">
                  {plan.description}
                </p>

                <Button
                  href={plan.cta.href}
                  variant={plan.cta.variant}
                  size="card"
                  className="w-full"
                >
                  {plan.cta.label}
                </Button>
              </div>

              <div className="flex flex-1 flex-col gap-3 px-5 pb-7 pt-5">
                <h4 className="text-body font-semibold text-graphite">
                  {plan.featuresHeading}
                </h4>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-body text-steel"
                    >
                      <feature.icon
                        className="size-4 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
