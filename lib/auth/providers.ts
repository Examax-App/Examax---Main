import "server-only";

import { hasSupabaseEnv, supabaseEnv } from "@/lib/supabase/env";

/*
 * Which sign-in providers Supabase has switched on, read from its public
 * settings endpoint and cached for five minutes. The buttons follow it, so
 * a provider is enabled in one place — the Supabase dashboard — and the
 * screens catch up on their own: Facebook stays visible but unavailable
 * until Meta's verification is done and it is switched on there.
 */

export type OAuthProvider = "google" | "azure" | "facebook";
export type ProviderStatus = Record<OAuthProvider, boolean> & {
  /**
   * Google runs through our own /auth/google (lib/auth/google.ts) instead of
   * Supabase's redirect, so its screen names examax.app, not supabase.co.
   * Off until GOOGLE_SIGN_IN_VIA_SITE=true — set it once the OAuth client
   * lists <origin>/auth/google/callback among its redirect URIs, or Google
   * answers "redirect_uri_mismatch".
   */
  googleViaSite: boolean;
};

const googleViaSite = () =>
  process.env.GOOGLE_SIGN_IN_VIA_SITE === "true" && Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const NONE: ProviderStatus = { google: false, azure: false, facebook: false, googleViaSite: false };

export async function getProviderStatus(): Promise<ProviderStatus> {
  if (!hasSupabaseEnv) return NONE;
  const { url, publishableKey } = supabaseEnv();
  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: publishableKey },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ...NONE, googleViaSite: googleViaSite() };
    const { external } = (await response.json()) as { external?: Partial<Record<OAuthProvider, boolean>> };
    return { google: Boolean(external?.google), azure: Boolean(external?.azure), facebook: Boolean(external?.facebook), googleViaSite: googleViaSite() };
  } catch {
    return { ...NONE, googleViaSite: googleViaSite() };
  }
}
