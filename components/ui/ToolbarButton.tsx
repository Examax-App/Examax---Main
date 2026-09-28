import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Toolbar dropdown button ("Filter ▾", "Display ▾", date ranges) — outlined,
 * leading icon, trailing chevron.
 */
export function ToolbarButton({
  icon: Icon,
  label,
  chevron = true,
  className,
}: {
  icon: LucideIcon;
  label: string;
  chevron?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-buttons border border-ash bg-white px-3 text-body-sm font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
        className,
      )}
    >
      <Icon className="size-3.5 text-steel" strokeWidth={1.8} aria-hidden />
      {label}
      {chevron ? (
        <ChevronDown className="size-3 text-fog" aria-hidden />
      ) : null}
    </button>
  );
}
