"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Dub's toast (sonner), without the library: one message at a time, bottom
 * centre, a white card with a hairline and a soft shadow, gone after four
 * seconds. A green check marks something that worked, a red X something that
 * didn't.
 */

export type ToastTone = "success" | "error";

type ToastState = { id: number; message: string; tone: ToastTone } | null;

const SHOW_MS = 4000;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = (message: string, tone: ToastTone) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = window.setTimeout(() => setToast(null), SHOW_MS);
  };
  /** Takes the current toast down early, when what it said no longer applies. */
  const dismiss = () => {
    window.clearTimeout(timer.current);
    setToast(null);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { toast, show, dismiss };
}

/** `raised` lifts it clear of a page's own bottom-centre bar (the dashboard's list footer). */
export function Toast({ toast, raised = false }: { toast: ToastState; raised?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={cn("pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4", raised ? "bottom-24" : "bottom-6")}
    >
      {toast && (
        <p
          key={toast.id}
          className="animate-auth-rise flex max-w-md items-center gap-2.5 rounded-lg border border-ash bg-white py-3 pl-3 pr-4 text-sm text-charcoal shadow-md"
        >
          <span
            aria-hidden
            className={cn(
              "grid size-4 shrink-0 place-items-center rounded-full",
              toast.tone === "success" ? "bg-vivid-green" : "bg-alert-red",
            )}
          >
            {toast.tone === "success" ? (
              <Check className="size-2.5 text-white" strokeWidth={3.5} />
            ) : (
              <X className="size-2.5 text-white" strokeWidth={3.5} />
            )}
          </span>
          <span className="sr-only">{toast.tone === "success" ? "Sukces:" : "Błąd:"}</span>
          {toast.message}
        </p>
      )}
    </div>
  );
}

/* ─── Flash: a toast that survives a page change ─────────────────────────── */

const FLASH_KEY = "examax:flash";

/**
 * Leaves a toast for the next page to show — e.g. "account created" on the
 * page a finished sign-up lands on. Session storage only; if it is blocked,
 * the toast is simply skipped.
 */
export function flashToast(message: string, tone: ToastTone) {
  try {
    window.sessionStorage.setItem(FLASH_KEY, JSON.stringify({ message, tone }));
  } catch {}
}

/**
 * Shows a flashed toast once the page it was left for has arrived. Mounted
 * once in the root layout, it checks again on every route change.
 */
export function FlashToast() {
  const pathname = usePathname();
  const { toast, show } = useToast();

  useEffect(() => {
    let flash: { message: string; tone: ToastTone } | null = null;
    try {
      const raw = window.sessionStorage.getItem(FLASH_KEY);
      flash = raw ? JSON.parse(raw) : null;
    } catch {}
    if (!flash) return;
    // A beat after arrival, so it rises in over the new page rather than with
    // it. Cleared only when shown, so a re-run effect can't drop it.
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.removeItem(FLASH_KEY);
      } catch {}
      show(flash.message, flash.tone);
    }, 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs per page arrival
  }, [pathname]);

  return <Toast toast={toast} raised />;
}
