"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { MailCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthButton, AuthHeading, InstitutionBanner, NoticeIcon, ResendLine } from "@/components/auth/pieces";
import { Toast, useToast } from "@/components/ui/Toast";

/**
 * Dub's login page body (dubinc/dub: (auth-marketing)/login/page.tsx), in
 * Polish: the form, the sign-up link and the institution banner — or, once
 * an e-mail has "gone out" (a sign-in link or a password reset), the
 * check-your-inbox step, which leads back to the form with the address kept.
 */
export function LoginPanel() {
  const [inbox, setInbox] = useState<{ reason: "link" | "reset"; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const { toast, show } = useToast();

  return (
    <div className="w-full max-w-sm">
      {inbox ? (
        <div className="animate-auth-rise">
          <NoticeIcon icon={MailCheck} />
          <AuthHeading
            description={
              <>
                {inbox.reason === "link" ? "Wysłaliśmy link do logowania na" : "Wysłaliśmy link do ustawienia nowego hasła na"}{" "}
                <strong className="font-semibold text-steel">{inbox.email}</strong>.
                <span className="mt-2 block">Jeśli go nie widzisz, sprawdź folder Spam lub Wiadomości-śmieci.</span>
              </>
            }
          >
            Sprawdź skrzynkę
          </AuthHeading>
          <div className="mt-8 flex flex-col gap-6">
            <AuthButton variant="secondary" onClick={() => setInbox(null)}>
              Wróć do logowania
            </AuthButton>
            <ResendLine prompt="Nie ma wiadomości?" onResend={() => show(`Wysłaliśmy nową wiadomość na ${inbox.email}.`, "success")} />
          </div>
        </div>
      ) : (
        <>
          <AuthHeading>Zaloguj się do Examax</AuthHeading>
          <div className="mt-8">
            <LoginForm
              initialEmail={email}
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
