"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlternativeBanner,
  AnimatedHeight,
  AppleGlyph,
  AuthButton,
  AuthField,
  GoogleGlyph,
  PREVIEW_DELAY,
  Separator,
  Toast,
  useToast,
} from "@/components/auth/pieces";
import { cn } from "@/lib/cn";

/*
 * Dub's register flow (dubinc/dub: register/page-client.tsx,
 * ui/auth/register/*), UI only. Sign-up leads with e-mail — the field, then
 * "Załóż konto", which first asks for a password and then moves to the
 * code step — with Google and Apple under "lub". The code step is Dub's six
 * 48×56 cells with a blinking caret, "Dalej" live once all six are in.
 */

const LAST_USED_KEY = "examax-last-used-auth-method";

export function SignUpFlow() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");
  const { toast, show } = useToast();

  return (
    <>
      {step === "signup" ? (
        <div className="w-full max-w-sm">
          <h3 className="text-center text-xl font-semibold text-charcoal">Załóż konto w Examax</h3>
          <div className="mt-8">
            <SignUpForm
              email={email}
              setEmail={setEmail}
              onSubmitted={() => setStep("verify")}
              onOAuth={(name) => show(`Podgląd: rejestracja przez ${name} ruszy razem z Examax.`)}
            />
          </div>
          <p className="mt-6 text-center text-sm font-medium text-fog">
            Masz już konto?&nbsp;
            <Link href="/login" className="font-semibold text-slate transition-colors hover:text-charcoal">
              Zaloguj się
            </Link>
          </p>
          <div className="mt-12 w-full">
            <AlternativeBanner text="Uczysz w szkole albo prowadzisz placówkę?" cta="Załóż konto dla instytucji" href="/schools" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-center text-xl font-semibold text-charcoal">Potwierdź adres e-mail</h3>
            <p className="text-base font-medium text-fog">
              Wpisz sześciocyfrowy kod wysłany na{" "}
              <strong className="font-semibold text-steel" title={email}>
                {email.length > 30 ? `${email.slice(0, 30)}…` : email}
              </strong>
            </p>
          </div>
          <div className="mt-12">
            <VerifyForm onDone={() => show("Podgląd: konto zostanie utworzone, gdy Examax wystartuje.")} onResend={() => show(`Wysłaliśmy nowy kod na ${email}.`)} />
          </div>
        </div>
      )}
      <Toast toast={toast} />
    </>
  );
}

function SignUpForm({
  email,
  setEmail,
  onSubmitted,
  onOAuth,
}: {
  email: string;
  setEmail: (value: string) => void;
  onSubmitted: () => void;
  onOAuth: (name: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<"email" | "google" | "apple" | null>(null);

  const oauth = (method: "google" | "apple", name: string) => {
    setPending(method);
    try {
      localStorage.setItem(LAST_USED_KEY, method);
    } catch {
      /* storage unavailable: the preview still runs */
    }
    window.setTimeout(() => {
      setPending(null);
      onOAuth(name);
    }, PREVIEW_DELAY);
  };

  return (
    <AnimatedHeight>
      <div className="flex flex-col gap-3 p-1">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // Dub's first submit asks for the password; the second sends the code.
            if (!showPassword) {
              setShowPassword(true);
              return;
            }
            setPending("email");
            window.setTimeout(() => {
              setPending(null);
              onSubmitted();
            }, PREVIEW_DELAY);
          }}
        >
          <div className="flex flex-col gap-y-6">
            <AuthField
              label="E-mail"
              type="email"
              placeholder="ala@szkola.pl"
              autoComplete="email"
              autoFocus={!showPassword}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {showPassword && (
              <div>
                <AuthField
                  label="Hasło"
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <p className={cn("mt-2 text-xs transition-colors", password.length >= 8 ? "text-vivid-green" : "text-fog")}>
                  Co najmniej 8 znaków
                </p>
              </div>
            )}
            <AuthButton type="submit" loading={pending === "email"} disabled={pending !== null && pending !== "email"}>
              {pending === "email" ? "Wysyłanie…" : "Załóż konto"}
            </AuthButton>
          </div>
        </form>
        <Separator />
        <div className="flex flex-col gap-3">
          <AuthButton
            variant="secondary"
            icon={<GoogleGlyph />}
            loading={pending === "google"}
            disabled={pending !== null && pending !== "google"}
            onClick={() => oauth("google", "Google")}
          >
            Kontynuuj przez Google
          </AuthButton>
          <AuthButton
            variant="secondary"
            icon={<AppleGlyph />}
            loading={pending === "apple"}
            disabled={pending !== null && pending !== "apple"}
            onClick={() => oauth("apple", "Apple")}
          >
            Kontynuuj przez Apple
          </AuthButton>
        </div>
      </div>
    </AnimatedHeight>
  );
}

/** Dub's OTP step: six cells over one hidden input, the active cell ringed with a blinking caret. */
function VerifyForm({ onDone, onResend }: { onDone: () => void; onResend: () => void }) {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (code.length < 6) return;
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            onDone();
          }, PREVIEW_DELAY);
        }}
      >
        <div className="relative" onClick={() => input.current?.focus()}>
          <input
            ref={input}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            aria-label="Kod weryfikacyjny"
            className="absolute inset-0 opacity-0"
          />
          <div aria-hidden className="flex w-full items-center justify-between">
            {Array.from({ length: 6 }, (_, i) => {
              const active = focused && (i === code.length || (code.length === 6 && i === 5));
              return (
                <div
                  key={i}
                  className={cn(
                    "relative flex h-14 w-12 items-center justify-center rounded-lg border border-ash bg-white text-xl text-charcoal ring-0 transition-all",
                    active && "z-10 border-graphite ring-2 ring-ash",
                  )}
                >
                  {code[i]}
                  {active && !code[i] && (
                    <div className="animate-auth-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-px bg-charcoal" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <AuthButton type="submit" className="mt-8" loading={pending} disabled={code.length < 6 && !pending}>
          {pending ? "Sprawdzanie…" : "Dalej"}
        </AuthButton>
      </form>
      <p className="text-center text-sm text-fog">
        Nie dostałeś kodu?{" "}
        <button type="button" onClick={onResend} className="cursor-pointer font-semibold text-slate transition-colors hover:text-charcoal">
          Wyślij ponownie
        </button>
      </p>
    </div>
  );
}
