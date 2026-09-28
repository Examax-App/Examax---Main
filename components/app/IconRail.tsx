import Link from "next/link";
import { CircleHelp, Compass, Gift } from "lucide-react";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";
import { AgentIcon } from "@/components/ui/AgentIcon";

/**
 * Leftmost product rail — brand glyph on top, product-area switches below,
 * gift + help pinned to the bottom (mirrors the reference app frame).
 */
export function IconRail() {
  return (
    <div className="hidden w-14 shrink-0 flex-col items-center gap-2.5 py-3 md:flex">
      <Link
        href="/"
        aria-label="Examax — strona główna"
        className="mb-1.5 grid size-7 place-items-center rounded-buttons bg-midnight-ink"
      >
        <BrandMark className="size-3.5 text-white" />
      </Link>

      <RailIcon href="/dashboard" label="Nauka" active>
        <Compass className="size-4" strokeWidth={1.8} />
      </RailIcon>
      <RailIcon href="/dashboard" label="Agent">
        <AgentIcon className="size-4" />
      </RailIcon>

      <div className="mt-auto flex flex-col items-center gap-2.5">
        <RailIcon href="/pricing" label="Poleć Examax">
          <Gift className="size-4" strokeWidth={1.8} />
        </RailIcon>
        <RailIcon href="/help" label="Pomoc">
          <CircleHelp className="size-4" strokeWidth={1.8} />
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
        "grid size-9 place-items-center rounded-buttons transition-colors",
        active
          ? "bg-white text-charcoal shadow-subtle"
          : "text-slate hover:bg-ash/60 hover:text-charcoal",
      )}
    >
      {children}
    </Link>
  );
}
