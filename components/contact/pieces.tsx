import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The parts dub.co/contact and its two sub-pages share (read off the live
 * DOM on 2026-10-03): the ruled hero band, and the grey band whose white
 * 800px column holds a form.
 */

/** The page column's rule, as the site's GridSection draws it. */
const COLUMN = "relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash";

/**
 * dub's hero: py-16, centred in a 448px column. The hub's title is 48px
 * under a 20px gap; the sub-pages put a 40px stroke-1 icon over a 40px
 * title, every piece 12px apart. The line is 20px neutral-600.
 */
export function ContactHero({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon?: IconComponent;
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="contact-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className={COLUMN}>
        <div className="px-4 py-16 text-center">
          <div className={cn("relative mx-auto flex max-w-md flex-col items-center", Icon && "gap-3")}>
            {Icon ? <Icon className="size-10 text-charcoal" strokeWidth={1} aria-hidden /> : null}
            <h1
              id="contact-heading"
              className={cn(
                "text-center font-satoshi text-4xl font-medium text-charcoal sm:whitespace-nowrap",
                Icon ? "sm:text-[2.5rem] sm:leading-10" : "mt-5 sm:text-5xl sm:leading-[1.15]",
              )}
            >
              {title}
            </h1>
            <p className={cn("text-balance text-lg text-[#525252] sm:text-xl", !Icon && "mt-3")}>{sub}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** dub's form band: neutral-50 on large screens, a white 800px column ruled at both sides. */
export function FormBand({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className={cn(COLUMN, "overflow-hidden lg:bg-canvas-muted")}>
        <div className="relative mx-auto max-w-[800px] bg-white lg:border-x lg:border-ash">{children}</div>
      </div>
    </section>
  );
}

/** "Wszystkie systemy działają" — the footer's status pill, as dub sets it under the hub's heading. */
export function SystemsPill() {
  return (
    <span className="mt-10 inline-flex cursor-default select-none items-center gap-2 rounded-lg border border-ash bg-white py-2 pl-2 pr-2.5">
      <span className="relative size-2">
        <span className="absolute inset-0 m-auto size-2 animate-ping rounded-full bg-vivid-green/40 motion-reduce:animate-none" />
        <span className="absolute inset-0 z-10 m-auto size-2 rounded-full bg-vivid-green" />
      </span>
      <span className="text-[12px] font-medium leading-none text-steel">Wszystkie systemy działają</span>
    </span>
  );
}
