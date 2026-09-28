"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import {
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

/*
 * Dub's LoginForm (dubinc/dub: ui/auth/login/login-form.tsx and its method
 * components), UI only — nothing signs anyone in, nothing is stored but the
 * last method used, which is what drives the arrangement:
 *
 *  - the method used last sits on top, with "Ostatnio logowano się przez …"
 *    under it; with no history, e-mail sits on top;
 *  - every other method is listed under "lub";
 *  - "Zaloguj się e-mailem" from the list promotes e-mail to the top;
 *  - e-mail asks for the address, then offers a password; while the password
 *    step is up, "Kontynuuj inną metodą" stands in for the list;
 *  - SSO opens a field for the school's identifier first.
 * The block eases to its new height at every change.
 */

type Method = "google" | "apple" | "email" | "sso";
const METHODS: Method[] = ["google", "apple", "email", "sso"];
const LAST_USED_KEY = "examax-last-used-auth-method";
const METHOD_NAME: Record<Method, string> = { google: "Google", apple: "Apple", email: "e-mail", sso: "szkołę (SSO)" };

function readLastUsed(): Method | null {
  try {
    const value = localStorage.getItem(LAST_USED_KEY);
    return METHODS.includes(value as Method) ? (value as Method) : null;
  } catch {
    return null;
  }
}

export function LoginForm() {
  // Read once, as Dub does: the arrangement is fixed for this visit even
  // after a new method is remembered.
  const [lastUsed] = useState(readLastUsed);
  const [authMethod, setAuthMethod] = useState<Method>(lastUsed ?? "email");
  const [clicked, setClicked] = useState<Method | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSSO, setShowSSO] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast, show } = useToast();

  /** A method "runs": remembered, a moment of loading, then what would happen next. */
  const run = (method: Method, message: string) => {
    setClicked(method);
    try {
      localStorage.setItem(LAST_USED_KEY, method);
    } catch {
      /* storage unavailable: the preview still runs */
    }
    window.setTimeout(() => {
      setClicked(null);
      show(message);
    }, PREVIEW_DELAY);
  };
  const busy = (method: Method) => clicked === method;
  const blocked = (method: Method) => clicked !== null && clicked !== method;

  const google = (
    <AuthButton
      variant="secondary"
      icon={<GoogleGlyph />}
      loading={busy("google")}
      disabled={blocked("google")}
      onClick={() => run("google", "Podgląd: logowanie przez Google ruszy razem z Examax.")}
    >
      Kontynuuj przez Google
    </AuthButton>
  );

  const apple = (
    <AuthButton
      variant="secondary"
      icon={<AppleGlyph />}
      loading={busy("apple")}
      disabled={blocked("apple")}
      onClick={() => run("apple", "Podgląd: logowanie przez Apple ruszy razem z Examax.")}
    >
      Kontynuuj przez Apple
    </AuthButton>
  );

  const emailSignIn = (
    <form
      className="flex flex-col gap-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (authMethod !== "email") return;
        // Dub checks the account first and offers its password when it has one.
        if (!showPassword) {
          setShowPassword(true);
          return;
        }
        run(
          "email",
          password ? "Podgląd: logowanie hasłem ruszy razem z Examax." : `Wysłaliśmy link do logowania na ${email}. Sprawdź skrzynkę.`,
        );
      }}
    >
      {authMethod === "email" && (
        <AuthField
          label="E-mail"
          name="email"
          type="email"
          placeholder="ala@szkola.pl"
          autoComplete="email"
          autoFocus={!showPassword}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      )}
      {showPassword && (
        <AuthField
          label="Hasło"
          type="password"
          placeholder="Hasło (opcjonalnie)"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aside={
            <button
              type="button"
              onClick={() => show("Podgląd: przypomnienie hasła ruszy razem z Examax.")}
              className="cursor-pointer text-xs leading-none text-fog underline underline-offset-2 transition-colors hover:text-charcoal"
            >
              Nie pamiętasz hasła?
            </button>
          }
        />
      )}
      <AuthButton
        {...(authMethod !== "email"
          ? {
              type: "button" as const,
              onClick: () => {
                setShowSSO(false);
                setAuthMethod("email");
              },
            }
          : { type: "submit" as const })}
        loading={busy("email")}
        disabled={blocked("email")}
      >
        Zaloguj się {password ? "hasłem" : "e-mailem"}
      </AuthButton>
    </form>
  );

  const sso = (
    <form
      className="flex flex-col space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        run("sso", "Podgląd: logowanie przez szkołę ruszy razem z Examax.");
      }}
    >
      {showSSO && (
        <div>
          {authMethod !== "sso" && <div className="mb-4 mt-1 border-t border-smoke" />}
          <AuthField label="Identyfikator szkoły" name="school" type="text" placeholder="np. lo-5-krakow" autoComplete="off" autoFocus required />
        </div>
      )}
      <AuthButton
        variant="secondary"
        icon={<Lock className="size-4" strokeWidth={1.75} />}
        {...(!showSSO ? { type: "button" as const, onClick: () => setShowSSO(true) } : { type: "submit" as const })}
        loading={busy("sso")}
        disabled={blocked("sso")}
      >
        Kontynuuj przez szkołę (SSO)
      </AuthButton>
    </form>
  );

  const render: Record<Method, React.ReactNode> = { google, apple, email: emailSignIn, sso };
  const passwordOnly = authMethod === "email" && showPassword;

  return (
    <>
      <AnimatedHeight>
        <div className="flex flex-col gap-3 p-1">
          <div className="flex flex-col gap-3">
            {render[authMethod]}
            {!passwordOnly && authMethod === lastUsed && (
              <p className="text-center text-xs text-fog">Ostatnio logowano się przez {METHOD_NAME[lastUsed]}</p>
            )}
            <Separator />
          </div>

          {passwordOnly ? (
            <div className="mt-2">
              <AuthButton variant="secondary" type="button" onClick={() => setShowPassword(false)}>
                Kontynuuj inną metodą
              </AuthButton>
            </div>
          ) : (
            METHODS.filter((method) => method !== authMethod).map((method) => <div key={method}>{render[method]}</div>)
          )}
        </div>
      </AnimatedHeight>
      <Toast toast={toast} />
    </>
  );
}
