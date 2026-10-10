import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AccountPanel, type AccountSummary, type SignInMethod } from "@/components/account/AccountPanel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Witaj w Examax",
  robots: { index: false, follow: false },
};


/**
 * Where a finished sign-in lands while the dashboard is being built. The
 * proxy has already turned away visitors without a session; this asks
 * Supabase for the user again (`getUser` checks the token with the server,
 * not just its signature), so a revoked session cannot see the page.
 */
export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const supabase = await createClient();
  const [
    {
      data: { user },
      error,
    },
    { notice },
  ] = await Promise.all([supabase.auth.getUser(), searchParams]);
  // A session whose account is gone (deleted elsewhere): say so, not just "log in".
  if (!user) redirect(error?.code === "user_not_found" ? "/auth/deleted" : "/login?next=/welcome");

  const providers = [...new Set((user.identities ?? []).map((identity) => identity.provider))];
  const { data: passkeyRows } = await supabase.auth.passkey.list();
  const passkeys = (passkeyRows ?? []).map((passkey) => ({
    id: passkey.id,
    name: passkey.friendly_name || "Klucz dostępu",
    createdAt: passkey.created_at,
    lastUsedAt: passkey.last_used_at ?? null,
  }));
  // New when this sign-in is the account's first: a Google or Microsoft
  // account is created by the sign-in itself, and an e-mail account's first
  // sign-in is the click on its activation link.
  const signedInAt = Date.parse(user.last_sign_in_at ?? user.created_at);
  const startedAt = [user.created_at, user.email_confirmed_at].filter(Boolean).map((at) => Date.parse(at as string));
  const account: AccountSummary = {
    email: user.email ?? "",
    isNew: startedAt.some((at) => Math.abs(signedInAt - at) < 2 * 60_000),
    pendingEmail: user.new_email ?? null,
    // An e-mail account has a password from the start; a Google or Microsoft
    // one only once it sets one (lib/auth/actions.ts, markPasswordSet).
    hasPassword: providers.includes("email") || user.app_metadata?.has_password === true,
    methods: [
      ...(providers.includes("email") || user.app_metadata?.has_password === true ? (["email"] as const) : []),
      ...providers.filter((provider): provider is SignInMethod => provider === "google" || provider === "azure" || provider === "facebook"),
      ...(passkeys.length ? (["passkey"] as const) : []),
    ],
    passkeys,
  };

  const arrival =
    notice === "verified"
      ? { message: "Adres e-mail został pomyślnie zweryfikowany.", tone: "success" as const }
      : notice === "email-change"
      ? account.pendingEmail
        ? { message: "Potwierdź zmianę także w wiadomości wysłanej na drugi adres.", tone: "success" as const }
        : { message: "Adres e-mail został zmieniony.", tone: "success" as const }
      : undefined;

  return (
    <AuthLayout terms={false}>
      <AccountPanel account={account} notice={arrival} />
    </AuthLayout>
  );
}
