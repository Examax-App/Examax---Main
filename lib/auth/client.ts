"use client";

import { createClient } from "@/lib/supabase/client";
import { isUiPreview } from "@/lib/dev/preview";
import type { OAuthProvider } from "@/lib/auth/providers";

/*
 * The browser half of auth: where Supabase should send people back to.
 *
 * `emailRedirect` becomes the e-mails' {{ .RedirectTo }}. The templates
 * (supabase/templates/*.html) append `&token_hash=…&type=…` to it, so the
 * link returns to whichever site the visitor started on — localhost while
 * developing, examax.app in production — and lands on /auth/confirm. It
 * always carries a query string for that `&` to join. Supabase only honours
 * origins on the project's Redirect URLs list; anything else falls back to
 * the Site URL. OAuth returns to /auth/callback the same way.
 */

export const emailRedirect = (next: string, intent?: "login") =>
  `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}${intent ? `&intent=${intent}` : ""}`;

/**
 * Leaves for the provider's sign-in page. Supabase stores the PKCE verifier
 * in a cookie first, and /auth/callback trades the returned code for a
 * session. Microsoft only shares the e-mail address when asked for it.
 * Resolves only if the redirect could not start.
 */
export async function startOAuth(provider: OAuthProvider, next: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      scopes: provider === "azure" ? "email" : undefined,
    },
  });
  return error;
}

type PasswordCredentialConstructor = new (data: { id: string; password: string; name?: string }) => Credential;

/**
 * The browser's own "Save password?" prompt, offered once an e-mail and
 * password have just worked (sign-up, sign-in, a new password). Chrome and
 * Edge show it through the Credential Management API; Safari and Firefox
 * offer to save from the form itself (the fields carry autocomplete
 * "username" and "current-password" / "new-password"), so for them this is a
 * no-op. Never throws — saving a password is a courtesy, not a step.
 */
export async function offerToSavePassword(email: string, password: string) {
  if (isUiPreview()) return;
  const PasswordCredential = (window as unknown as { PasswordCredential?: PasswordCredentialConstructor }).PasswordCredential;
  if (!PasswordCredential || !navigator.credentials?.store) return;
  try {
    await navigator.credentials.store(new PasswordCredential({ id: email, password, name: email }));
  } catch {
    // Declined, blocked by the browser, or not a secure context.
  }
}
