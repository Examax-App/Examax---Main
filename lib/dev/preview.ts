/*
 * UI preview mode, for the Examax dev panel (components/dev/DevTools.tsx).
 * While the panel shows a component, the auth code asks `isUiPreview()` and
 * sends nothing: the Supabase client is swapped for an inert stand-in
 * (lib/dev/previewClient.ts), Turnstile hands out a fake token, and sign-out,
 * account deletion and the browser's save-password prompt stand down.
 *
 * Development only: in a production build `process.env.NODE_ENV` is
 * "production", every check below is false and the bundler drops what it
 * guards.
 */

declare global {
  interface Window {
    __EXAMAX_UI_PREVIEW__?: boolean;
  }
}

export function isUiPreview() {
  return process.env.NODE_ENV === "development" && typeof window !== "undefined" && window.__EXAMAX_UI_PREVIEW__ === true;
}

export function setUiPreview(on: boolean) {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") window.__EXAMAX_UI_PREVIEW__ = on;
}

/** The code the stand-ins answer with where something would have been sent; errors.ts words it. */
export const UI_PREVIEW_ERROR = { code: "ui_preview", message: "UI preview: nothing was sent.", status: 0, name: "AuthApiError" } as const;
