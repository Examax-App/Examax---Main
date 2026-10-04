import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The building blocks dub.co/links repeats down its page (read off the live
 * DOM on 2026-10-01): a full-bleed band holding the 1080px column between two
 * hairlines, a centred header with a grey icon eyebrow, a two-by-two grid of
 * pictures with copy under each, and a row of small features closing the band.
 */

/** Dub's `grid-section`: a full-bleed band, the 1080px column ruled at both edges. */
export function GridSection({
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative overflow-clip border-b border-ash bg-white px-4", className)}>
      <div className={cn("relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash", innerClassName)}>{children}</div>
    </section>
  );
}

/**
 * The centred header: grey icon eyebrow, Satoshi heading, a muted line,
 * optional actions. dub.co/solutions pages drop the eyebrow; leave out
 * `icon` and `eyebrow` for that.
 */
export function SectionHeader({
  id,
  icon: Icon,
  eyebrow,
  title,
  sub,
  actions,
}: {
  id: string;
  icon?: IconComponent;
  eyebrow?: string;
  title: string;
  sub: React.ReactNode;
  actions?: Array<{ label: string; href: string; variant: "primary" | "outline" }>;
}) {
  return (
    <Reveal className="flex flex-col items-center px-4 text-center">
      {Icon && eyebrow ? (
        <span className="mb-3 flex items-center gap-2 text-base font-medium text-fog">
          <Icon className="size-4" strokeWidth={2} aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="max-w-lg text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-pretty text-base text-fog sm:text-lg">{sub}</p>
      {actions ? (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {actions.map((action) => (
            <Button key={action.label} href={action.href} variant={action.variant}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </Reveal>
  );
}

/** The reference's quiet outline action under each feature. */
const CTA_CLASS =
  "focus-ring w-fit whitespace-nowrap rounded-lg border border-smoke bg-white px-3 py-2 text-body font-medium leading-none text-charcoal transition-colors duration-75 hover:bg-canvas-muted active:bg-paper-mist";

/** Links inside a description: medium weight, dotted underline, darker on hover. */
const PROSE_LINKS =
  "[&_a]:font-medium [&_a]:text-steel [&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-charcoal";

export type FeatureCellData = {
  title: string;
  description: React.ReactNode;
  cta: { label: string; href: string };
  visual: React.ReactNode;
};

/** One cell of the grid: the picture, then its title, a line and a quiet action. */
export function FeatureCell({ cell, delay = 0 }: { cell: FeatureCellData; delay?: number }) {
  return (
    <Reveal delay={delay} className="relative flex flex-col gap-10 px-4 py-6 sm:px-10 sm:py-14">
      <div className="relative h-72 overflow-hidden sm:h-[290px]">{cell.visual}</div>
      <div className="relative flex flex-col text-base">
        <h3 className="font-semibold text-slate">{cell.title}</h3>
        <div className={cn("mt-1 text-fog", PROSE_LINKS)}>
          <p>{cell.description}</p>
        </div>
        <Link href={cell.cta.href} className={cn(CTA_CLASS, "mt-3")}>
          {cell.cta.label}
        </Link>
      </div>
    </Reveal>
  );
}

/**
 * Dub's two-by-two: hairline-divided cells, each row after the first ruled
 * off the one above. dub.co/analytics runs the same grid a single row deep.
 */
export function FeatureGrid({ cells }: { cells: [FeatureCellData, FeatureCellData] | [FeatureCellData, FeatureCellData, FeatureCellData, FeatureCellData] }) {
  const rows = Array.from({ length: cells.length / 2 }, (_, row) => cells.slice(row * 2, row * 2 + 2));
  return (
    <div className="grid grid-cols-1 border-t border-ash md:grid-cols-2">
      {rows.map((pair, row) => (
        <div key={row} className={cn("contents divide-ash max-md:divide-y md:divide-x", row > 0 && "[&>*]:border-t [&>*]:border-ash")}>
          <FeatureCell cell={pair[0]} delay={0} />
          <FeatureCell cell={pair[1]} delay={80} />
        </div>
      ))}
    </div>
  );
}

export type MiniFeature = {
  icon: IconComponent;
  title: string;
  description: React.ReactNode;
};

/**
 * The band's closing row: small features on a 1px grid, the glyph in the
 * page's accent. One action closes the row rather than one per feature, on
 * a strip with a line that sums the row up.
 */
export function MiniFeatures({
  items,
  summary,
  cta,
  iconClassName = "text-electric-blue",
}: {
  items: MiniFeature[];
  summary: string;
  cta: { label: string; href: string };
  /** The glyphs' colour — the page's own accent (Roadmapa blue by default). */
  iconClassName?: string;
}) {
  return (
    <div className="border-y border-ash">
      <div
        className={cn(
          "grid grid-cols-1 gap-px bg-ash text-body",
          items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3",
        )}
      >
        {items.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-start gap-2 bg-white p-8 text-left lg:px-9 lg:py-10">
            <Icon className={cn("size-4 shrink-0", iconClassName)} strokeWidth={2} aria-hidden />
            <h3 className="font-medium text-charcoal">{title}</h3>
            <div className={cn("max-w-xs text-pretty text-fog sm:max-w-none", PROSE_LINKS)}>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-between gap-4 border-t border-ash bg-white px-8 py-6 sm:flex-row sm:items-center lg:px-9">
        <p className="text-pretty text-body text-steel">{summary}</p>
        <Link href={cta.href} className={CTA_CLASS}>
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
