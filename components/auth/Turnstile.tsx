"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isUiPreview } from "@/lib/dev/preview";

/*
 * Cloudflare Turnstile, in two forms:
 *
 *  - `visible` (the password step of login and sign-up):
 *    the widget shows as soon as the step does and starts checking at once,
 *    at Cloudflare's normal size (300 × 65) with the fields' small radius. `onVerifiedChange` tells the form when it has a
 *    token, and the form keeps its button disabled until then — no pop-up,
 *    the button simply waits. A spent token is not replaced on the spot
 *    (that would compete with the request it goes with); if the request
 *    fails, the form calls `reset()` and the widget checks again. The script
 *    is preloaded on the step before (`preloadTurnstile`), and the reserved
 *    box shows "Weryfikacja…" until Cloudflare paints over it.
 *  - otherwise (resend lines, account dialogs): invisible until needed —
 *    `execution: "execute"`, `appearance: "interaction-only"` — and run when
 *    the form is sent; the few visitors Cloudflare wants to look at get its
 *    checkbox, once, where the widget sits.
 *
 * Either way the form awaits `getToken()`. The token then travels with the
 * request and is verified on a server — by Supabase for its own endpoints,
 * by lib/auth/turnstile.ts for ours — so skipping the widget gets nowhere.
 *
 * A token is single-use, so every `getToken()` after the first starts a
 * fresh check. Without a site key, or when the script cannot load (an ad
 * blocker, no network), `getToken()` rejects and the form says so.
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */

type RenderOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  language?: string;
  appearance?: "always" | "execute" | "interaction-only";
  execution?: "render" | "execute";
  "refresh-expired"?: "auto" | "manual" | "never";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "error-callback"?: (code: string) => boolean | void;
  "unsupported-callback"?: () => void;
  "before-interactive-callback"?: () => void;
  "after-interactive-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: RenderOptions) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

let scriptPromise: Promise<void> | null = null;

/** One script tag for the whole app, however many widgets mount. */
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Why a check could not produce a token; the forms turn it into words (turnstileMessage). */
export class TurnstileError extends Error {
  constructor(readonly reason: "missing-config" | "unavailable" | "failed") {
    super(`Turnstile: ${reason}`);
  }
}

export function turnstileMessage(error: unknown) {
  if (error instanceof TurnstileError && error.reason === "unavailable") {
    return "Nie udało się wczytać weryfikacji. Wyłącz blokowanie treści dla tej strony lub odśwież ją.";
  }
  if (error instanceof TurnstileError && error.reason === "missing-config") {
    return "Weryfikacja jest chwilowo niedostępna. Spróbuj ponownie później.";
  }
  return "Weryfikacja nie powiodła się. Spróbuj jeszcze raz.";
}

/** Starts loading Cloudflare's script ahead of the step that shows the widget. */
export function preloadTurnstile() {
  if (typeof window === "undefined" || !SITE_KEY || isUiPreview()) return;
  loadScript().catch(() => {});
}

export type TurnstileHandle = {
  /** Runs the check and resolves with a fresh token (rejects with a TurnstileError). */
  getToken: () => Promise<string>;
  /** Visible widget: check again after a request that spent the token failed. */
  reset: () => void;
};

type Pending = { resolve: (token: string) => void; reject: (error: TurnstileError) => void; promise: Promise<string> };

