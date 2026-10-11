"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedHeight, AuthButton, AuthHeading, PasswordField } from "@/components/auth/pieces";
import { NoticeIconByName } from "@/components/auth/NoticeIconByName";
import { ACCEPTED_PASSWORD_SCORE, PasswordStrength, scorePassword } from "@/components/ui/PasswordStrength";
import { Toast, flashToast, useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { offerToSavePassword } from "@/lib/auth/client";
import { isUiPreview } from "@/lib/dev/preview";
import { markPasswordSet } from "@/lib/auth/actions";
import { AFTER_SIGN_IN } from "@/lib/auth/redirect";

/**
 * A new password, set with the session the reset link opened. The link
 * itself proved the inbox, so there is no Turnstile here — the request goes
 * to Supabase with that session, which is what authorises it. The bar for a
 * new password is the same as sign-up's: three bars on the meter.
 */
export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  return (
    <AnimatedHeight>
      <form
        noValidate
        className="flex flex-col gap-6 p-1"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!password) return setError("Wpisz nowe hasło.");
          if (scorePassword(password) < ACCEPTED_PASSWORD_SCORE) return show("Spróbuj utworzyć silniejsze hasło.", "error");
          setSaving(true);
          const { error: updateError } = await createClient().auth.updateUser({ password });
          setSaving(false);
          if (updateError) {
            if (updateError.code === "same_password" || updateError.code === "weak_password") setError(authErrorMessage(updateError));
            else show(authErrorMessage(updateError), "error");
            return;
          }
          if (isUiPreview()) return show("Hasło zostało zmienione.", "success");
          await markPasswordSet();
          void offerToSavePassword(email, password);
          flashToast("Hasło zostało zmienione.", "success");
          router.replace(AFTER_SIGN_IN);
          router.refresh();
        }}
      >
        {/* The username beside the new password, so password managers save the pair. */}
        <input type="email" name="email" autoComplete="username" value={email} readOnly hidden />
        <div>
          <PasswordField
            label="Nowe hasło"
            name="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            error={error}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(undefined);
            }}
          />
          <PasswordStrength value={password} className="mt-3" />
        </div>
        <AuthButton type="submit" loading={saving}>
          Zapisz nowe hasło
        </AuthButton>
      </form>
      <Toast toast={toast} />
    </AnimatedHeight>
  );
}

/** The body of /reset-password (also shown in the dev panel): the heading and the form. */
export function ResetPasswordView({ email }: { email: string }) {
  return (
    <div className="w-full max-w-sm">
      <NoticeIconByName name="key" />
      <AuthHeading
        description={
          <>
            Dla konta <strong className="font-semibold text-steel">{email}</strong>.
          </>
        }
      >
        Ustaw hasło
      </AuthHeading>
      <div className="mt-8">
        <ResetPasswordForm email={email} />
      </div>
    </div>
  );
}
