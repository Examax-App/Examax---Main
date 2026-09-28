"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  compareGroups,
  plans,
  priceFor,
  type CompareValue,
} from "@/lib/pricing";

/**
 * Plan comparison — the reference's "Compare plans" table (Figma `105:2494`:
 * a 1078px grid whose header band runs 144px tall and sticks 55px from the
 * top, then one collapsible category per feature area).
 *
 * A feature column carries a bold label over a muted explainer, then one
 * column per plan whose cells hold either a value or the included /
 * not-included mark. Groups collapse, which is what keeps a five-category
 * table scannable; they open by default so the page never hides its own
 * answer. The accordion is the same chevron + `aria-expanded` shape the FAQ
 * section uses.
 */

/**
 * Cell contents. An included row gets a bare check — Charcoal, or Electric
 * Blue in the recommended column — beside its value. An absent one gets an
 * em-dash in Silver, which reads as "deliberately not in this plan" where a
 * small dot read as an unfinished cell.
 */
function Cell({
  value,
  featured,
}: {
  value: CompareValue;
  featured: boolean;
}) {
  if (value === false) {
    return (
      <span className="flex items-center gap-2 text-body text-silver">
        <span aria-hidden>—</span>
        <span className="sr-only">Niedostępne</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 text-body text-graphite">
      <Check
        className={cn(
          "size-3 shrink-0",
          featured ? "text-electric-blue" : "text-charcoal",
        )}
        strokeWidth={2}
        aria-hidden
      />
      {typeof value === "boolean" ? (
        <span className="sr-only">W planie</span>
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </span>
  );
}

export function CompareTable({ yearly }: { yearly: boolean }) {
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggle = (heading: string) =>
    setCollapsed((current) =>
      current.includes(heading)
        ? current.filter((item) => item !== heading)
        : [...current, heading],
    );

  return (
    // The scroll container is dropped at `lg`, where the 880px table already
    // fits the 1080px column. It has to be: `overflow-x: auto` computes
    // `overflow-y` to `auto` too, which makes the wrapper the scrollport and
    // pins the sticky header to *it* rather than to the viewport — so the
    // header would never actually stick. Below `lg` the table scrolls
    // sideways and the header simply rides along, which is the right
    // trade at that width.
    //
    // `contain: paint` below `lg` is load-bearing, not decoration: on its own
    // `overflow-x: auto` scrolls the table but still lets the 880px min-width
    // widen the *document's* scroll area, so the whole page slid sideways on
    // a phone. Paint containment is what actually holds the overflow inside
    // this box. It is dropped at `lg` so it cannot clip the sticky header,
    // which from there pins against the viewport instead.
    <div className="overflow-x-auto rounded-largecards border border-ash bg-canvas-white [contain:paint] lg:overflow-x-visible lg:[contain:none]">
      {/* border-separate, not border-collapse: under `collapse` the browser
          owns the borders and drops them from a sticky row as it detaches. */}
      <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left">
        <caption className="sr-only">
          Porównanie planów Examax: Free, Pro, Max i Enterprise
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="z-20 w-[34%] border-b border-ash bg-canvas-white p-5 lg:sticky lg:top-14"
            >
              <span className="sr-only">Funkcja</span>
            </th>
            {plans.map((plan) => {
              const price = priceFor(plan, yearly);
              return (
                <th
                  key={plan.name}
                  scope="col"
                  className={cn(
                    // Sticky only from `lg`, which is exactly where the
                    // wrapper stops being a scroll container. Below that a
                    // sticky row inside a horizontally-scrolling box has
                    // nothing to pin against and widens the page's own scroll
                    // area instead. top-14 == the site header's 56px height.
                    "z-20 border-b border-l border-ash p-5 text-left align-top lg:sticky lg:top-14",
                    plan.highlight ? "bg-paper-mist" : "bg-canvas-white",
                  )}
                >
                  <span className="block text-body-lg font-semibold text-graphite">
                    {plan.name}
                  </span>
                  <span className="mt-0.5 block text-body font-medium text-slate">
                    {price === null ? (
                      "Wycena"
                    ) : (
                      <>
                        {price} zł{" "}
                        <span className="leading-5 text-silver">/ mies</span>
                      </>
                    )}
                  </span>
                  {/* The reference repeats the CTAs here so a reader who has
                      scrolled past the cards can still act on the comparison. */}
                  <Button
                    href={plan.cta.href}
                    variant={plan.cta.variant}
                    size="compare"
                    className="mt-6 w-full"
                  >
                    {plan.cta.label}
                  </Button>
                </th>
              );
            })}
          </tr>
        </thead>

        {compareGroups.map((group) => {
          const open = !collapsed.includes(group.heading);
          const panelId = `compare-${group.heading.replace(/\s+/g, "-")}`;

          return (
            <tbody key={group.heading} id={panelId}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={plans.length + 1}
                  className="border-b border-ash bg-canvas-white p-0"
                >
                  <button
                    type="button"
                    onClick={() => toggle(group.heading)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="focus-ring flex w-full items-center gap-2 px-5 pb-4 pt-6 text-left transition-colors duration-150 hover:bg-paper-mist"
                  >
                    <ChevronDown
                      className={cn(
                        "size-3 shrink-0 text-silver transition-transform duration-150 ease-out",
                        !open && "-rotate-90",
                      )}
                      aria-hidden
                    />
                    <span className="text-body-lg font-medium text-charcoal">
                      {group.heading}
                    </span>
                    <group.icon
                      className="ml-auto size-4 shrink-0 text-fog"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>
                </th>
              </tr>

              {group.rows.map((row) => (
                <tr key={row.label} hidden={!open} className="transition-colors duration-150 hover:bg-paper-mist">
                  <th
                    scope="row"
                    className="border-b border-ash px-5 py-4 text-left align-top font-normal"
                  >
                    <span className="block text-body font-medium text-graphite">
                      {row.label}
                    </span>
                    <span className="mt-0.5 block text-body text-silver">
                      {row.description}
                    </span>
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={plans[index].name}
                      className={cn(
                        "border-b border-l border-ash px-5 py-4 text-left align-middle",
                        plans[index].highlight && "bg-paper-mist",
                      )}
                    >
                      <Cell value={value} featured={Boolean(plans[index].highlight)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
