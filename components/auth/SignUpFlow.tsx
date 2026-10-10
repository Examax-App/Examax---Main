"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/ui/Link";
import {
  AnimatedHeight,
  AuthButton,
  AuthField,
  AuthHeading,
  EmailSummary,
  InstitutionBanner,
  PasswordField,
  Separator,
  canAutoFocus,
  useEmailField,
} from "@/components/auth/pieces";
import { InboxNotice } from "@/components/auth/InboxNotice";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { Turnstile, preloadTurnstile, turnstileMessage, type TurnstileHandle } from "@/components/auth/Turnstile";
import { ACCEPTED_PASSWORD_SCORE, PasswordStrength, scorePassword } from "@/components/ui/PasswordStrength";
import { Toast, useToast, type ToastTone } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { emailRedirect, offerToSavePassword } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import type { ProviderStatus } from "@/lib/auth/providers";

/*
 * Dub's register flow (dubinc/dub: register/page-client.tsx,
 * ui/auth/register/*) on Supabase, in three steps: the address (with
 * Google, Microsoft and Facebook under "lub"), a password for it — sent
 * after the invisible Turnstile check — then "Sprawdź skrzynkę" while the
 * activation link is on its way. The address stays pinned — and changeable — on the password step.
 *
 * An address that already has a confirmed account gets no e-mail from
 * Supabase (it logs a "repeated signup" and answers with a user that has no
 * identities), so instead of an inbox step that would wait forever, the form
 * says the account exists and points to signing in. An unconfirmed address
 * gets a fresh activation link and the inbox step, as a new one does.
 */

type Step = "email" | "password" | "inbox";

export function SignUpFlow({ next, providers }: { next: string; providers: ProviderStatus }) {
  const [step, setStep] = useState<Step>("email");
  const { toast, show, dismiss } = useToast();
  const email = useEmailField("", { strict: true, onRejected: () => show("Nie możemy Cię zarejestrować na ten adres e-mail.", "error") });

  const resend = async (captchaToken: string) => {
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: email.value,
      options: { captchaToken, emailRedirectTo: emailRedirect(next) },
    });
    if (error) {
      show(authErrorMessage(error), "error");
      return false;
    }
    show(`Wysłaliśmy nowy link na ${email.value}.`, "success");
    return true;
  };

  return (
    <div className="w-full max-w-sm">
      {step === "inbox" ? (
        <InboxNotice
          email={email.value}
          lead="Wysłaliśmy link aktywacyjny na"
          backLabel="Użyj innego adresu"
          onBack={() => setStep("email")}
          onResend={resend}
          action="resend-signup"
          notify={show}
        />
      ) : (
        <>
          <AuthHeading>Utwórz konto Examax</AuthHeading>
          <div className="mt-8">
            <SignUpForm
              step={step}
              email={email}
              next={next}
              providers={providers}
              onEmail={() => setStep("password")}
              onChangeEmail={() => setStep("email")}
              onSent={() => setStep("inbox")}
              notify={show}
              dismissNotice={dismiss}
            />
          </div>
          <p className="mt-6 text-center text-sm font-medium text-fog">
            Masz już konto?&nbsp;
            <Link href="/login" className="font-semibold text-slate transition-colors hover:text-charcoal">
              Zaloguj się
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

function SignUpForm({
  step,
  email,
  next,
  providers,
  onEmail,
  onChangeEmail,
  onSent,
  notify,
  dismissNotice,
}: {
  step: "email" | "password";
  email: ReturnType<typeof useEmailField>;
  next: string;
  providers: ProviderStatus;
  onEmail: () => void;
  onChangeEmail: () => void;
  onSent: () => void;
  notify: (message: string, tone: ToastTone) => void;
  dismissNotice: () => void;
}) {
  const router = useRouter();
  const [focusEmail, setFocusEmail] = useState(() => Boolean(email.value) || canAutoFocus());
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [creating, setCreating] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);
  // "Załóż konto" waits for Cloudflare's approval; until then it is simply disabled.
  const [verified, setVerified] = useState(false);
  useEffect(preloadTurnstile, []);

  const create = async () => {
    if (!turnstile.current) return;
    setCreating(true);
    let captchaToken: string;
    try {
      captchaToken = await turnstile.current.getToken();
    } catch (error) {
      setCreating(false);
      notify(turnstileMessage(error), "error");
      return;
    }
    const { data, error } = await createClient().auth.signUp({
      email: email.value,
      password,
      options: { captchaToken, emailRedirectTo: emailRedirect(next) },
    });
    setCreating(false);
    // Anything but the inbox step spent the token for nothing: check again.
    if (error || data.user?.identities?.length === 0) turnstile.current?.reset();

    if (error) {
      if (error.code === "weak_password") setPasswordError(authErrorMessage(error));
      else notify(authErrorMessage(error), "error");
      return;
    }
    if (data.user && data.user.identities?.length === 0) {
      notify("Konto z tym adresem już istnieje. Zaloguj się albo użyj „Nie pamiętasz hasła?”.", "error");
      return;
    }
    // The browser may offer to save the new password; never wait on its answer.
    void offerToSavePassword(email.value, password);
    // With "Confirm email" switched off in Supabase the account is live at once.
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    onSent();
  };

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
                if (email.accept()) {
                  dismissNotice();
                  onEmail();
                }
              }}
            >
              <AuthField {...email.field} label="E-mail" name="email" placeholder="ala.nowak@gmail.com" autoComplete="email" autoFocus={focusEmail} />
              <AuthButton type="submit">Kontynuuj</AuthButton>
            </form>
            <Separator />
            <ProviderButtons providers={providers} next={next} notify={notify} />
          </>
        ) : (
          <form
            noValidate
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (!password) {
                setPasswordError("Wpisz hasło.");
                return;
              }
              // An account needs three bars; below that the meter's own tip
              // says what to do, so the toast only asks for a stronger one.
              if (scorePassword(password) < ACCEPTED_PASSWORD_SCORE) {
                notify("Spróbuj utworzyć silniejsze hasło.", "error");
                return;
              }
              dismissNotice();
              create();
            }}
          >
            <EmailSummary
              email={email.value}
              onChange={() => {
                setFocusEmail(true);
                onChangeEmail();
              }}
            />
            {/* The field is the auth screens' own (show/hide eye, Caps Lock
                warning), marked "new-password" so the browser and password
                managers offer to suggest, fill and save one — paired with
                EmailSummary's hidden username. The strength meter sits right
                under it. */}
            <div>
              <PasswordField
                label="Hasło"
                name="password"
                autoComplete="new-password"
                autoFocus
                value={password}
                error={passwordError}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError(undefined);
                }}
              />
              <PasswordStrength value={password} className="mt-3" />
            </div>
            <Turnstile ref={turnstile} action="signup" visible onVerifiedChange={setVerified} />
            <AuthButton type="submit" loading={creating} disabled={!verified}>
              {creating ? "Tworzenie konta…" : "Załóż konto"}
            </AuthButton>
          </form>
        )}
      </div>
    </AnimatedHeight>
  );
}
