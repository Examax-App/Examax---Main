import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";
import { Reveal } from "@/components/ui/Reveal";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { FeatureTriad } from "@/components/sections/FeatureTriad";
import { FeatureStage } from "@/components/sections/FeatureStage";
import type { IconComponent } from "@/lib/icon";

export type SubFeature = {
  icon: IconComponent;
  title: string;
  description: string;
};

/**
 * The reference's product-feature block: a left-aligned intro that deliberately
 * leaves its right column empty, a grey demo band where the product window is
 * cut flush by the band's bottom edge, then the interactive three-column
 * feature row (see FeatureTriad).
 */
export function FeatureSection({
  id,
  accent,
  eyebrowIcon,
  eyebrowLabel,
  eyebrowBadge,
  heading,
  wideHeading = false,
  sub,
  ctaLabel,
  ctaHref = "/pricing",
  showcase,
  showcases,
  subFeatures,
  highlightIndex = 0,
}: {
  id: string;
  accent: Accent;
  /** Left out, the eyebrow is its label alone, starting where the chip would. */
  eyebrowIcon?: IconComponent;
  eyebrowLabel: string;
  /** A mark after the label, such as the Pro badge on a paid feature. */
  eyebrowBadge?: React.ReactNode;
  heading: string;
  /** A long heading gets a wider measure, so it sets in three lines or fewer instead of stacking. */
  wideHeading?: boolean;
  sub: string;
  ctaLabel: string;
  /** Where the intro's button goes; the product sections default to pricing. */
  ctaHref?: string;
  showcase?: React.ReactNode;
  /**
   * One picture per sub-feature, in the same order. When given, the band
   * swaps its picture with the strip below instead of showing `showcase`.
   */
  showcases?: [React.ReactNode, React.ReactNode, React.ReactNode];
  /**
   * Left out, the band is the picture alone — no strip beneath it — for a
   * picture that is a whole product on its own (the agent window).
   */
  subFeatures?: [SubFeature, SubFeature, SubFeature];
  highlightIndex?: 0 | 1 | 2;
}) {
  const triadItems = (subFeatures ?? []).map((feature) => ({
    title: feature.title,
    description: feature.description,
    iconNode: <feature.icon className="size-4" strokeWidth={2} aria-hidden />,
    // Each sub-feature's "Dowiedz się więcej" leads where the section's own button does.
    href: ctaHref,
  }));
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="pb-20 pt-20">
          <Reveal>
            {/* leading-5 matches the chip's own height, so the eyebrow's
                text sits on the chip's centre line rather than above it. A
                div, not a p: a badge after the label may render block
                elements (the Pro mark's metal pill does). */}
            <div className="flex items-center gap-2.5 text-[12px] font-medium leading-5 text-steel">
              {eyebrowIcon && <AccentTile icon={eyebrowIcon} accent={accent} size="sm" />}
              {eyebrowLabel}
              {eyebrowBadge}
            </div>
            <h2
              id={`${id}-heading`}
              className={cn("mt-3 text-charcoal", wideHeading ? "max-w-3xl" : "max-w-lg", SECTION_H2)}
            >
              {heading}
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-body-xl text-fog">
              {sub}
            </p>
            <Button href={ctaHref} variant="outline" size="lg" className="mt-8">
              {ctaLabel}
            </Button>
          </Reveal>
        </Container>
      </div>

      {/* Demo band: the product window sits top-aligned so the band's bottom
          edge cuts it flush (reference), with the feature strip below it on
          the same grey surface. */}
      <div className="col-rules border-t border-ash bg-[#fafafa]">
        {showcases ? (
          <FeatureStage showcases={showcases} items={triadItems} initialIndex={highlightIndex} />
        ) : !subFeatures ? (
          <div className="px-5 py-14 sm:px-8">
            <Reveal className="w-full">{showcase}</Reveal>
          </div>
        ) : (
          <>
            <div className="flex h-[420px] items-start justify-center overflow-hidden px-8 pt-14">
              <Reveal className="w-full">{showcase}</Reveal>
            </div>
            <FeatureTriad initialIndex={highlightIndex} items={triadItems} />
          </>
        )}
      </div>
    </section>
  );
}
