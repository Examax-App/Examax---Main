"use client";

import { createBrowserClient } from "@supabase/ssr";
import { sessionCookieOptions, supabaseEnv } from "@/lib/supabase/env";
import { isUiPreview } from "@/lib/dev/preview";
import { previewClient } from "@/lib/dev/previewClient";

/**
 * Supabase in the browser. The auth forms call it directly — sign-up,
 * sign-in, links and resets — rather than through a route of ours, so
 * Supabase sees the visitor's own IP: its per-IP rate limits and its
 * Turnstile check (the captcha_token every one of those calls carries) then
 * apply to that visitor, not to our server. The session lands in cookies,
 * which the server reads (lib/supabase/server.ts) and the proxy refreshes.
 */
export function createClient() {
  // The dev panel's previews (development only) talk to a stand-in, never to Supabase.
  if (process.env.NODE_ENV === "development" && isUiPreview()) return previewClient() as unknown as ReturnType<typeof createBrowserClient>;
  const { url, publishableKey } = supabaseEnv();
  return createBrowserClient(url, publishableKey, { cookieOptions: sessionCookieOptions });
}
