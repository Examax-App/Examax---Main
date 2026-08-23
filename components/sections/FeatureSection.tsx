import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";
import { Reveal } from "@/components/ui/Reveal";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { FeatureTriad } from "@/components/sections/FeatureTriad";

export type SubFeature = {
  icon: LucideIcon;
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
  heading,
  sub,
  ctaLabel,
  showcase,
  subFeatures,
  highlightIndex,
}: {
  id: string;
  accent: Accent;
  eyebrowIcon: LucideIcon;
  eyebrowLabel: string;
  heading: string;
  sub: string;
  ctaLabel: string;
  showcase: React.ReactNode;
  subFeatures: [SubFeature, SubFeature, SubFeature];
  highlightIndex: 0 | 1 | 2;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="pb-20 pt-20">
          <Reveal>
            <p className="flex items-center gap-2 text-[12px] font-medium leading-4 text-steel">
              <AccentTile icon={eyebrowIcon} accent={accent} size="sm" />
              {eyebrowLabel}
            </p>
            <h2
              id={`${id}-heading`}
              className={cn("mt-3 max-w-lg text-charcoal", SECTION_H2)}
            >
              {heading}
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-body-xl text-fog">
              {sub}
            </p>
            <Button href="#pricing" variant="outline" size="lg" className="mt-8">
              {ctaLabel}
            </Button>
          </Reveal>
        </Container>
      </div>

      {/* Demo band: the product window sits top-aligned so the band's bottom
          edge cuts it flush (reference), with the feature strip below it on
          the same grey surface. */}
      <div className="col-rules border-t border-ash bg-[#fafafa]">
        <div className="flex h-[420px] items-start justify-center overflow-hidden px-8 pt-14">
          <Reveal className="w-full">{showcase}</Reveal>
        </div>
        <FeatureTriad
          initialIndex={highlightIndex}
          items={subFeatures.map((feature) => ({
            title: feature.title,
            description: feature.description,
            iconNode: (
              <feature.icon className="size-4" strokeWidth={1.8} aria-hidden />
            ),
          }))}
        />
      </div>
    </section>
  );
}
