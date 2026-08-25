import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "ghost" | "inverted";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Reference metrics: primary/secondary 38px tall, 14px/500, 8px radius,
 * 1px border on BOTH variants, 0 1px 2px shadow that grows on hover.
 * "sm" is the 32px / 13px / 400 nav size.
 */
const variantClasses: Record<ButtonVariant, string> = {
  // Filled dark CTA — the single committed action per surface
  primary:
    "border border-midnight-ink bg-primary-action-fill text-white shadow-subtle hover:bg-graphite hover:shadow-sm",
  // Outlined action button — the workhorse secondary
  outline:
    "border border-ash bg-white text-charcoal shadow-subtle hover:bg-[#fafafa] hover:shadow-sm",
  // Ghost nav button — transparent until hover
  ghost: "bg-transparent text-charcoal hover:text-steel",
  // White-on-dark, for the dark CTA band
  inverted: "border border-white bg-white text-charcoal hover:bg-ash",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] font-normal",
  md: "h-[38px] px-3.5 text-body font-medium",
  lg: "h-[38px] px-4 text-body font-medium",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-buttons transition-all duration-150",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
