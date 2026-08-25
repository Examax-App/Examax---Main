import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Centered plan-upsell block from the reference (Events / Webhooks pages):
 * icon tile, bold title, short muted copy, and an outline button whose label
 * is the signature pink→violet gradient text.
 */
export function UpsellPanel({
  icon: Icon,
  title,
  description,
  ctaLabel,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  ctaLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-cards border border-ash bg-paper-mist text-charcoal"
      >
        <Icon className="size-6" strokeWidth={1.6} />
      </span>
      <p className="mt-5 text-body-xl font-semibold text-charcoal">{title}</p>
      <p className="mt-2 max-w-sm text-body text-steel">{description}</p>
      <button
        type="button"
        className="mt-5 rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium shadow-subtle transition-all duration-200 hover:border-smoke hover:shadow-sm"
      >
        <span className="bg-gradient-to-r from-[#db2777] to-lavender bg-clip-text text-transparent">
          {ctaLabel}
        </span>
      </button>
    </div>
  );
}
