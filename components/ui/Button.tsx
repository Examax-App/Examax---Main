import Link from "next/link";
import { cn } from "@/lib/cn";
import { prefetchFor } from "@/lib/routes";

type ButtonVariant =
  | "primary"
  | "outline"
  | "outlineStrong"
  | "ghost"
  | "ghostDark"
  | "inverted"
  | "translucent";
type ButtonSize = "nav" | "md" | "lg" | "card" | "compare" | "plan";

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
  // Outlined action, one step up — the stronger Smoke edge, for the tier that
  // needs to out-rank the plain outline without reaching for a fill.
  outlineStrong:
    "border border-smoke bg-white text-charcoal hover:ring-4 hover:ring-ash",
  // Ghost nav button — transparent until hover
  ghost: "bg-transparent text-slate hover:text-charcoal",
  // Ghost at body-text contrast, for a CTA that must stay readable as a CTA
  // while carrying no edge of its own.
  ghostDark: "bg-transparent text-charcoal hover:bg-paper-mist",
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
  // The reference's Log in / Sign up sit at regular weight (dub.co, measured:
  // Inter 14px, 400), a step lighter than its nav links.
  nav: "h-8 px-4 text-body font-normal",
  md: "px-5 py-2 text-body font-medium",
  lg: "px-5 py-2 text-body font-medium",
  // The two fixed heights the pricing page's reference frame specifies: 36px
  // inside a plan card (regular weight), 32px in the comparison header
  // (medium). Heights rather than padding, so the CTAs line up across a row
  // whatever the label runs to.
  card: "h-9 px-3 text-body font-normal",
  // The pricing cards' CTA: 12px over 16px, per the plan-card spec.
  plan: "px-4 py-3 text-body font-medium",
  compare: "h-8 px-3 text-body font-medium",
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
      prefetch={prefetchFor(href)}
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
