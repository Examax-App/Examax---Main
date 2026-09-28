import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { ACCENT_VAR, GLOW_LAYER, baseGlow } from "@/lib/glow";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * Bento layout: a three-column field of cards that span rows and columns
 * unevenly, so a set of features reads as one composed block rather than as a
 * row of equals.
 *
 * Rows are a fixed height because that is what makes the spans mean anything —
 * `auto-rows-fr` would let content decide, and the composition would collapse.
 * One column below `md`, where a bento is just a stack.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[18rem] grid-cols-1 gap-4 md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One cell of a {@link BentoGrid}.
 *
 * Ported onto this project's system rather than copied: the hairline `ash`
 * border and `shadow-subtle` instead of the source's stacked box-shadows
 * (DESIGN.md holds surfaces with borders, not elevation), the chip-style
 * `AccentTile` instead of a bare 48px glyph, the project's own `Button`, and
 * no dark-mode branch — this site has one theme. The accent light at the base
 * is the same layer the navbar's feature cards and the pricing tiers use.
 *
 * `background` is the slot for a visual filling the card's upper half. A card
 * given one holds its copy at the foot and lifts it on hover, which is the
 * source component's signature move. A card *without* one puts its copy at the
 * top instead: the alternative is a fixed-height box with an empty upper half,
 * and a reserved void reads as something that failed to load.
 */
export function BentoCard({
  name,
  description,
  icon,
  accent,
  href,
  cta,
  background,
  className,
}: {
  name: string;
  description: string;
  icon: IconComponent;
  accent: Accent;
  href: string;
  /** Label for the hover action. */
  cta: string;
  /** Optional visual for the card's upper half. */
  background?: ReactNode;
  /** Column and row spans — this is where a cell's size is decided. */
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group focus-within:ring-ash relative isolate flex flex-col overflow-hidden rounded-largecards border border-ash bg-white transition-[background-color,box-shadow] duration-150 hover:shadow-subtle motion-reduce:transition-none",
        background ? "justify-between" : "justify-start",
        className,
      )}
    >
      <span
        aria-hidden
        className={GLOW_LAYER}
        style={{ backgroundImage: baseGlow(ACCENT_VAR[accent]) }}
      />
      {background ? (
        <div aria-hidden className="pointer-events-none relative">
          {background}
        </div>
      ) : null}

      <div
        className={cn(
          "pointer-events-none relative flex flex-col p-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          // Only a card carrying a visual has anywhere to lift into.
          Boolean(background) &&
            "group-hover:-translate-y-9 motion-reduce:group-hover:translate-y-0",
        )}
      >
        <AccentTile icon={icon} accent={accent} size="lg" />
        <h3 className="mt-4 text-body-lg font-medium text-charcoal">{name}</h3>
        <p className="mt-2 max-w-sm text-body leading-relaxed text-fog">
          {description}
        </p>
      </div>

      {/* The action is revealed by hover, so it must also be reachable by
          keyboard: focus-within holds the row open. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-8 p-4 opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
        <Button
          href={href}
          variant="ghostDark"
          size="card"
          className="pointer-events-auto"
        >
          {cta}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
