"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Dismissible tinted banner — the reference's green "Claim a free .link
 * domain" strip: soft wash, icon, inline underlined link, outline action, X.
 */
export function Banner({
  icon: Icon,
  children,
  action,
  className,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-cards bg-gradient-to-r from-soft-mint/80 to-soft-mint/30 px-4 py-2.5",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded-full border border-vivid-green/30 bg-white text-vivid-green"
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <p className="min-w-0 flex-1 truncate text-body text-charcoal">
        {children}
      </p>
      {action}
      <button
        type="button"
        aria-label="Zamknij"
        onClick={() => setOpen(false)}
        className="grid size-7 shrink-0 place-items-center rounded-buttons text-steel transition-colors hover:bg-white/60 hover:text-charcoal"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
