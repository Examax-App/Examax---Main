"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock } from "lucide-react";
import {
  AnimatedHeight,
  AuthButton,
  AuthField,
  EmailSummary,
  PasswordField,
  Separator,
  UNAVAILABLE_DELAY,
  canAutoFocus,
  useEmailField,
} from "@/components/auth/pieces";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { Turnstile, preloadTurnstile, turnstileMessage, type TurnstileHandle } from "@/components/auth/Turnstile";
import { createClient } from "@/lib/supabase/client";
import { emailRedirect, offerToSavePassword } from "@/lib/auth/client";
import { passkeyErrorMessage, passkeysSupported } from "@/lib/auth/passkeys";
import { authErrorMessage } from "@/lib/auth/errors";
import type { ProviderStatus } from "@/lib/auth/providers";
import type { ToastTone } from "@/components/ui/Toast";

/*
 * Dub's LoginForm (dubinc/dub: ui/auth/login/login-form.tsx and its method
 * components), signing in through Supabase:
 *
 *  - e-mail sits on top; "Kontynuuj" checks the address and moves to the
 *    password step, where the address stays pinned with a way to change it;
 *  - every send on that step — the password, a sign-in link, a password
 *    reset — first runs the invisible Turnstile check (components/auth/
 *    Turnstile.tsx) and carries its token, which Supabase verifies before
 *    doing anything;
 *  - Google, Microsoft and Facebook follow under "lub", then passkey and
 *    school account as a quieter pair. A passkey signs in through the
 *    device's own prompt (Supabase's signInWithPasskey, after an invisible
 *    Turnstile check); Facebook and school account still answer "not
 *    available yet".
 * Every change eases the block to its new height.
 */

type Busy = "password" | "link" | "reset" | "resend" | "passkey" | "school";

