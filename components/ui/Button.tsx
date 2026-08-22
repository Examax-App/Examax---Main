import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "ghost" | "inverted";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  // Filled dark CTA — the single committed action per surface
  primary:
    "bg-primary-action-fill text-white shadow-subtle hover:bg-graphite hover:shadow-sm focus-visible:outline-charcoal",
  // Outlined action button — the workhorse secondary
  outline:
    "bg-white text-charcoal border border-ash hover:border-smoke hover:bg-paper-mist hover:shadow-subtle focus-visible:outline-charcoal",
  // Ghost nav button — transparent until hover
  ghost:
    "bg-transparent text-charcoal hover:bg-paper-mist focus-visible:outline-charcoal",
  // White-on-dark, for the dark CTA band
  inverted:
    "bg-white text-charcoal hover:bg-ash hover:shadow-sm focus-visible:outline-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-body",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-5 text-body-lg",
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
        "inline-flex items-center justify-center gap-2 rounded-buttons font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:hover:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
