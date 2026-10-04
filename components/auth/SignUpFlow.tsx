"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, MailCheck } from "lucide-react";
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
  NoticeIcon,
  PasswordField,
  PREVIEW_DELAY,
  ResendLine,
  Separator,
  canAutoFocus,
  useEmailField,
} from "@/components/auth/pieces";
import { OtpInput } from "@/components/ui/OtpInput";
import { ACCEPTED_PASSWORD_SCORE, PasswordStrength, scorePassword } from "@/components/ui/PasswordStrength";
import { Modal } from "@/components/ui/Modal";
import { Toast, useToast, type ToastTone } from "@/components/ui/Toast";

/*
 * Dub's register flow (dubinc/dub: register/page-client.tsx,
 * ui/auth/register/*), UI only, in three steps: the address (with Google,
 * Facebook and Microsoft under "lub"), a password for it, and the six-digit code sent to
 * it. The address stays pinned — and changeable — from the password step on.
 * Accounts are not open yet: the sixth digit is checked, then a dialog says
 * the account cannot be created. The code step itself stays as it is, ready
 * for when sign-up opens.
 */

type Step = "email" | "password" | "verify";

export function SignUpFlow() {
  const [step, setStep] = useState<Step>("email");
  const { toast, show, dismiss } = useToast();
  const email = useEmailField("", { strict: true, onRejected: () => show("Nie możemy Cię zarejestrować na ten adres e-mail.", "error") });
  const toEmail = () => setStep("email");

  return (
    <div className="w-full max-w-sm">
      {step === "email" || step === "password" ? (
        <>
          <AuthHeading>Załóż konto w Examax</AuthHeading>
          <div className="mt-8">
            <SignUpForm
              step={step}
              email={email}
              onEmail={() => setStep("password")}
              onChangeEmail={toEmail}
              onCreated={() => setStep("verify")}
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
      ) : (
        <div className="animate-auth-rise">
          <NoticeIcon icon={MailCheck} />
          <AuthHeading
            description={
              <>
                Wpisz 6-cyfrowy kod wysłany na <strong className="font-semibold text-steel">{email.value}</strong>.{" "}
                <button type="button" onClick={toEmail} className="cursor-pointer font-medium text-slate underline underline-offset-2 transition-colors hover:text-charcoal">
                  Zmień adres
                </button>
              </>
            }
          >
            Potwierdź adres e-mail
          </AuthHeading>
          <div className="mt-8">
            <VerifyForm onResend={() => show(`Wysłaliśmy nowy kod na ${email.value}.`, "success")} />
          </div>
        </div>
      )}
      <Toast toast={toast} />
    </div>
  );
}

function SignUpForm({
  step,
  email,
  onEmail,
  onChangeEmail,
  onCreated,
  notify,
  dismissNotice,
}: {
  step: "email" | "password";
  email: ReturnType<typeof useEmailField>;
  onEmail: () => void;
  onChangeEmail: () => void;
  onCreated: () => void;
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
              run("create", onCreated);
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

/**
 * The code step: the OtpInput cells, typed or pasted. The sixth digit sends
 * it — a moment of checking, then a dialog: accounts cannot be created yet.
 * Closing it clears the cells for another try; the other way out is home.
 * UI only.
 */
function VerifyForm({ onResend }: { onResend: () => void }) {
  const [checking, setChecking] = useState(false);
  const [refused, setRefused] = useState(false);
  // Remounts the cells empty after the dialog closes.
  const [attempt, setAttempt] = useState(0);

  const close = () => {
    setRefused(false);
    setAttempt((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <OtpInput
        key={attempt}
        autoFocus
        disabled={checking || refused}
        hint={checking ? "Sprawdzanie kodu…" : ""}
        onComplete={() => {
          setChecking(true);
          window.setTimeout(() => {
            setChecking(false);
            setRefused(true);
          }, PREVIEW_DELAY);
        }}
      />
      <ResendLine prompt="Kod nie dotarł?" onResend={onResend} />

      <Modal open={refused} onClose={close} labelledBy="signup-refused-title" className="max-w-sm">
        <div className="px-6 pb-6 pt-8 text-center">
          {/* NoticeIcon's tile, with the glyph in the error red */}
          <div aria-hidden className="mx-auto mb-5 grid size-12 place-items-center rounded-xl border border-ash bg-white shadow-sm">
            <CircleAlert className="size-5 text-[#dc2626]" strokeWidth={1.75} />
          </div>
          <h2 id="signup-refused-title" className="text-lg font-semibold text-charcoal">
            Nie można utworzyć konta
          </h2>
          <p className="mt-2 text-pretty text-sm text-fog">Zakładanie kont w Examaxie nie jest jeszcze dostępne. Spróbuj ponownie wkrótce.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="focus-ring inline-flex h-10 items-center justify-center rounded-lg bg-charcoal text-sm font-medium text-white ring-ash transition-all hover:ring-4"
            >
              Wróć na stronę główną
            </Link>
            <AuthButton variant="secondary" onClick={close} autoFocus>
              Zamknij
            </AuthButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
