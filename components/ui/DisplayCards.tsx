import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

export type DisplayCardItem = {
  icon: IconComponent;
  accent: Accent;
  title: string;
  description: React.ReactNode;
  date: string;
};

/**
 * How the three cards in a stack are offset and revealed.
 *
 * The stack is the point of this component, so the offsets are declared once
 * here rather than repeated per card: each sits one step right and down from
 * the one behind it, and hovering a card lifts it clear of the pair below.
 *
 * Cards behind the front one are held back by a white veil rather than by
 * `grayscale`, which on this palette turns the accent chips to mud. A veil at
 * the page's own surface colour reads as depth instead.
 */
const STACK = [
  "hover:-translate-y-9",
  "translate-x-12 translate-y-9 hover:-translate-y-1",
  "translate-x-24 translate-y-[4.5rem] hover:translate-y-9",
];

/**
 * A skewed stack of cards — three entries fanned out in depth, each lifting
 * clear on hover.
 *
 * Ported onto this project's system: hairline `ash` borders over `bg-white`
 * rather than the source's `bg-muted` and `border-2`, the type ramp from
 * `DESIGN.md` (`body-lg` title over `caption` date) instead of a flat 18px,
 * chip glyphs instead of a hard-coded blue circle, and no dark-mode branch.
 * The 8° skew, the fan and the hover lift are kept as they are — that geometry
 * is the component.
 */
export function DisplayCards({
  items,
  className,
}: {
  items: DisplayCardItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center [grid-template-areas:'stack']",
        className,
      )}
    >
      {items.slice(0, STACK.length).map((item, index) => (
        <article
          key={item.title}
          className={cn(
            "relative flex h-36 w-[min(22rem,calc(100vw-8rem))] -skew-y-[8deg] select-none flex-col justify-between rounded-largecards border border-ash bg-white px-4 py-3.5 shadow-subtle transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [grid-area:stack] hover:border-smoke hover:shadow-md motion-reduce:transition-none",
            // The veil over everything but the front card, lifted on hover.
            index < STACK.length - 1 &&
              "before:absolute before:inset-0 before:z-10 before:rounded-largecards before:bg-white/55 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-0",
            STACK[index],
          )}
        >
          <div className="flex items-center gap-2">
            <AccentTile icon={item.icon} accent={item.accent} />
            <p className="text-body-lg font-medium text-charcoal">
              {item.title}
            </p>
          </div>
          <p className="line-clamp-2 text-body text-steel">
            {item.description}
          </p>
          <p className="text-caption text-silver">{item.date}</p>
        </article>
      ))}
    </div>
  );
}
