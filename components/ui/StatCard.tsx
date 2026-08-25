import { cn } from "@/lib/cn";

export type Stat = {
  /** Legend square color class, e.g. "bg-electric-blue". */
  dotClass: string;
  label: string;
  value: string;
};

/**
 * Joined analytics header cells — legend square, label, large number; the
 * active cell carries the near-black underline (Analytics reference).
 */
export function StatTabs({
  stats,
  activeIndex = 0,
  className,
}: {
  stats: Stat[];
  activeIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-t-cards border border-b-0 border-ash bg-white sm:grid-cols-3",
        className,
      )}
    >
      {stats.map((stat, index) => (
        <button
          key={stat.label}
          type="button"
          aria-pressed={index === activeIndex}
          className={cn(
            "border-b-2 border-r border-r-ash px-5 py-4 text-left transition-colors last:border-r-0 hover:bg-paper-mist/60",
            index === activeIndex ? "border-b-midnight-ink" : "border-b-transparent",
          )}
        >
          <span className="flex items-center gap-2 text-body text-steel">
            <span
              aria-hidden
              className={cn("size-2 rounded-[3px]", stat.dotClass)}
            />
            {stat.label}
          </span>
          <span className="mt-1 block font-satoshi text-heading font-medium leading-none text-charcoal">
            {stat.value}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Standalone outlined stat card (Events reference) — active gets the darker frame. */
export function StatCard({
  label,
  value,
  active = false,
  className,
}: {
  label: string;
  value: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-cards border bg-white px-5 py-4",
        active ? "border-charcoal" : "border-ash",
        className,
      )}
    >
      <p className="text-body text-steel">{label}</p>
      <p className="mt-1 font-satoshi text-heading font-medium leading-none text-charcoal">
        {value}
      </p>
    </div>
  );
}
