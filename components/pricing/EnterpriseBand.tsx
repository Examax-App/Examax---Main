import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { enterpriseOffer, type Plan } from "@/lib/pricing";
import { SECTION_H2 } from "@/lib/type";

/**
 * Enterprise, set apart from the three plans: a ruled strip under the
 * cards carrying the small print on VAT, then a block of its own in the page's section pattern (the landing's
 * feature intros) — an icon eyebrow, a Satoshi heading, a subheading and a
 * paragraph over the call to action, and beside it what a school gets, on
 * the plan cards' grey header surface so it still belongs to the pricing.
 */
export function EnterpriseBand({ plan }: { plan: Plan }) {
  const { subheading, body, listHeading, items } = enterpriseOffer;
  return (
    <section id="enterprise" aria-labelledby="enterprise-heading" className="relative scroll-mt-14 overflow-clip bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[1080px] border-x border-b border-ash">
        {/* The gap between the plans and Enterprise, carrying the price note */}
        <div className="flex h-24 items-center justify-center border-b border-ash px-6">
          <p className="max-w-xl text-pretty text-center text-xs leading-5 text-silver">
            Podane ceny nie zawierają podatku VAT. Ostateczna kwota, z podatkami obowiązującymi w Twoim kraju, zostanie wyświetlona przed zatwierdzeniem płatności.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-16 lg:py-16">
          <Reveal>
            <h2 id="enterprise-heading" className={cn("text-charcoal", SECTION_H2)}>
              {plan.name}
            </h2>
            <p className="mt-3 text-xl font-medium text-slate">{subheading}</p>
            <p className="mt-3 max-w-xl text-pretty text-body-xl text-fog">{body}</p>
            <Button href={plan.cta.href} variant="primary" size="lg" className="mt-8">
              {plan.cta.label}
            </Button>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-cards bg-paper-mist p-6 ring-1 ring-ash/70 sm:p-8">
              <h3 className="text-body font-semibold text-graphite">{listHeading}</h3>
              <ul className="mt-5 flex flex-col gap-4 text-body">
                {items.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-steel">
                    <item.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    <Tooltip content={item.tip} className="underline decoration-dotted underline-offset-2">
                      {item.label}
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
