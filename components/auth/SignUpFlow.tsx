"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import {
  AnimatedHeight,
  AuthButton,
  AuthField,
  AuthHeading,
  EmailSummary,
  FacebookGlyph,
  GoogleGlyph,
  MicrosoftGlyph,
  InstitutionBanner,
  PasswordField,
  PREVIEW_DELAY,
  Separator,
  canAutoFocus,
  useEmailField,
} from "@/components/auth/pieces";
import { ACCEPTED_PASSWORD_SCORE, PasswordStrength, scorePassword } from "@/components/ui/PasswordStrength";
import { Toast, useToast, type ToastTone } from "@/components/ui/Toast";

/*
 * Dub's register flow (dubinc/dub: register/page-client.tsx,
 * ui/auth/register/*), UI only, in two steps: the address (with Google,
 * Facebook and Microsoft under "lub") and a password for it. The address
 * stays pinned — and changeable — on the password step.
 *
 * Accounts are not open yet, so "Załóż konto" ends where the social buttons
 * do: a moment of work, then the red toast "Rejestracja nie jest jeszcze
 * dostępna." There is no code step for now — it would promise an e-mail that
 * never comes. The six-digit code cells (components/ui/OtpInput.tsx) are
 * kept for when sign-up opens; the step that used them, with its
 * "Potwierdź adres e-mail" heading and resend line, is in git history
 * (removed 2026-10-05).
 */

type Step = "email" | "password";

export function SignUpFlow() {
  const [step, setStep] = useState<Step>("email");
  const { toast, show, dismiss } = useToast();
  const email = useEmailField("", { strict: true, onRejected: () => show("Nie możemy Cię zarejestrować na ten adres e-mail.", "error") });
  const toEmail = () => setStep("email");

  return (
    <div className="w-full max-w-sm">
      <AuthHeading>Załóż konto w Examax</AuthHeading>
      <div className="mt-8">
        <SignUpForm
          step={step}
          email={email}
          onEmail={() => setStep("password")}
          onChangeEmail={toEmail}
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
      <Toast toast={toast} />
    </div>
  );
}

function SignUpForm({
  step,
  email,
  onEmail,
  onChangeEmail,
  notify,
  dismissNotice,
}: {
  step: "email" | "password";
  email: ReturnType<typeof useEmailField>;
  onEmail: () => void;
  onChangeEmail: () => void;
  notify: (message: string, tone: ToastTone) => void;
  dismissNotice: () => void;
}) {
  const [focusEmail, setFocusEmail] = useState(() => Boolean(email.value) || canAutoFocus());
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [pending, setPending] = useState<"create" | "google" | "facebook" | "microsoft" | null>(null);

  const run = (method: NonNullable<typeof pending>, then: () => void) => {
    setPending(method);
    window.setTimeout(() => {
      setPending(null);
      then();
    }, PREVIEW_DELAY);
  };
  const blocked = (method: NonNullable<typeof pending>) => pending !== null && pending !== method;

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
            <AuthButton
              variant="secondary"
              icon={<GoogleGlyph />}
              loading={pending === "google"}
              disabled={blocked("google")}
              onClick={() => run("google", () => notify("Rejestracja przez Google nie jest jeszcze dostępna.", "error"))}
            >
              Kontynuuj przez Google
            </AuthButton>
            <AuthButton
              variant="secondary"
              icon={<FacebookGlyph />}
              loading={pending === "facebook"}
              disabled={blocked("facebook")}
              onClick={() => run("facebook", () => notify("Rejestracja przez Facebook nie jest jeszcze dostępna.", "error"))}
            >
              Kontynuuj przez Facebook
            </AuthButton>
            <AuthButton
              variant="secondary"
              icon={<MicrosoftGlyph />}
              loading={pending === "microsoft"}
              disabled={blocked("microsoft")}
              onClick={() => run("microsoft", () => notify("Rejestracja przez Microsoft nie jest jeszcze dostępna.", "error"))}
            >
              Kontynuuj przez Microsoft
            </AuthButton>
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
              run("create", () => notify("Rejestracja nie jest jeszcze dostępna.", "error"));
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
            <AuthButton type="submit" loading={pending === "create"}>
              {pending === "create" ? "Tworzenie konta…" : "Załóż konto"}
            </AuthButton>
          </form>
        )}
      </div>
    </AnimatedHeight>
  );
}
