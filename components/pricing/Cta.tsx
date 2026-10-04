import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The pricing page's CTAs, as dub.co/pricing draws them — they are not the
 * site Button: no drop shadow, and each placement has its own hover.
 *
 *   card     36px, regular weight. Outline hovers to a #fafafa fill; the
 *            filled one to Charcoal with a 4px Ash ring.
 *   compare  32px, medium weight, 200ms. Both grow a 4px ring on hover.
 */
const VARIANTS = {
  card: {
    base: "h-9 rounded-buttons border px-3 text-body font-normal transition-all",
    primary: "border-black bg-black text-white hover:bg-charcoal hover:ring-4 hover:ring-ash",
    secondary: "border-ash bg-white text-charcoal hover:bg-canvas-muted",
  },
  compare: {
    base: "h-8 rounded-buttons border text-body font-medium ring-ash transition-all duration-200 ease-in-out hover:ring-4",
    primary: "border-transparent bg-black text-white",
    secondary: "border-ash bg-white text-graphite hover:bg-canvas-muted hover:ring-paper-mist",
  },
} as const;

export function PricingCta({
  href,
  primary,
  placement,
  children,
}: {
  href: string;
  primary?: boolean;
  placement: keyof typeof VARIANTS;
  children: React.ReactNode;
}) {
  const variant = VARIANTS[placement];
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring flex w-full min-w-0 items-center justify-center whitespace-nowrap leading-5",
        variant.base,
        primary ? variant.primary : variant.secondary,
      )}
    >
      <span className="truncate">{children}</span>
    </Link>
  );
}

/**
 * The previous / next plan buttons either side of a CTA. Below `lg` the
 * reference shows one plan at a time and these step through them; from `lg`
 * every plan is on screen and they disappear.
 */
export function PlanStepper({
  direction,
  disabled,
  onClick,
  placement,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
  placement: keyof typeof VARIANTS;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "previous" ? "Poprzedni plan" : "Następny plan"}
      className={cn(
        "focus-ring h-full w-fit shrink-0 cursor-pointer rounded-buttons px-2.5 transition-colors duration-75 disabled:cursor-default disabled:opacity-30 lg:hidden",
        placement === "card"
          ? "bg-[#e5e5e5]/50 enabled:hover:bg-[#d4d4d4]/50 enabled:active:bg-[#d4d4d4]/50"
          : "bg-paper-mist enabled:hover:bg-[#e5e5e5]/80 enabled:active:bg-ash",
      )}
    >
      <Icon className={cn("text-graphite", placement === "card" ? "size-5" : "size-4")} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
