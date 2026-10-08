"use client";

import NumberFlow from "@number-flow/react";
import { motion, useReducedMotion } from "motion/react";
import { PlanStepper, PricingCta } from "@/components/pricing/Cta";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/hooks";
import { priceFor, yearlySaving, type Plan } from "@/lib/pricing";

/** Złoty with no decimals — "49 zł". The digits roll when the figure changes. */
export const PRICE_FORMAT = { style: "currency", currency: "PLN", maximumFractionDigits: 0 } as const;
export const PRICE_LOCALE = "pl-PL";

/** The words after a price: the period it covers, or "na zawsze" for Free. */
export function periodLabel(plan: Plan, yearly: boolean) {
  if (plan.monthly === 0) return "na zawsze";
  return yearly ? "/ rok" : "/ miesiąc";
}

/**
 * The carousel that the plan cards and every comparison row share.
 *
 * From `lg` it is a plain grid, one column per plan. Below it the reference
 * lays the columns out side by side, each a full container wide with 32px
 * between them, and slides the strip by `--index` columns, so the cards and
 * the table always show the same plan. `100cqw` needs the parent to be an
 * inline-size container.
 */
export const PLAN_STRIP =
  "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] max-lg:w-[calc(var(--cols)*100cqw+(var(--cols)-1)*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform max-lg:duration-300 max-lg:ease-out motion-reduce:transition-none";

export function stripStyle(cols: number, index: number) {
  return { "--cols": cols, "--index": index } as React.CSSProperties;
}

/**
 * The "Polecany" badge. Only the recommended plan renders it, and every copy
 * in one row shares a `layoutId`, so when the exam changes the badge glides
 * from its old plan to the new one instead of blinking out and back in. Its
 * colour is the chosen exam's.
 */
export function RecommendedBadge({ layoutId, className }: { layoutId: string; className: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      layoutId={layoutId}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.45 }}
      className={cn(
        "w-fit whitespace-nowrap rounded-full px-2 py-1.5 text-center text-[0.5rem] font-semibold uppercase leading-none transition-colors duration-300",
        className,
      )}
    >
      Polecany
    </motion.span>
  );
}

/**
 * The plan cards — dub.co/pricing's, measured off the live page:
 *
 *   column  white, 8px padding, hairline between columns from `lg`
 *   header  Paper Mist, 12px radius, 24/20/20 padding, a 1px Ash ring at 70%;
 *           contents spread top to bottom. 240px rather than dub.co's 224px,
 *           to make room for the yearly saving under the price.
 *   name    Inter 500, 20px on a 20px line, Graphite
 *   price   Inter 500, 16px, Slate, rolling digits; the period after it at
 *           14px in Charcoal at half strength
 *   blurb   14px on a 22.75px line, Steel
 *   list    20px inset, 20px above, 28px below, 12px between rows; 16px glyph
 *           12px from its 14px Steel label, dotted underline where a tooltip
 *           explains the feature
 *
 * One set of plans for every exam: the exam only moves `recommended`, which
 * carries the badge and the one filled CTA. Each column rises in on the
 * page's slide-up-fade, 100ms apart.
 */
