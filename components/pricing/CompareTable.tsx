"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { PlanStepper, PricingCta } from "@/components/pricing/Cta";
import {
  PLAN_STRIP,
  PRICE_FORMAT,
  PRICE_LOCALE,
  RecommendedBadge,
  periodLabel,
  stripStyle,
} from "@/components/pricing/PlanCards";
import { rich } from "@/components/pricing/rich";
import { AccentTile } from "@/components/ui/FeaturePill";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import {
  exams,
  priceFor,
  type CompareGroup,
  type CompareRow,
  type CompareValue,
  type Plan,
} from "@/lib/pricing";

/**
 * "Porównaj plany" — dub.co/pricing's comparison, read off the live page.
 *
 * There is no feature-name column: every cell names its own feature, ticked
 * where the plan has it and greyed behind a bullet where it does not. The
 * plan header sticks 55px from the top (one pixel under the 56px navbar, so
 * its hairline tucks beneath the bar's), with 1px gaps between the plans
 * that fade up from Ash to nothing, and a 32px white fade under it so rows
 * slide out of sight rather than being cut.
 *
 * Groups fold on their header. The height eases over 300ms on motion's
 * default curve while the rows fade out in 150ms and the chevron turns back
 * — the three timings sampled from dub.co.
 *
 * The recommended plan carries the same gliding badge and filled CTA as the
 * cards above.
 *
 * Below `lg` the header and every group are the same one-plan carousel as
 * the cards above, driven by the same index.
 */
export function CompareTable({
  plans,
  groups,
  recommended,
  badgeClassName,
  yearly,
  index,
  onIndexChange,
}: {
  plans: Plan[];
  groups: CompareGroup[];
  recommended: Plan["id"];
  badgeClassName: string;
  yearly: boolean;
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const cols = plans.length;
  const [closed, setClosed] = useState<string[]>([]);
  const toggle = (heading: string) =>
    setClosed((current) =>
      current.includes(heading) ? current.filter((item) => item !== heading) : [...current, heading],
    );

  return (
    <div className="pt-14">
      <h2
        id="compare-heading"
        className="text-center font-satoshi text-3xl font-medium text-midnight-ink sm:text-heading-lg"
      >
        Porównaj plany
      </h2>

      <div className="sticky top-[55px] z-10 mt-10">
        <div className="border-b border-ash px-px">
          <div className="relative overflow-x-hidden [container-type:inline-size] lg:bg-linear-to-t lg:from-ash">
            <div
              style={stripStyle(cols, index)}
              className={cn(PLAN_STRIP, "relative gap-px overflow-hidden text-body text-graphite")}
            >
              {plans.map((plan, planIndex) => {
                const price = priceFor(plan, yearly);
                const isRecommended = plan.id === recommended;
                return (
                  <div
                    key={plan.name}
                    className={cn(
                      "relative top-0 flex h-full flex-col gap-6 bg-white p-5 max-lg:transition-opacity",
                      planIndex !== index && "max-lg:pointer-events-none max-lg:opacity-0",
                    )}
                  >
                    <div>
                      <div className="flex h-6 items-center gap-2">
                        <h3 className="text-body-lg font-semibold leading-none text-graphite">{plan.name}</h3>
                        {isRecommended ? (
                          <RecommendedBadge layoutId="compare-recommended" className={badgeClassName} />
                        ) : null}
                      </div>
                      <div className="relative mt-0.5 flex h-6 items-center gap-1">
                        {price === null ? (
                          <span className="text-body font-medium text-charcoal">Indywidualnie</span>
                        ) : (
                          <>
                            <NumberFlow
                              value={price}
                              format={PRICE_FORMAT}
                              locales={PRICE_LOCALE}
                              className="text-body font-medium tabular-nums text-slate"
                            />
                            <span className="text-body font-medium text-silver">{periodLabel(plan, yearly)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <PlanStepper
                        direction="previous"
                        placement="compare"
                        disabled={planIndex === 0}
                        onClick={() => onIndexChange(planIndex - 1)}
                      />
                      <PricingCta href={plan.cta.href} primary={isRecommended} placement="compare">
                        {plan.cta.label}
                      </PricingCta>
                      <PlanStepper
                        direction="next"
                        placement="compare"
                        disabled={planIndex === cols - 1}
                        onClick={() => onIndexChange(planIndex + 1)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full ml-px h-8 bg-linear-to-b from-white" />
      </div>

      <div className="flex flex-col">
        {groups.map((group) => (
          <Group
            key={group.heading}
            group={group}
            plans={plans}
            index={index}
            open={!closed.includes(group.heading)}
            onToggle={() => toggle(group.heading)}
          />
        ))}
      </div>
    </div>
  );
}

function Group({
  group,
  plans,
  index,
  open,
  onToggle,
}: {
  group: CompareGroup;
  plans: Plan[];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const panelId = `compare-${group.heading.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full overflow-x-hidden [container-type:inline-size]">
      <div className="flex items-center justify-between border-b border-ash">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-ring group flex grow cursor-pointer items-center gap-2 px-5 pb-4 pt-6 text-left"
        >
          <ChevronRight
            className={cn(
              "size-3 shrink-0 text-silver transition-[transform,color] duration-150 group-hover:text-fog motion-reduce:transition-none",
              open && "rotate-90",
            )}
            strokeWidth={2.5}
            aria-hidden
          />
          <h3 className="text-body-lg font-medium text-black">{group.heading}</h3>
        </button>
        <div className="mr-5 flex items-center gap-2">
          <GroupMark group={group} />
        </div>
      </div>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] }}
        inert={!open || undefined}
        className={cn("overflow-clip transition-opacity duration-150", !open && "opacity-0")}
      >
        <table
          style={stripStyle(plans.length, index)}
          className={cn(PLAN_STRIP, "overflow-hidden text-body text-graphite [&_strong]:font-medium")}
        >
          <thead className="sr-only">
            <tr>
              {plans.map((plan) => (
                <th key={plan.id} scope="col">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="contents">
            {group.rows.map((row) => (
              <tr key={row.label} className="contents [&:last-of-type_td]:border-b-0">
                {row.values.map((value, planIndex) => (
                  <Cell key={plans[planIndex].id} row={row} value={value} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/** Both exams' official marks, or the feature area's chip, at dub.co's 16–18px. */
function GroupMark({ group }: { group: CompareGroup }) {
  const { mark } = group;
  if (mark.kind === "chip") {
    return <AccentTile icon={mark.icon} accent={mark.accent} size="xs" />;
  }
  return exams.map((exam) => <exam.icon key={exam.id} className="size-[1.125rem]" />);
}

function Cell({ row, value }: { row: CompareRow; value: CompareValue }) {
  const included = value !== false;
  const label = rich(typeof value === "string" ? value : row.label);

  return (
    <td className={cn("flex items-center gap-2 border-b border-ash bg-white px-5 py-4", !included && "text-smoke")}>
      {included ? (
        <Check className="size-3 shrink-0 text-fog" strokeWidth={2.5} aria-hidden />
      ) : (
        <>
          <span aria-hidden className="w-3 shrink-0 text-center">
            •
          </span>
          <span className="sr-only">Niedostępne: </span>
        </>
      )}
      {row.tip ? (
        <Tooltip content={row.tip} className="underline decoration-dotted underline-offset-2">
          {label}
        </Tooltip>
      ) : (
        <span>{label}</span>
      )}
    </td>
  );
}
