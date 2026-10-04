"use client";

import { useState } from "react";
import { KeyRound, Lock } from "lucide-react";
import {
  AnimatedHeight,
  AuthButton,
  AuthField,
  EmailSummary,
  FacebookGlyph,
  GoogleGlyph,
  MicrosoftGlyph,
  PasswordField,
  PREVIEW_DELAY,
  Separator,
  canAutoFocus,
  useEmailField,
} from "@/components/auth/pieces";
import type { ToastTone } from "@/components/ui/Toast";

/*
 * Dub's LoginForm (dubinc/dub: ui/auth/login/login-form.tsx and its method
 * components), UI only — nothing signs anyone in and nothing is remembered:
 *
 *  - e-mail sits on top; "Kontynuuj" checks the address and moves to the
 *    password step, where the address stays pinned with a way to change it,
 *    and a sign-in link by e-mail is offered instead of a password;
 *  - Google, Facebook and Microsoft follow under "lub", then passkey and school SSO as a
 *    quieter pair — SSO opens a field for the school's identifier under it.
 * Every change eases the block to its new height.
 */

type Busy = "password" | "link" | "google" | "facebook" | "microsoft" | "passkey" | "sso";

export function LoginForm({
  initialEmail,
  onInbox,
  notify,
}: {
  initialEmail: string;
  /** The e-mail has "gone out": a sign-in link, or a password reset. */
  onInbox: (reason: "link" | "reset", email: string) => void;
  /** A toast; nothing here signs anyone in yet, so every method ends in one. */
  notify: (message: string, tone: ToastTone) => void;
}) {
  const email = useEmailField(initialEmail);
  const [step, setStep] = useState<"email" | "password">("email");
  // Focus the address on arrival (not on touch screens) and whenever someone comes back to it.
  const [focusEmail, setFocusEmail] = useState(() => Boolean(initialEmail) || canAutoFocus());
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [showSSO, setShowSSO] = useState(false);
  const [school, setSchool] = useState("");
  const [schoolError, setSchoolError] = useState<string>();
  const [busy, setBusy] = useState<Busy | null>(null);

  /** A method "runs": a moment of loading, then what would happen next. */
  const run = (method: Busy, then: () => void) => {
    setBusy(method);
    window.setTimeout(() => {
      setBusy(null);
      then();
    }, PREVIEW_DELAY);
  };
  const blocked = (method: Busy) => busy !== null && busy !== method;
  const unavailable = (method: Busy, label: string) => () => run(method, () => notify(`${label} nie jest jeszcze dostępne.`, "error"));

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

            <AuthButton variant="secondary" icon={<GoogleGlyph />} loading={busy === "google"} disabled={blocked("google")} onClick={unavailable("google", "Logowanie przez Google")}>
              Kontynuuj przez Google
            </AuthButton>
            <AuthButton variant="secondary" icon={<FacebookGlyph />} loading={busy === "facebook"} disabled={blocked("facebook")} onClick={unavailable("facebook", "Logowanie przez Facebook")}>
              Kontynuuj przez Facebook
            </AuthButton>
            <AuthButton variant="secondary" icon={<MicrosoftGlyph />} loading={busy === "microsoft"} disabled={blocked("microsoft")} onClick={unavailable("microsoft", "Logowanie przez Microsoft")}>
              Kontynuuj przez Microsoft
            </AuthButton>
            <div className="grid grid-cols-2 gap-3">
              <AuthButton
                variant="secondary"
                icon={<KeyRound className="size-4" strokeWidth={1.75} />}
                loading={busy === "passkey"}
                disabled={blocked("passkey")}
                onClick={unavailable("passkey", "Logowanie kluczem dostępu")}
              >
                Klucz dostępu
              </AuthButton>
              <AuthButton
                variant="secondary"
                icon={<Lock className="size-4" strokeWidth={1.75} />}
                aria-expanded={showSSO}
                aria-controls="login-sso"
                disabled={blocked("sso")}
                onClick={() => setShowSSO((shown) => !shown)}
              >
                SSO szkoły
              </AuthButton>
            </div>

            {showSSO && (
              <form
                id="login-sso"
                noValidate
                className="flex flex-col gap-3 pt-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!school.trim()) {
                    setSchoolError("Wpisz identyfikator szkoły.");
                    return;
                  }
                  run("sso", () => notify("Logowanie przez szkołę nie jest jeszcze dostępne.", "error"));
                }}
              >
                <AuthField
                  label="Identyfikator szkoły"
                  name="school"
                  autoComplete="organization"
                  autoFocus
                  value={school}
                  error={schoolError}
                  onChange={(event) => {
                    setSchool(event.target.value);
                    setSchoolError(undefined);
                  }}
                />
                <AuthButton type="submit" variant="secondary" loading={busy === "sso"} disabled={blocked("sso")}>
                  Kontynuuj przez SSO
                </AuthButton>
              </form>
            )}
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
                run("password", () => notify("Logowanie hasłem nie jest jeszcze dostępne.", "error"));
              }}
            >
              <EmailSummary
                email={email.value}
                onChange={() => {
                  setStep("email");
                  setFocusEmail(true);
                  setPassword("");
                  setPasswordError(undefined);
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
                    onClick={() => onInbox("reset", email.value)}
                    className="cursor-pointer text-xs leading-none text-fog underline underline-offset-2 transition-colors hover:text-charcoal"
                  >
                    Nie pamiętasz hasła?
                  </button>
                }
              />
              <AuthButton type="submit" loading={busy === "password"} disabled={blocked("password")}>
                Zaloguj się
              </AuthButton>
            </form>

            <Separator />

            <AuthButton variant="secondary" loading={busy === "link"} disabled={blocked("link")} onClick={() => run("link", () => onInbox("link", email.value))}>
              Wyślij link do logowania
            </AuthButton>
          </>
        )}
      </div>
    </AnimatedHeight>
  );
}
