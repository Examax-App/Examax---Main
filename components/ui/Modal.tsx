"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * Overlay dialog — dimmed canvas behind, white 16px-radius panel. The parent
 * owns the open state; Escape and a backdrop click both close.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  size = "md",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-white/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "w-full rounded-largecards border border-ash bg-white shadow-md",
          size === "lg" ? "max-w-4xl" : "max-w-md",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