export function LoginForm({
  initialEmail,
  next,
  providers,
  onInbox,
  notify,
}: {
  initialEmail: string;
  /** Where a successful sign-in goes (already made safe by the page). */
  next: string;
  providers: ProviderStatus;
  /** An e-mail has gone out: a sign-in link, a password reset, or a new confirmation link. */
  onInbox: (reason: "link" | "reset" | "confirm", email: string) => void;
  notify: (message: string, tone: ToastTone) => void;
}) {
  const router = useRouter();
  const email = useEmailField(initialEmail);
  const [step, setStep] = useState<"email" | "password">("email");
  // Focus the address on arrival (not on touch screens) and whenever someone comes back to it.
  const [focusEmail, setFocusEmail] = useState(() => Boolean(initialEmail) || canAutoFocus());
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [busy, setBusy] = useState<Busy | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const passkeyTurnstile = useRef<TurnstileHandle>(null);
  // Every send on the password step waits for Cloudflare's approval.
  const [verified, setVerified] = useState(false);
  useEffect(preloadTurnstile, []);

  const blocked = (method: Busy) => busy !== null && busy !== method;

  /** Passkey and school account: not built yet — a moment of checking, then they say so. */
  const unavailable = (method: Busy, label: string) => () => {
    setBusy(method);
    window.setTimeout(() => {
      setBusy(null);
      notify(`${label} nie jest jeszcze dostępne.`, "error");
    }, UNAVAILABLE_DELAY);
  };

  /** A passkey: no address needed — the device offers the passkeys it holds for examax.app. */
  const signInWithPasskey = async () => {
    if (!passkeysSupported()) return notify("Ta przeglądarka nie obsługuje kluczy dostępu.", "error");
    if (!passkeyTurnstile.current) return;
    setBusy("passkey");
    try {
      let captchaToken: string;
      try {
        captchaToken = await passkeyTurnstile.current.getToken();
      } catch (error) {
        notify(turnstileMessage(error), "error");
        return;
      }
      const { error } = await createClient().auth.signInWithPasskey({ options: { captchaToken } });
      if (!error) {
        router.replace(next);
        router.refresh();
        return;
      }
      const message = passkeyErrorMessage(error);
      if (message) notify(message, "error");
    } finally {
      setBusy(null);
    }
  };

  /** One Supabase send: the Turnstile check first, then the request with its token; `request` answers whether it succeeded. */
  const send = async (method: Busy, request: (captchaToken: string) => Promise<boolean>) => {
    if (!turnstile.current) return;
    setBusy(method);
    try {
      let captchaToken: string;
      try {
        captchaToken = await turnstile.current.getToken();
      } catch (error) {
        notify(turnstileMessage(error), "error");
        return;
      }
      // A failed send spent the token for nothing: earn a fresh one for the next try.
      if (!(await request(captchaToken))) turnstile.current?.reset();
    } finally {
      setBusy(null);
    }
  };

  const signIn = () =>
    send("password", async (captchaToken) => {
      const { error } = await createClient().auth.signInWithPassword({ email: email.value, password, options: { captchaToken } });
      if (!error) {
        void offerToSavePassword(email.value, password);
        router.replace(next);
        router.refresh();
        return true;
      }
      if (error.code === "email_not_confirmed") setUnconfirmed(true);
      if (error.code === "invalid_credentials") setPasswordError(authErrorMessage(error));
      else notify(authErrorMessage(error), "error");
      return false;
    });

  const sendLink = () =>
    send("link", async (captchaToken) => {
      const { error } = await createClient().auth.signInWithOtp({
        email: email.value,
        options: { captchaToken, shouldCreateUser: false, emailRedirectTo: emailRedirect(next, "login") },
      });
      // An unknown address answers like a known one ("otp_disabled": no
      // account to send to), so this form never reveals who has an account.
      if (error && error.code !== "otp_disabled") {
        notify(authErrorMessage(error), "error");
        return false;
      }
      onInbox("link", email.value);
      return true;
    });

  const sendReset = () =>
    send("reset", async (captchaToken) => {
      const { error } = await createClient().auth.resetPasswordForEmail(email.value, {
        captchaToken,
        redirectTo: emailRedirect("/reset-password"),
      });
      if (error) {
        notify(authErrorMessage(error), "error");
        return false;
      }
      onInbox("reset", email.value);
      return true;
    });

  const resendConfirmation = () =>
    send("resend", async (captchaToken) => {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email: email.value,
        options: { captchaToken, emailRedirectTo: emailRedirect(next) },
      });
      if (error) {
        notify(authErrorMessage(error), "error");
        return false;
      }
      onInbox("confirm", email.value);
      return true;
    });

  return (
    <AnimatedHeight>
      <div className="flex flex-col gap-3 p-1">
        {step === "email" ? (
          <>
            <form
              noValidate
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (email.accept()) setStep("password");
              }}
            >
              <AuthField {...email.field} label="E-mail" name="email" placeholder="ala@szkola.pl" autoComplete="email" autoFocus={focusEmail} />
              <AuthButton type="submit">Kontynuuj</AuthButton>
            </form>

            <Separator />

            <ProviderButtons providers={providers} next={next} notify={notify} disabled={busy !== null} />
            <div className="grid grid-cols-2 gap-3">
              <AuthButton
                variant="secondary"
                icon={<KeyRound className="size-4" strokeWidth={1.75} />}
                loading={busy === "passkey"}
                disabled={blocked("passkey")}
                onClick={signInWithPasskey}
              >
                Klucz dostępu
              </AuthButton>
              <AuthButton
                variant="secondary"
                // -ml-px: the padlock's glyph carries extra room on its left, so the
                // pair sat half a pixel right of centre; this pulls both back.
                icon={<Lock className="-ml-px size-4" strokeWidth={1.75} />}
                loading={busy === "school"}
                disabled={blocked("school")}
                onClick={unavailable("school", "Logowanie przez konto szkoły")}
              >
                Konto szkoły
              </AuthButton>
            </div>
            <Turnstile ref={passkeyTurnstile} action="passkey" />
          </>
        ) : (
          <>
            <form
              noValidate
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (!password) {
                  setPasswordError("Wpisz hasło.");
                  return;
                }
                signIn();
              }}
            >
              <EmailSummary
                email={email.value}
                onChange={() => {
                  setStep("email");
                  setFocusEmail(true);
                  setPassword("");
                  setPasswordError(undefined);
                  setUnconfirmed(false);
                }}
              />
              <PasswordField
                label="Hasło"
                name="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                error={passwordError}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError(undefined);
                }}
                aside={
                  <button
                    type="button"
                    disabled={busy !== null || !verified}
                    onClick={sendReset}
                    className="cursor-pointer text-xs leading-none text-fog underline underline-offset-2 transition-colors hover:text-charcoal disabled:cursor-not-allowed"
                  >
                    Nie pamiętasz hasła?
                  </button>
                }
              />
              <Turnstile ref={turnstile} action="login" visible onVerifiedChange={setVerified} />
              <AuthButton type="submit" loading={busy === "password"} disabled={!verified || blocked("password")}>
                Zaloguj się
              </AuthButton>
              {unconfirmed && (
                <p className="-mt-2 text-center text-sm text-fog">
                  Adres nie jest jeszcze potwierdzony.{" "}
                  <button
                    type="button"
                    disabled={busy !== null || !verified}
                    onClick={resendConfirmation}
                    className="cursor-pointer font-semibold text-slate transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:text-silver"
                  >
                    Wyślij link ponownie
                  </button>
                </p>
              )}
            </form>

            <Separator />

            <AuthButton variant="secondary" loading={busy === "link"} disabled={!verified || blocked("link")} onClick={sendLink}>
              Wyślij link do logowania
            </AuthButton>
          </>
        )}
      </div>
    </AnimatedHeight>
  );
}
