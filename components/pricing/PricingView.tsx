"use client";

import { useState } from "react";
import { CompareTable } from "@/components/pricing/CompareTable";
import { EnterpriseBand } from "@/components/pricing/EnterpriseBand";
import { PillToggle } from "@/components/pricing/PillToggle";
import { PlanCards } from "@/components/pricing/PlanCards";
import { Faq } from "@/components/sections/Faq";
import {
  DEFAULT_EXAM,
  RECOMMENDED_PLAN,
  YEARLY_DISCOUNT_NOTE,
  enterprisePlan,
  exams,
  pricingFaqs,
  tierCompareGroups,
  tierPlans,
  type ExamType,
} from "@/lib/pricing";

/** Where a plan sits in the carousel. */
const planIndex = (id: string) => Math.max(0, tierPlans.findIndex((plan) => plan.id === id));

/**
 * Every band of /pricing: hero with the two switches, the plan cards, the
 * Enterprise band, the comparison and the FAQ — dub.co/pricing rebuilt 1:1,
 * minus its testimonial. Free, Pro and Max share the cards row and the
 * comparison; Enterprise stands apart on its own band, as dub's odd plan out
 * does.
 *
 * The frame is dub.co's own on this page, not the landing's: each band is a
 * 1080px box inside a 16px gutter, walled by Ash hairlines. The hero's walls
 * fade in from the top, the cards sit in a closed box, and the comparison's
 * floor runs the full width of the page.
 *
 * State read by more than one band lives here:
 *
 *   exam     "Przygotowujesz się do". Prices never depend on it; it only
 *            picks the recommended plan (RECOMMENDED_PLAN), whose badge and
 *            filled CTA move between cards when it changes.
 *   yearly   off by default: the page opens on monthly prices, with
 *            Egzamin ósmoklasisty as the exam.
 *   index    the plan the small-screen carousel shows, shared by the cards
 *            and every comparison row. It starts on the recommended plan and
 *            follows the recommendation when the exam changes.
 */
export function PricingView({ children }: { children: React.ReactNode }) {
  const [exam, setExam] = useState<ExamType>(DEFAULT_EXAM);
  const [yearly, setYearly] = useState(false);
  const [index, setIndex] = useState(() => planIndex(RECOMMENDED_PLAN[DEFAULT_EXAM]));

  const recommended = RECOMMENDED_PLAN[exam];
  const badgeClassName = exams.find((option) => option.id === exam)?.badgeClassName ?? exams[0].badgeClassName;

  const chooseExam = (next: ExamType) => {
    setExam(next);
    setIndex(planIndex(RECOMMENDED_PLAN[next]));
  };

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="pricing-heading" className="relative overflow-clip bg-white px-4">
        <div className="relative z-0 mx-auto max-w-[1080px] border-b border-ash">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]"
          />
          <div className="relative px-4 pb-8 pt-16 sm:px-8">
            <div className="relative max-w-2xl">{children}</div>

            <div
              style={{ "--delay": "100ms" } as React.CSSProperties}
              className="animate-slide-up-fade [--offset:10px] mt-10 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span aria-hidden className="text-body text-fog">
                  Przygotowujesz się do:
                </span>
                <PillToggle
                  ariaLabel="Do czego się przygotowujesz?"
                  layoutId="pricing-exam"
                  selected={exam}
                  onSelect={chooseExam}
                  options={exams.map((option) => ({
                    value: option.id,
                    label: (
                      <span className="flex items-center gap-2">
                        <option.icon className="size-[1.125rem]" />
                        {/* The full exam name needs a 375px screen; below
                            that it takes its short name. (Under 360px the
                            billing badge steps aside too; the cards still
                            carry the saving.) */}
                        <span className="text-body font-semibold text-slate max-[374px]:hidden">{option.label}</span>
                        <span className="hidden text-body font-semibold text-slate max-[374px]:inline">
                          {option.shortLabel}
                        </span>
                      </span>
                    ),
                  }))}
                />
              </div>
              <PillToggle
                ariaLabel="Okres rozliczenia"
                layoutId="pricing-billing"
                size="lg"
                selected={yearly ? "yearly" : "monthly"}
                onSelect={(value) => setYearly(value === "yearly")}
                options={[
                  { value: "monthly", label: "Miesięcznie" },
                  {
                    value: "yearly",
                    label: (
                      <>
                        Rocznie
                        <span className="max-w-fit whitespace-nowrap rounded-full border border-blue-200 max-[359px]:hidden bg-linear-to-r from-blue-100 via-blue-100/50 to-blue-100 px-2 py-0 text-xs font-medium text-blue-900">
                          {YEARLY_DISCOUNT_NOTE}
                        </span>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Plan cards ───────────────────────────────────────────────── */}
      <section aria-label="Plany Examax" className="relative overflow-clip bg-white px-4">
        <div className="relative z-0 mx-auto max-w-[1080px] border-x border-b border-ash">
          <PlanCards
            plans={tierPlans}
            recommended={recommended}
            badgeClassName={badgeClassName}
            yearly={yearly}
            index={index}
            onIndexChange={setIndex}
          />
        </div>
      </section>

      {/* ── 3. Enterprise ───────────────────────────────────────────────── */}
      <EnterpriseBand plan={enterprisePlan} />

      {/* ── 4. Compare plans ────────────────────────────────────────────── */}
      <section id="compare" aria-labelledby="compare-heading" className="relative bg-white px-4">
        {/* No overflow clip on this band: it would become the sticky
            header's scroll container and the header would stop pinning. */}
        <div className="relative z-0 mx-auto max-w-[1080px] border-x border-ash">
          <CompareTable
            plans={tierPlans}
            groups={tierCompareGroups}
            recommended={recommended}
            badgeClassName={badgeClassName}
            yearly={yearly}
            index={index}
            onIndexChange={setIndex}
          />
        </div>
      </section>

      {/* ── 5. FAQ ──────────────────────────────────────────────────────── */}
      <Faq items={pricingFaqs} className="col-rules-fade" />
    </>
  );
}
