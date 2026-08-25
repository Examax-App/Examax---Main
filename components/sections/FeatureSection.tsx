import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { FeatureTriad } from "@/components/sections/FeatureTriad";

export type SubFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/**
 * The reference's product-feature block: a tight left-aligned intro with a
 * right-hand payload card (no dead columns), a showcase panel on the paper
 * surface, then the interactive three-column feature row (see FeatureTriad).
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
  aside,
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
  /** Right-hand header payload — a compact metric/mini-visual card. */
  aside?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="overflow-clip border-t border-ash bg-white"
    >
      <Container className="pb-10 pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-steel">
              <AccentTile icon={eyebrowIcon} accent={accent} size="sm" />
              {eyebrowLabel}
            </p>
            <h2
              id={`${id}-heading`}
              className="mt-5 max-w-2xl font-satoshi text-heading-lg font-medium leading-[1.15] text-charcoal sm:text-display sm:leading-[1.15]"
            >
              {heading}
            </h2>
            <p className="mt-4 max-w-xl text-body-xl text-fog">{sub}</p>
            <Button href="#cennik" variant="outline" className="mt-6">
              {ctaLabel}
            </Button>
          </Reveal>
          {aside ? (
            <Reveal delay={120} className="hidden py-2 lg:block">
              {aside}
            </Reveal>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-ash bg-[#fafafa]">
        <Container className="py-12">
          <Reveal>{showcase}</Reveal>
          <FeatureTriad
            accent={accent}
            initialIndex={highlightIndex}
            items={subFeatures.map((feature) => ({
              title: feature.title,
              description: feature.description,
              iconNode: (
                <feature.icon className="size-5" strokeWidth={1.8} aria-hidden />
              ),
            }))}
          />
        </Container>
      </div>
    </section>
  );
}
