"use client";

import { useId, useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AuthButton, AuthField, NoticeIcon, PasswordField, useEmailField } from "@/components/auth/pieces";
import { Turnstile, turnstileMessage, type TurnstileHandle } from "@/components/auth/Turnstile";
import { ACCEPTED_PASSWORD_SCORE, PasswordStrength, scorePassword } from "@/components/ui/PasswordStrength";
import type { ToastTone } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { emailRedirect, offerToSavePassword } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { deleteAccount } from "@/lib/auth/actions";
import { AFTER_SIGN_IN } from "@/lib/auth/redirect";
import { UI_PREVIEW_ERROR, isUiPreview } from "@/lib/dev/preview";

/*
 * The account dialogs on /welcome. Changing the address or the password
 * starts by proving the current password — a sign-in that carries a
 * Turnstile token (the invisible check runs when the form is sent), which
 * Supabase verifies — so a session left open on a
 * shared computer is not enough to take the account over. An account that
 * signs in only through Google or Microsoft has no password to prove: its
 * address change is confirmed by e-mail (Supabase's secure e-mail change),
 * and a password is set through a reset link. Deleting the account asks for
 * the address typed back, nothing more.
 */

type Notify = (message: string, tone: ToastTone) => void;

function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  const titleId = useId();
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="overflow-hidden">
      <div className="border-b border-ash px-6 py-5">
        <h2 id={titleId} className="text-base font-semibold text-charcoal">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm leading-6 text-fog">{description}</p>}
      </div>
      <div className="px-6 pt-5">{children}</div>
    </Modal>
  );
}

/**
 * Dub's modal footer: a light-grey strip across the dialog's foot, "Anuluj"
 * and the action on the right. It sits inside the form, so Enter submits.
 */
function DialogActions({ onCancel, children }: { onCancel: () => void; children: React.ReactNode }) {
  return (
    <div className="-mx-6 mt-1 flex items-center justify-end gap-2 border-t border-ash bg-canvas-muted px-6 py-4">
      <div className="w-24">
        <AuthButton type="button" variant="secondary" onClick={onCancel}>
          Anuluj
        </AuthButton>
      </div>
      <div className="min-w-36">{children}</div>
    </div>
  );
}

function Sent({ email, lead, onClose }: { email: string; lead: string; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-6 pb-6 text-center">
      <div>
        <NoticeIcon icon={MailCheck} />
        <p className="text-sm leading-6 text-fog">
          {lead} <strong className="font-semibold text-steel">{email}</strong>.
        </p>
      </div>
      <AuthButton variant="secondary" onClick={onClose}>
        Zamknij
      </AuthButton>
    </div>
  );
}

/** Runs the invisible Turnstile check; null (and a message) when it could not pass. */
async function checkHuman(turnstile: React.RefObject<TurnstileHandle | null>, notify: (message: string) => void) {
  try {
    return (await turnstile.current?.getToken()) ?? null;
  } catch (error) {
    notify(turnstileMessage(error));
    return null;
  }
}

/** The current password, proved with a Turnstile-checked sign-in: Supabase's error, or null when it is right. */
async function provePassword(email: string, password: string, captchaToken: string) {
  const { error } = await createClient().auth.signInWithPassword({ email, password, options: { captchaToken } });
  return error;
}

/* ─── Change e-mail ─────────────────────────────────────────────────────── */

export function ChangeEmailDialog({ open, onClose, email, hasPassword, notify }: { open: boolean; onClose: () => void; email: string; hasPassword: boolean; notify: Notify }) {
  return (
    <Dialog open={open} onClose={onClose} title="Zmień adres e-mail" description="Zmiana zacznie obowiązywać po potwierdzeniu linkiem z wiadomości.">
      {open && <ChangeEmailForm email={email} hasPassword={hasPassword} notify={notify} onClose={onClose} />}
    </Dialog>
  );
}

function ChangeEmailForm({ email, hasPassword, notify, onClose }: { email: string; hasPassword: boolean; notify: Notify; onClose: () => void }) {
  const next = useEmailField("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);

  if (sentTo) return <Sent email={sentTo} lead="Wysłaliśmy link potwierdzający na" onClose={onClose} />;

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!next.accept()) return;
        if (next.value.toLowerCase() === email.toLowerCase()) return notify("To jest Twój obecny adres.", "error");
        if (hasPassword && !password) return setPasswordError("Wpisz obecne hasło.");

        setBusy(true);
        try {
          if (hasPassword) {
            const token = await checkHuman(turnstile, (message) => notify(message, "error"));
            if (!token) return;
            const error = await provePassword(email, password, token);
            if (error) {
              if (error.code === "invalid_credentials") setPasswordError("Nieprawidłowe hasło.");
              else notify(authErrorMessage(error), "error");
              return;
            }
          }
          const { error } = await createClient().auth.updateUser({ email: next.value }, { emailRedirectTo: emailRedirect(AFTER_SIGN_IN) });
          if (error) return notify(authErrorMessage(error), "error");
          setSentTo(next.value);
        } finally {
          setBusy(false);
        }
      }}
    >
      <AuthField {...next.field} label="Nowy adres e-mail" name="new-email" autoComplete="email" autoFocus />
      {hasPassword && (
        <>
          <PasswordField
            label="Obecne hasło"
            name="current-password"
            autoComplete="current-password"
            value={password}
            error={passwordError}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(undefined);
            }}
          />
          <Turnstile ref={turnstile} action="change-email" />
        </>
      )}
      <DialogActions onCancel={onClose}>
          <AuthButton type="submit" loading={busy}>
            Zmień adres
          </AuthButton>
      </DialogActions>
    </form>
  );
}

/* ─── Change (or set) password ──────────────────────────────────────────── */

