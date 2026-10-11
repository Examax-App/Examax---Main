"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AFTER_SIGN_IN, safeNext } from "@/lib/auth/redirect";
import { isEmailOtpType, linkIntent } from "@/lib/auth/emailLinks";

/**
 * Spends an e-mail link's one-time token (the button on /auth/confirm).
 * Success signs the visitor in and moves on; an expired or already-used link
 * goes to /verify, which can send a new one.
 */
export async function confirmEmailLink(formData: FormData) {
  const tokenHash = formData.get("token_hash");
  const type = formData.get("type");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (typeof tokenHash !== "string" || !tokenHash || !isEmailOtpType(type)) {
    redirect("/verify?error=invalid");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) redirect(`/verify?error=${error.code === "otp_expired" ? "expired" : "invalid"}&type=${type}`);
  // A secure address change needs both e-mails (old and new) confirmed. The
  // first link answers without a session ("proceed to confirm link sent to
  // the other email"); only the second completes the change and signs in.
  if (type === "email_change") redirect(data.session ? `${AFTER_SIGN_IN}?notice=email-change` : "/verify?notice=email-change-pending");
  if (type === "recovery") redirect("/reset-password");
  // An activation link (not a sign-in link) lands with the green "verified" toast.
  const intent = formData.get("intent");
  redirect(linkIntent(type, typeof intent === "string" ? intent : undefined) === "signup" ? withNotice(next, "verified") : next);
}

/** `next` with `?notice=` added, keeping any query it already has. */
function withNotice(next: string, notice: string) {
  const url = new URL(next, "https://examax.app");
  url.searchParams.set("notice", notice);
  return `${url.pathname}${url.search}${url.hash}`;
}