export function PlanCards({
  recommended,
  badgeClassName,
  yearly,
  index,
  onIndexChange,
  plans,
}: {
  plans: Plan[];
  recommended: Plan["id"];
  badgeClassName: string;
  yearly: boolean;
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const cols = plans.length;

  return (
    <div className="overflow-x-hidden [container-type:inline-size]">
      <div
        style={stripStyle(cols, index)}
        className={cn(PLAN_STRIP, "overflow-hidden lg:[&>*:not(:last-child)]:border-r lg:[&>*:not(:last-child)]:border-ash")}
      >
        {plans.map((plan, planIndex) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            recommended={plan.id === recommended}
            badgeClassName={badgeClassName}
            yearly={yearly}
            active={planIndex === index}
            delay={(planIndex + 1) * 100}
            previous={planIndex > 0 ? () => onIndexChange(planIndex - 1) : undefined}
            next={planIndex < cols - 1 ? () => onIndexChange(planIndex + 1) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  recommended,
  badgeClassName,
  yearly,
  active,
  delay,
  previous,
  next,
}: {
  plan: Plan;
  recommended: boolean;
  badgeClassName: string;
  yearly: boolean;
  active: boolean;
  delay: number;
  previous?: () => void;
  next?: () => void;
}) {
  const price = priceFor(plan, yearly);
  // Below `lg` only the active card is on screen; the others are hidden from
  // pointer, keyboard and screen reader alike until they are stepped to.
  const hidden = useMediaQuery("(max-width: 1023.98px)") && !active;

  return (
    <article
      aria-label={`Plan ${plan.name}${recommended ? ", polecany" : ""}`}
      inert={hidden || undefined}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
      className={cn(
        "animate-slide-up-fade [--offset:10px] relative top-0 flex h-full flex-col bg-white p-2 max-lg:transition-opacity",
        !active && "max-lg:pointer-events-none max-lg:opacity-0",
      )}
    >
      <div className="flex h-60 flex-col justify-between rounded-cards bg-paper-mist p-5 pt-6 ring-1 ring-ash/70">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-medium leading-none text-graphite">{plan.name}</h2>
            {recommended ? <RecommendedBadge layoutId="plan-card-recommended" className={badgeClassName} /> : null}
          </div>
          <div className="relative mt-1">
            {price === null ? (
              <span className="block text-body-lg font-medium text-slate">Indywidualna wycena</span>
            ) : (
              <div>
                <NumberFlow
                  value={price}
                  format={PRICE_FORMAT}
                  locales={PRICE_LOCALE}
                  className="text-body-lg font-medium tabular-nums text-slate"
                />{" "}
                <span className="text-body font-medium text-charcoal/50">{periodLabel(plan, yearly)}</span>
              </div>
            )}
          </div>
          <YearlySaving plan={plan} yearly={yearly} />
        </div>

        <p className="text-body leading-relaxed text-steel">{plan.description}</p>

        <div className="flex gap-3">
          <PlanStepper direction="previous" placement="card" disabled={!previous} onClick={() => previous?.()} />
          <PricingCta href={plan.cta.href} primary={recommended} placement="card">
            {plan.cta.label}
          </PricingCta>
          <PlanStepper direction="next" placement="card" disabled={!next} onClick={() => next?.()} />
        </div>
      </div>

      <div className="flex grow flex-col gap-3 px-5 pb-7 pt-5 text-body">
        <h3 className="font-semibold text-graphite">{plan.featuresHeading}</h3>
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature.label} className="flex items-center gap-3 text-steel">
              <feature.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
              {feature.tip ? (
                <Tooltip content={feature.tip} className="underline decoration-dotted underline-offset-2">
                  {feature.label}
                </Tooltip>
              ) : (
                <p>{feature.label}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * The yearly saving, one line under the price: "Oszczędzasz 98 zł (17%)".
 * Shown only while yearly billing is on; "2 miesiące gratis" lives on the
 * billing switch alone.
 *
 * The line's slot is reserved on every card in both periods, so throwing the
 * switch never shifts a card's blurb or CTA; the line only fades and rises in.
 */
function YearlySaving({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const saving = yearlySaving(plan);

  return (
    <div className="mt-2 h-4">
      {saving && yearly ? (
        <p
          // Inline: .animate-slide-up-fade is unlayered CSS and would outrank
          // a utility class for the duration.
          style={{ animationDuration: "0.4s" }}
          className="animate-slide-up-fade [--offset:4px] text-xs text-fog"
        >
          Oszczędzasz <strong className="font-medium text-slate">{saving.amount} zł</strong> ({saving.percent}%)
        </p>
      ) : null}
    </div>
  );
}