export function ChangePasswordDialog({ open, onClose, email, hasPassword, notify }: { open: boolean; onClose: () => void; email: string; hasPassword: boolean; notify: Notify }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={hasPassword ? "Zmień hasło" : "Ustaw hasło"}
      description={hasPassword ? "Wpisz obecne hasło i wybierz nowe." : "Wyślemy Ci link, pod którym ustawisz hasło. Logowanie przez Google lub Microsoft nadal będzie działać."}
    >
      {open && (hasPassword ? <ChangePasswordForm email={email} notify={notify} onClose={onClose} /> : <SetPasswordForm email={email} notify={notify} onClose={onClose} />)}
    </Dialog>
  );
}

function ChangePasswordForm({ email, notify, onClose }: { email: string; notify: Notify; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [currentError, setCurrentError] = useState<string>();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!current) return setCurrentError("Wpisz obecne hasło.");
        if (!password) return setPasswordError("Wpisz nowe hasło.");
        if (scorePassword(password) < ACCEPTED_PASSWORD_SCORE) return notify("Spróbuj utworzyć silniejsze hasło.", "error");

        setBusy(true);
        try {
          const token = await checkHuman(turnstile, (message) => notify(message, "error"));
          if (!token) return;
          const proveError = await provePassword(email, current, token);
          if (proveError) {
            if (proveError.code === "invalid_credentials") setCurrentError("Nieprawidłowe hasło.");
            else notify(authErrorMessage(proveError), "error");
            return;
          }
          // Supabase asks for the current password too when the session began
          // with a password ("Require current password" in its settings).
          const { error } = await createClient().auth.updateUser({ password, current_password: current });
          if (error) {
            if (error.code === "same_password" || error.code === "weak_password") setPasswordError(authErrorMessage(error));
            else if (error.code === "current_password_mismatch" || error.code === "current_password_required") setCurrentError(authErrorMessage(error));
            else notify(authErrorMessage(error), "error");
            return;
          }
          void offerToSavePassword(email, password);
          notify("Hasło zostało zmienione.", "success");
          onClose();
        } finally {
          setBusy(false);
        }
      }}
    >
      <input type="email" name="email" autoComplete="username" value={email} readOnly hidden />
      <PasswordField
        label="Obecne hasło"
        name="current-password"
        autoComplete="current-password"
        autoFocus
        value={current}
        error={currentError}
        onChange={(event) => {
          setCurrent(event.target.value);
          setCurrentError(undefined);
        }}
      />
      <div>
        <PasswordField
          label="Nowe hasło"
          name="new-password"
          autoComplete="new-password"
          value={password}
          error={passwordError}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError(undefined);
          }}
        />
        <PasswordStrength value={password} className="mt-3" />
      </div>
      <Turnstile ref={turnstile} action="change-password" />
      <DialogActions onCancel={onClose}>
          <AuthButton type="submit" loading={busy}>
            Zapisz hasło
          </AuthButton>
      </DialogActions>
    </form>
  );
}

function SetPasswordForm({ email, notify, onClose }: { email: string; notify: Notify; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);

  if (sent) return <Sent email={email} lead="Wysłaliśmy link do ustawienia hasła na" onClose={onClose} />;

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        const token = await checkHuman(turnstile, (message) => notify(message, "error"));
        if (!token) return setBusy(false);
        const { error } = await createClient().auth.resetPasswordForEmail(email, { captchaToken: token, redirectTo: emailRedirect("/reset-password") });
        setBusy(false);
        if (error) return notify(authErrorMessage(error), "error");
        setSent(true);
      }}
    >
      <div className="mb-5">
        <span className="mb-2 block text-sm font-medium leading-none text-charcoal">Link wyślemy na</span>
        <div className="flex h-10 items-center gap-2 rounded-md border border-ash bg-canvas-muted px-3 text-sm">
          <MailCheck className="size-4 shrink-0 text-silver" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 truncate text-charcoal" title={email}>
            {email}
          </span>
        </div>
      </div>
      <Turnstile ref={turnstile} action="set-password" />
      <DialogActions onCancel={onClose}>
          <AuthButton type="submit" loading={busy}>
            Wyślij link
          </AuthButton>
      </DialogActions>
    </form>
  );
}

/* ─── Delete account ────────────────────────────────────────────────────── */

export function DeleteAccountDialog({ open, onClose, email, onDeleted }: { open: boolean; onClose: () => void; email: string; onDeleted: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Usuń konto"
      description="Konto i wszystkie jego dane zostaną trwale usunięte. Tej operacji nie można cofnąć."
    >
      {open && <DeleteAccountForm email={email} onClose={onClose} onDeleted={onDeleted} />}
    </Dialog>
  );
}

function DeleteAccountForm({ email, onClose, onDeleted }: { email: string; onClose: () => void; onDeleted: () => void }) {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const matches = confirmation.trim().toLowerCase() === email.toLowerCase();

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!matches) return;
        // The dev panel's previews (development only) never delete anything.
        if (isUiPreview()) return setError(authErrorMessage(UI_PREVIEW_ERROR));
        setBusy(true);
        const result = await deleteAccount({ confirmation });
        if (result.ok) return onDeleted();
        setBusy(false);
        setError(result.message);
      }}
    >
      <AuthField
        label="Potwierdź adresem e-mail"
        name="confirm-email"
        placeholder={email}
        autoComplete="off"
        spellCheck={false}
        autoFocus
        value={confirmation}
        error={error}
        onChange={(event) => {
          setConfirmation(event.target.value);
          setError(undefined);
        }}
      />
      <DialogActions onCancel={onClose}>
        <AuthButton type="submit" variant="danger" loading={busy} disabled={!busy && !matches}>
          Usuń konto
        </AuthButton>
      </DialogActions>
    </form>
  );
}
