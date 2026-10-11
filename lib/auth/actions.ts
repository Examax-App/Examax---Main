"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { take } from "@/lib/rateLimit";
import { GENERIC_ERROR } from "@/lib/auth/errors";

/*
 * The account actions that run on our server rather than in the browser:
 * signing out (so the cookies are cleared where they are set) and deleting
 * an account, which needs the secret key. Everything else goes straight to
 * Supabase from the browser (see lib/supabase/client.ts for why).
 */

export async function signOut() {
  const supabase = await createClient();
  // "local": this browser only; other devices stay signed in until they expire.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}

/**
 * Records that the signed-in account now has a password — for accounts that
 * began with Google or Microsoft, which Supabase gives no "email" identity
 * when they set one. Stored in app_metadata, which only the server can
 * write, and read by /welcome to show "Zmień" instead of "Ustaw".
 */
export async function markPasswordSet() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    { data: claims },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getClaims()]);
  if (!user || user.app_metadata?.has_password === true) return;
  // Only a session opened from an e-mail link — the password-reset link that
  // just set the password (Supabase records reset and sign-in links alike as
  // "otp") — may set the flag; a password or OAuth session cannot. The flag
  // only decides whether /welcome offers "Zmień" or "Ustaw".
  const methods = ((claims?.claims?.amr as Array<{ method?: string }> | undefined) ?? []).map((entry) => entry.method);
  if (!methods.includes("otp")) return;
  await createAdminClient().auth.admin.updateUserById(user.id, { app_metadata: { has_password: true } });
}

export type DeleteAccountResult = { ok: true } | { ok: false; message: string };

/**
 * Deletes the signed-in user's account for good. Three gates, in order: a
 * valid session (checked against Supabase, not just the cookie), the address
 * typed back as confirmation, and a per-user rate limit. Rows that belong to the user should reference
 * auth.users with ON DELETE CASCADE, so deleting the user removes them too;
 * there are no such tables yet.
 */
export async function deleteAccount(input: { confirmation: string }): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Twoja sesja wygasła. Zaloguj się ponownie." };

  if (!user.email || input.confirmation.trim().toLowerCase() !== user.email.toLowerCase()) {
    return { ok: false, message: "Wpisz swój adres e-mail, aby potwierdzić." };
  }

  const limit = take([{ key: `delete-account:${user.id}`, max: 5, windowMs: 15 * 60_000 }]);
  if (!limit.ok) return { ok: false, message: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie." };

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) return { ok: false, message: GENERIC_ERROR };

  // The user is gone; drop this browser's now-useless session cookies.
  await supabase.auth.signOut({ scope: "local" });
  return { ok: true };
}
