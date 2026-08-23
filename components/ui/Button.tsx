import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "inverted"
  | "translucent";
type ButtonSize = "nav" | "md" | "lg";

/**
 * Reference metrics: `px-5 py-2 text-sm font-medium rounded-lg shadow-sm`
 * computes to a 38px-tall control, and every variant grows a 4px neutral ring
 * on hover. The nav uses the same type at a 32px height.
 */
const variantClasses: Record<ButtonVariant, string> = {
  // Filled dark CTA — the single committed action per surface
  primary:
    "border border-midnight-ink bg-primary-action-fill text-white shadow-subtle hover:ring-4 hover:ring-ash",
  // Outlined action button — the workhorse secondary
  outline:
    "border border-ash bg-white text-charcoal shadow-subtle hover:ring-4 hover:ring-ash",
  // Ghost nav button — transparent until hover
  ghost: "bg-transparent text-slate hover:text-charcoal",
  // White-on-dark, for the dark CTA band
  inverted:
    "border border-white bg-white text-charcoal hover:ring-4 hover:ring-white/20",
  // Secondary on dark — translucent, never a solid slab. Must be a variant:
  // cn() is a plain join, so a bg-* passed via className cannot beat one
  // already set by another variant.
  translucent:
    "border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:ring-4 hover:ring-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  nav: "h-8 px-4 text-body font-medium",
  md: "px-5 py-2 text-body font-medium",
  lg: "px-5 py-2 text-body font-medium",
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
        "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-buttons leading-5 transition-all duration-150",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
