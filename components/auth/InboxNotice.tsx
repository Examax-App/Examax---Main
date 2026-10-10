"use client";

import { useRef } from "react";
import { MailCheck } from "lucide-react";
import { AuthButton, AuthHeading, NoticeIcon, ResendLine } from "@/components/auth/pieces";
import { Turnstile, turnstileMessage, type TurnstileHandle } from "@/components/auth/Turnstile";

/**
 * "Sprawdź skrzynkę": an e-mail has gone out — a confirmation, a sign-in
 * link, a password reset. A resend runs the invisible Turnstile check like
 * any other send; Cloudflare's checkbox appears above the line only if it
 * asks for one.
 */
export function InboxNotice({
  email,
  lead,
  backLabel,
  onBack,
  onResend,
  action,
  notify,
}: {
  email: string;
  /** What was sent, ending just before the address (which gets its own line): "Wysłaliśmy link aktywacyjny na". */
  lead: string;
  backLabel?: string;
  onBack?: () => void;
  /** Sends again with the token; false when it failed (the form says why). */
  onResend: (captchaToken: string) => Promise<boolean>;
  /** Shows a message — here, why the check could not run. */
  notify: (message: string, tone: "success" | "error") => void;
  /** Turnstile's action label. */
  action: string;
}) {
  const turnstile = useRef<TurnstileHandle>(null);

  return (
    <div className="animate-auth-rise">
      <NoticeIcon icon={MailCheck} />
      <AuthHeading
        description={
          <>
            {lead}
            <strong className="mt-0.5 block truncate font-medium text-charcoal" title={email}>
              {email}
            </strong>
          </>
        }
      >
        Sprawdź skrzynkę
      </AuthHeading>
      <div className="mt-8 flex flex-col gap-5">
        {onBack && backLabel && (
          <AuthButton variant="secondary" onClick={onBack}>
            {backLabel}
          </AuthButton>
        )}
        <div className="flex flex-col gap-4">
          <Turnstile ref={turnstile} action={action} />
          <ResendLine
            prompt="Nie ma wiadomości?"
            onResend={async () => {
              if (!turnstile.current) return false;
              try {
                return await onResend(await turnstile.current.getToken());
              } catch (error) {
                notify(turnstileMessage(error), "error");
                return false;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
