import Link from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { SECTION_H2 } from "@/lib/type";

export type StorySteps = Array<{
  icon: IconComponent;
  title: string;
  description: string;
}>;

/**
 * The "where does this come from" band.
 *
 * The reference closes its page with a customer-story card over a photograph.
 * Examax has no photography and will not have any (DESIGN.md), so the card
 * keeps the shape — full-column dark panel, copy anchored bottom-left, one
 * link out — and puts the product's own material in the image slot. That slot
 * arrives as `children` because it is the one part that is genuinely different
 * per product.
 *
 * Under the card, four bordered steps rather than the bare inline link row
 * this band started as: an unbordered link row mid-page reads as a sitemap
 * fragment that leaked in, and the reference never ships one.
 */
export function SourceStory({
  id,
  heading,
  sub,
  eyebrowIcon: EyebrowIcon,
  eyebrow,
  title,
  linkLabel,
  linkHref,
  tint,
  steps,
  children,
}: {
  id: string;
  heading: string;
  sub: string;
  eyebrowIcon: IconComponent;
  eyebrow: string;
  title: string;
  linkLabel: string;
  linkHref: string;
  /** `background-image` for the card's colour tint — see the callers. */
  tint: string;
  steps: StorySteps;
  /** The decorative panel on the card's right, hidden below `lg`. */
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="py-20 text-center">
          <Reveal>
            <h2
              id={`${id}-heading`}
              className={cn("mx-auto max-w-2xl text-charcoal", SECTION_H2)}
            >
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              {sub}
            </p>
          </Reveal>
        </Container>
      </div>

      <div className="col-rules border-t border-ash bg-canvas-muted">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-5 py-14 sm:px-10">
          <Reveal>
            <article className="relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-largecards bg-charcoal p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: tint }}
              />
              {/* The design-system dot texture, restated in white — `.bg-dots`
                  is drawn in ink for light surfaces and disappears on this
                  one. Same grid, same weight, inverted colour. */}
              <div
                aria-hidden
                className="mask-fade-edges pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255, 255, 255, 0.14) 1.1px, transparent 1.1px)",
                  backgroundSize: "15px 15px",
                }}
              />
              {children}

              <div className="relative max-w-lg">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80">
                  <EyebrowIcon className="size-3.5" strokeWidth={1.8} aria-hidden />
                  {eyebrow}
                </p>
                <h3 className="mt-5 text-pretty font-satoshi text-heading-sm font-medium leading-tight text-white sm:text-heading">
                  {title}
                </h3>
                <Link
                  href={linkHref}
                  className="link-underline mt-6 inline-flex items-center gap-1.5 text-body-lg font-medium text-white"
                >
                  {linkLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-cards border border-ash bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <step.icon
                      className="size-4 shrink-0 text-steel"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                    <p className="text-body font-semibold text-charcoal">
                      {step.title}
                    </p>
                    <span className="ml-auto font-geist-mono text-[11px] text-silver tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-snug text-fog">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
