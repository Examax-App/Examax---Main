"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { LoginForm } from "@/components/auth/LoginForm";
import { InboxNotice } from "@/components/auth/InboxNotice";
import { AuthHeading, InstitutionBanner } from "@/components/auth/pieces";
import { Toast, useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { emailRedirect } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import type { ProviderStatus } from "@/lib/auth/providers";

/**
 * Dub's login page body (dubinc/dub: (auth-marketing)/login/page.tsx), in
 * Polish: the form, the sign-up link and the institution banner — or, once
 * an e-mail has gone out (a sign-in link, a password reset, a new
 * confirmation link), the check-your-inbox step, which can send it again
 * and leads back to the form with the address kept.
 */

const LEADS = {
  link: "Wysłaliśmy link do logowania na",
  reset: "Wysłaliśmy link do ustawienia nowego hasła na",
  confirm: "Wysłaliśmy nowy link aktywacyjny na",
} as const;

export function LoginPanel({
  next,
  providers,
  notice,
}: {
  next: string;
  providers: ProviderStatus;
  /** A message the page arrived with — a failed OAuth return, a confirmed address. */
  notice?: { message: string; tone: "success" | "error" };
}) {
  const [inbox, setInbox] = useState<{ reason: keyof typeof LEADS; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const { toast, show } = useToast();

  useEffect(() => {
    if (notice) show(notice.message, notice.tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on arrival
  }, []);

  const resend = async (captchaToken: string) => {
    if (!inbox) return false;
    const auth = createClient().auth;
    const { error } =
      inbox.reason === "reset"
        ? await auth.resetPasswordForEmail(inbox.email, { captchaToken, redirectTo: emailRedirect("/reset-password") })
        : inbox.reason === "link"
          ? await auth.signInWithOtp({ email: inbox.email, options: { captchaToken, shouldCreateUser: false, emailRedirectTo: emailRedirect(next, "login") } })
          : await auth.resend({ type: "signup", email: inbox.email, options: { captchaToken, emailRedirectTo: emailRedirect(next) } });
    if (error && error.code !== "otp_disabled") {
      show(authErrorMessage(error), "error");
      return false;
    }
    show(`Wysłaliśmy nową wiadomość na ${inbox.email}.`, "success");
    return true;
  };

  return (
    <div className="w-full max-w-sm">
      {inbox ? (
        <InboxNotice
          email={inbox.email}
          lead={LEADS[inbox.reason]}
          backLabel="Wróć do logowania"
          onBack={() => setInbox(null)}
          onResend={resend}
          action={`resend-${inbox.reason}`}
          notify={show}
        />
      ) : (
        <>
          <AuthHeading>Zaloguj się do Examax</AuthHeading>
          <div className="mt-8">
            <LoginForm
              initialEmail={email}
              next={next}
              providers={providers}
              notify={show}
              onInbox={(reason, address) => {
                setEmail(address);
                setInbox({ reason, email: address });
              }}
            />
          </div>
          <p className="mt-6 text-center text-sm font-medium text-fog">
            Nie masz konta?&nbsp;
            <Link href="/signup" className="font-semibold text-slate transition-colors hover:text-charcoal">
              Zarejestruj się
            </Link>
          </p>
          <div className="mt-12 w-full">
            <InstitutionBanner />
          </div>
        </>
      )}
      <Toast toast={toast} />
    </div>
  );
}