export function Turnstile({
  action,
  visible = false,
  onVerifiedChange,
  ref,
}: {
  action?: string;
  visible?: boolean;
  /** Visible widget: true while it holds an unspent token, false otherwise. */
  onVerifiedChange?: (verified: boolean) => void;
  ref?: React.Ref<TurnstileHandle>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const ready = useRef<Promise<string> | null>(null);
  const pending = useRef<Pending | null>(null);
  const used = useRef(false);
  /** A token the visible widget earned before anyone asked for one. */
  const issued = useRef<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const onVerifiedRef = useRef(onVerifiedChange);
  useEffect(() => {
    onVerifiedRef.current = onVerifiedChange;
  });
  const report = (verified: boolean) => onVerifiedRef.current?.(verified);

  const settle = (outcome: { token: string } | { error: TurnstileError }) => {
    const current = pending.current;
    pending.current = null;
    if (!current) return;
    if ("token" in outcome) current.resolve(outcome.token);
    else current.reject(outcome.error);
  };

  useEffect(() => {
    if (isUiPreview()) {
      // The dev panel: nothing to wait for.
      onVerifiedRef.current?.(true);
      return;
    }
    if (!SITE_KEY) {
      console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, so the auth forms cannot be sent (see .env.example).");
      return;
    }
    let cancelled = false;

    ready.current = loadScript().then(() => {
      if (cancelled || !container.current || !window.turnstile) throw new TurnstileError("unavailable");
      const id = window.turnstile.render(container.current, {
        sitekey: SITE_KEY,
        action,
        theme: "light",
        // Visible: the normal 300 × 65 widget, which keeps its size at any zoom.
        size: visible ? "normal" : "flexible",
        language: "pl",
        appearance: visible ? "always" : "interaction-only",
        execution: visible ? "render" : "execute",
        "refresh-expired": visible ? "auto" : "manual",
        callback: (token) => {
          setInteractive(false);
          if (pending.current) settle({ token });
          else {
            issued.current = token;
            report(true);
          }
        },
        "expired-callback": () => {
          issued.current = null;
          report(false);
        },
        "before-interactive-callback": () => setInteractive(true),
        "timeout-callback": () => {
          report(false);
          settle({ error: new TurnstileError("failed") });
        },
        "unsupported-callback": () => settle({ error: new TurnstileError("unavailable") }),
        "error-callback": () => {
          report(false);
          settle({ error: new TurnstileError("failed") });
          // Handled here: the form tells the visitor and the next send starts over.
          return true;
        },
      });
      widgetId.current = id;
      return id;
    });
    // Nothing awaits the promise until a form is sent; keep a failed load from surfacing as unhandled.
    ready.current.catch(() => {});

    return () => {
      cancelled = true;
      settle({ error: new TurnstileError("unavailable") });
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [action, visible]);

  useImperativeHandle(ref, () => ({
    getToken() {
      // The dev panel's previews (development only): no Cloudflare round trip.
      if (isUiPreview()) return Promise.resolve("ui-preview-token");
      if (!SITE_KEY) return Promise.reject(new TurnstileError("missing-config"));
      if (pending.current) return pending.current.promise;
      // The visible widget has usually finished by the time the button is pressed.
      if (visible && issued.current) {
        const token = issued.current;
        issued.current = null;
        report(false);
        return Promise.resolve(token);
      }

      let resolve!: Pending["resolve"];
      let reject!: Pending["reject"];
      const promise = new Promise<string>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      pending.current = { resolve, reject, promise };

      (ready.current ?? Promise.reject(new TurnstileError("unavailable")))
        .then((id) => {
          if (!window.turnstile) throw new TurnstileError("unavailable");
          // Each token is spent by the request it goes with, so later sends start
          // over. The visible widget runs by itself (on render, and again on reset).
          // The visible widget runs by itself; a waiting request just listens.
          if (visible) return;
          if (used.current) window.turnstile.reset(id);
          used.current = true;
          window.turnstile.execute(id);
        })
        .catch((error) => settle({ error: error instanceof TurnstileError ? error : new TurnstileError("unavailable") }));

      return promise;
    },
    reset() {
      if (!visible || isUiPreview()) return;
      issued.current = null;
      report(false);
      ready.current?.then((id) => window.turnstile?.reset(id)).catch(() => {});
    },
  }));

  if (process.env.NODE_ENV === "development" && visible && isUiPreview()) {
    // The dev panel (development only): where the widget would be, without Cloudflare.
    return (
      <div className="flex h-[65px] w-[300px] max-w-full items-center rounded-md border border-ash bg-canvas-muted px-4 text-sm text-fog">
        Weryfikacja Cloudflare (podgląd)
      </div>
    );
  }

  if (visible) {
    // Cloudflare's own 300 × 65 frame — its border and links intact — with the
    // corners eased to the fields' radius. The box is reserved, so the form
    // does not jump while the widget loads.
    return (
      <div className="relative h-[65px] w-[300px] max-w-full overflow-hidden rounded-md border border-ash bg-canvas-muted">
        <span aria-hidden className="absolute inset-0 flex items-center gap-2.5 px-4 text-sm text-fog">
          <span className="size-4 animate-spin rounded-full border-2 border-smoke border-t-fog" />
          Weryfikacja…
        </span>
        {/* Cloudflare's frame covers the placeholder as soon as it paints. */}
        <div ref={container} className="relative -m-px" />
      </div>
    );
  }

  // Out of the form's flow (so its gap stays even) until Cloudflare asks for a
  // click; then its checkbox takes its place in the form, and leaves once passed.
  return (
    <div
      ref={container}
      aria-hidden={interactive ? undefined : true}
      className={cn("w-full", !interactive && "pointer-events-none absolute left-0 top-0 h-0 overflow-hidden opacity-0")}
    />
  );
}
