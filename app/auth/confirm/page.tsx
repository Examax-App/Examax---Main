import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ConfirmCard, ConfirmInvalid } from "@/components/auth/ConfirmCard";
import { confirmEmailLink } from "@/app/auth/confirm/actions";
import { isEmailOtpType, linkIntent } from "@/lib/auth/emailLinks";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Potwierdź",
  robots: { index: false, follow: false },
};

/**
 * Where every e-mail link lands (supabase/templates/). The page confirms by
 * itself the moment it opens — a POST its script sends (ConfirmCard,
 * autoSubmit) — and moves on to where the link leads, with a toast. Never a
 * GET that spends the token on arrival: mail scanners (Gmail's, Outlook's
 * Safe Links in school accounts) fetch links on their own, and would use the
 * link up before the student ever clicked it.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string; intent?: string; code?: string; message?: string; error_code?: string }>;
}) {
  const { token_hash: tokenHash, type, next, intent, code, message, error_code: errorCode } = await searchParams;

  // Templates left at Supabase's default ({{ .ConfirmationURL }}) send the
  // link to Supabase's own /verify, which comes back here with the outcome
  // instead of a token: an error, or — halfway through a secure address
  // change — "Confirmation link accepted. Please proceed to confirm link sent
  // to the other email".
  if (!tokenHash && errorCode) redirect(`/verify?error=${errorCode === "otp_expired" ? "expired" : "invalid"}`);
  if (!tokenHash && message && /other email/i.test(message)) redirect("/verify?notice=email-change-pending");

  // A template left at Supabase's default ({{ .ConfirmationURL }}) comes back
  // here with a PKCE code instead of a token; /auth/callback exchanges it.
  if (!tokenHash && code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&source=email&intent=${encodeURIComponent(intent ?? "")}&next=${encodeURIComponent(safeNext(next))}`);
  }

  if (!tokenHash || !isEmailOtpType(type)) {
    return (
      <AuthLayout terms={false}>
        <ConfirmInvalid />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout terms={false}>
      <ConfirmCard
        intent={linkIntent(type, intent)}
        action={confirmEmailLink}
        autoSubmit
        fields={{ token_hash: tokenHash, type, next: safeNext(next), intent: intent ?? "" }}
      />
    </AuthLayout>
  );
}
