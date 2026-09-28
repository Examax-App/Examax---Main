import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { plans } from "@/lib/pricing";

/**
 * The price, stated before the closing CTA.
 *
 * A reader who has come this far has one question left and it is "ile to
 * kosztuje". Sending them to the footer to find out loses them; so does a full
 * pricing table this late. Three chips and a link is the whole answer.
 *
 * Shared by every product page — only the framing sentence changes, which is
 * why it arrives as props rather than being written here.
 *
 * Figures come from `lib/pricing.ts` rather than being retyped, so the teaser
 * cannot drift from /pricing. Enterprise is dropped: it is a school-district
 * conversation, not a training-page one.
 */
const teaserPlans = plans.filter((plan) => plan.monthly !== null);

export function PricingTeaser({
  heading,
  sub,
}: {
  heading: string;
  sub: string;
}) {
  return (
    <section
      aria-labelledby="price-heading"
      className="col-rules border-t border-ash bg-canvas-muted"
    >
      <Container className="py-16">
        <Reveal>
          <div className="rounded-largecards border border-ash bg-white p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                {/* One step below SECTION_H2: this band winds the page down
                    into the closing CTA, and a full 48px heading here would
                    compete with the CTA rather than lead into it. */}
                <h2
                  id="price-heading"
                  className={cn(
                    "max-w-md text-pretty font-satoshi text-3xl font-medium text-charcoal sm:text-heading-lg",
                  )}
                >
                  {heading}
                </h2>
                <p className="mt-3 max-w-md text-body-lg text-fog">{sub}</p>
              </div>

              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {teaserPlans.map((plan) => (
                  <li key={plan.name}>
                    <div
                      className={cn(
                        "rounded-cards border px-4 py-3 text-center",
                        plan.highlight
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-ash bg-white",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[12px] font-medium",
                          plan.highlight ? "text-white/70" : "text-fog",
                        )}
                      >
                        {plan.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 font-geist-mono text-body-lg leading-none tabular-nums",
                          plan.highlight ? "text-white" : "text-charcoal",
                        )}
                      >
                        {plan.monthly} zł
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ash pt-6">
              <Button href="/signup" variant="primary">
                Zacznij za darmo
              </Button>
              <Button href="/pricing" variant="outline">
                Zobacz pełny cennik
              </Button>
              <Link
                href="/contact"
                className="link-underline ml-auto inline-flex items-center gap-1 text-body font-medium text-steel"
              >
                Jesteś szkołą? Napisz do nas
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
