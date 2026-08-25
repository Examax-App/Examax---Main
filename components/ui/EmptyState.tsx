import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The reference empty state used on every list page: two ghost skeleton rows,
 * a bold one-liner, muted copy, then a primary + "Learn more" action pair.
 */
export function GhostRow({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-56 items-center gap-2.5 rounded-cards border border-ash bg-white px-3.5 py-3.5 shadow-subtle",
        className,
      )}
    >
      <Icon className="size-4 shrink-0 text-fog" strokeWidth={1.8} />
      <span className="h-2 w-28 rounded-full bg-ash" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Action row — typically a primary Button and an outline "Learn more". */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div aria-hidden className="flex flex-col items-center gap-3">
        <GhostRow icon={icon} />
        <GhostRow icon={icon} className="opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>
      <p className="mt-5 text-body-lg font-semibold text-charcoal">{title}</p>
      <p className="mt-1.5 max-w-xs text-body text-fog">{description}</p>
      {children ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
