"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The reference switch — electric blue when on, ash track when off.
 * Uncontrolled with `defaultChecked`, or controlled via `checked`/`onChange`.
 */
export function Toggle({
  defaultChecked = false,
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  className,
}: {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Accessible name for the switch. */
  label: string;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        const next = !on;
        setInternal(next);
        onChange?.(next);
      }}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
        size === "sm" ? "h-4 w-7" : "h-5 w-9",
        on ? "bg-electric-blue" : "bg-smoke",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute rounded-full bg-white shadow-subtle transition-transform duration-200",
          size === "sm" ? "size-3" : "size-4",
          size === "sm"
            ? on
              ? "translate-x-3.5"
              : "translate-x-0.5"
            : on
              ? "translate-x-[18px]"
              : "translate-x-0.5",
        )}
      />
    </button>
  );
}
