import Link from "next/link";
import { Bot, CircleHelp, Compass, Gift } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Leftmost product rail — brand glyph on top, product-area switches below,
 * gift + help pinned to the bottom (mirrors the reference app frame).
 */
export function IconRail() {
  return (
    <div className="hidden w-16 shrink-0 flex-col items-center gap-3 py-4 md:flex">
      <Link
        href="/"
        aria-label="Examax — strona główna"
        className="mb-2 grid size-8 place-items-center rounded-[9px] bg-midnight-ink"
      >
        <svg viewBox="0 0 32 32" className="size-8" role="presentation">
          <defs>
            <linearGradient
              id="rail-spectrum"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#3a8bfd" />
              <stop offset="0.5" stopColor="#855afc" />
              <stop offset="1" stopColor="#ff5f5f" />
            </linearGradient>
          </defs>
          <path
            d="M10 20.5 16 9.5l6 11M12.4 16.6h7.2"
            fill="none"
            stroke="url(#rail-spectrum)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <RailIcon href="/app" label="Nauka" active>
        <Compass className="size-4.5" strokeWidth={1.8} />
      </RailIcon>
      <RailIcon href="/app" label="Agent">
        <Bot className="size-4.5" strokeWidth={1.8} />
      </RailIcon>

      <div className="mt-auto flex flex-col items-center gap-3">
        <RailIcon href="/#cennik" label="Poleć Examax">
          <Gift className="size-4.5" strokeWidth={1.8} />
        </RailIcon>
        <RailIcon href="/pomoc" label="Pomoc">
          <CircleHelp className="size-4.5" strokeWidth={1.8} />
        </RailIcon>
      </div>
    </div>
  );
}

function RailIcon({
  href,
  label,
  active = false,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 place-items-center rounded-cards transition-colors",
        active
          ? "border border-ash bg-white text-charcoal shadow-subtle"
          : "text-slate hover:bg-ash/60 hover:text-charcoal",
      )}
    >
      {children}
    </Link>
  );
}
