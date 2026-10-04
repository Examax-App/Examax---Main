"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const noop = () => () => {};

/**
 * A side sheet — dub.co's drawer, one to one (read off its live DOM on
 * dub.co/analytics, `DesignRules/dom-captures/analytics-customer-sheet.html`):
 * a white panel floating 8px in from the right edge and from top and bottom,
 * 540px wide, 12px radius, over a dimmed page. It slides in on vaul's ease
 * (0.5s, cubic-bezier(0.32, 0.72, 0, 1)) and back out the same way.
 *
 * Rendered into <body> through a portal, so a transformed or clipped band
 * around the trigger can never trap it. The parent owns `open`; Escape, the
 * close button and a click on the dimmed page all call `onClose`. Focus moves
 * to the close button on open, stays inside while open, and returns to the
 * trigger on close.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    trigger.current = document.activeElement;
    closeButton.current?.focus({ preventScroll: true });
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (trigger.current instanceof HTMLElement) trigger.current.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div
        aria-hidden
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/20 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute bottom-2 right-2 top-2 flex w-[min(540px,calc(100%-16px))] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          // Visible at once on the way in (so focus can land), hidden only once it has slid out.
          open ? "visible translate-x-0 transition-transform" : "invisible translate-x-[calc(100%+8px)] transition-[transform,visibility]",
        )}
      >
        <div className="flex size-full grow flex-col overflow-y-auto rounded-xl bg-white [scrollbar-width:none]">
          <div className="flex items-start justify-between p-6">
            <h2 className="text-xl font-semibold text-charcoal">{title}</h2>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Zamknij"
              className="focus-ring flex items-center justify-center rounded-lg p-1 text-slate transition-colors hover:bg-charcoal/5"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
