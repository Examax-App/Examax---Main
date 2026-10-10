"use client";

import { useRef, useState } from "react";
import { AuthButton, AuthField, useEmailField } from "@/components/auth/pieces";
import { InboxNotice } from "@/components/auth/InboxNotice";
import { Turnstile, turnstileMessage, type TurnstileHandle } from "@/components/auth/Turnstile";
import { Toast, useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { emailRedirect } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { AFTER_SIGN_IN } from "@/lib/auth/redirect";

/**
 * A new activation link, for a student whose link expired or never came:
 * the address and one button (the invisible Turnstile check runs when it is
 * pressed), then the same inbox step sign-up ends on. Supabase answers alike for any address, so this reveals nothing about
 * who has an account.
 */
export function VerifyResend() {
  const email = useEmailField("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);
  const { toast, show } = useToast();

  const resend = async (address: string, captchaToken: string) => {
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: address,
      options: { captchaToken, emailRedirectTo: emailRedirect(AFTER_SIGN_IN) },
    });
    if (error) show(authErrorMessage(error), "error");
    return !error;
  };

  return (
    <>
      {sentTo ? (
        <InboxNotice
          email={sentTo}
          lead="Wysłaliśmy nowy link aktywacyjny na"
          onResend={async (captchaToken) => {
            const sent = await resend(sentTo, captchaToken);
            if (sent) show(`Wysłaliśmy nowy link na ${sentTo}.`, "success");
            return sent;
          }}
          action="resend-verify"
          notify={show}
        />
      ) : (
        <form
          noValidate
          className="flex flex-col gap-6 p-1"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!email.accept() || !turnstile.current) return;
            setSending(true);
            try {
              const sent = await resend(email.value, await turnstile.current.getToken());
              if (sent) setSentTo(email.value);
            } catch (error) {
              show(turnstileMessage(error), "error");
            } finally {
              setSending(false);
            }
          }}
        >
          <AuthField {...email.field} label="E-mail" name="email" placeholder="ala@szkola.pl" autoComplete="email" />
          <Turnstile ref={turnstile} action="verify" />
          <AuthButton type="submit" loading={sending}>
            Wyślij nowy link
          </AuthButton>
        </form>
      )}
      <Toast toast={toast} />
    </>
  );
}
