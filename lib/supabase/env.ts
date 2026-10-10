/*
 * The Supabase project the app signs people in with. Both values are public
 * by design: the URL names the project, and the publishable key
 * (sb_publishable_…) grants only what Row Level Security allows, so they are
 * NEXT_PUBLIC_ and safe in any module. The secret key never appears here; it
 * lives in lib/supabase/admin.ts, which is server-only.
 *
 * Unlike Sanity's (lib/sanity/env.ts) there are no fallbacks: an app that
 * cannot reach its auth project must say so, not sign people into the wrong
 * one. `supabaseEnv()` throws with the missing name; `hasSupabaseEnv` lets
 * the proxy step aside instead of failing every request.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabaseEnv = Boolean(url && publishableKey);

export function supabaseEnv() {
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set (see .env.example).");
  if (!publishableKey) throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set (see .env.example).");
  return { url, publishableKey };
}

/**
 * Session cookie options for every Supabase client (browser, server, proxy):
 * Secure in production, so the session never travels over plain HTTP (the
 * .app TLD is HTTPS-only already; this holds wherever the app is served).
 */
export const sessionCookieOptions = { secure: process.env.NODE_ENV === "production" };

/** The project's origin, for the CSP's connect-src (next.config.ts). Empty when unset. */
export const supabaseOrigin = url ? new URL(url).origin : "";
