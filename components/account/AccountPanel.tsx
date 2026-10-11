"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Mail } from "lucide-react";
import Link from "@/components/ui/Link";
import { AuthHeading, FacebookGlyph, GoogleGlyph, MicrosoftGlyph } from "@/components/auth/pieces";
import { FormSubmit } from "@/components/auth/FormSubmit";
import { ChangeEmailDialog, ChangePasswordDialog, DeleteAccountDialog } from "@/components/account/AccountModals";
import { PasskeysCard } from "@/components/account/PasskeysCard";
import type { PasskeyItem } from "@/lib/auth/passkeys";
import { Toast, flashToast, useToast } from "@/components/ui/Toast";
import { signOut } from "@/lib/auth/actions";
import { authErrorMessage } from "@/lib/auth/errors";
import { UI_PREVIEW_ERROR, isUiPreview } from "@/lib/dev/preview";

/*
 * The temporary home after sign-in, until the dashboard is ready: a
 * greeting, the account at a glance in hairline cards (Dub's settings rows:
 * label, value, action) — the address, the password and the ways in, each
 * with its own mark; the passkeys (components/account/PasskeysCard.tsx) —
 * and the account actions: change the address, change or set the password,
 * sign out, delete the account. The greeting links to the changelog.
 */

export type SignInMethod = "email" | "google" | "azure" | "facebook" | "passkey";

const METHODS: Record<SignInMethod, { name: string; mark: React.ReactNode }> = {
  email: { name: "E-mail", mark: <Mail className="size-4 text-silver" strokeWidth={1.75} aria-hidden /> },
  google: { name: "Google", mark: <GoogleGlyph /> },
  azure: { name: "Microsoft", mark: <MicrosoftGlyph /> },
  facebook: { name: "Facebook", mark: <FacebookGlyph /> },
  passkey: { name: "Klucz dostępu", mark: <Fingerprint className="size-4 text-silver" strokeWidth={1.75} aria-hidden /> },
};

export type AccountSummary = {
  email: string;
  /** Signed in for the first time just now (the account was created in this sign-in). */
  isNew: boolean;
  /** An address change waiting for its confirmation link. */
  pendingEmail: string | null;
  /** The account has an e-mail-and-password sign-in. */
  hasPassword: boolean;
  /** The ways in, e-mail first: "email", "google", "azure", "passkey". */
  methods: SignInMethod[];
  passkeys: PasskeyItem[];
};

type Open = "email" | "password" | "delete" | null;

function Row({ label, value, note, action }: { label: string; value: React.ReactNode; note?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-xs font-medium text-fog">{label}</p>
        <p className="mt-1 truncate text-sm text-charcoal">{value}</p>
        {note && <p className="mt-1 text-xs leading-4 text-fog">{note}</p>}
      </div>
      {action}
    </div>
  );
}

/** The greeting's second line: the platform is still being built, with the way to follow along. */
function Underway({ created }: { created: boolean }) {
  return (
    <>
      {created && "Twoje konto zostało utworzone. "}Oficjalna platforma jest jeszcze w przygotowaniu.{" "}
      <Link href="/updates" className="font-medium text-steel underline underline-offset-2 transition-colors hover:text-charcoal">
        Śledź aktualizacje
      </Link>
      .
    </>
  );
}

function RowAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring shrink-0 cursor-pointer rounded-md border border-ash bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal transition-colors hover:bg-canvas-muted"
    >
      {children}
    </button>
  );
}

export function AccountPanel({ account, notice }: { account: AccountSummary; notice?: { message: string; tone: "success" | "error" } }) {
  const router = useRouter();
  const [open, setOpen] = useState<Open>(null);
  const { toast, show } = useToast();
  const close = () => setOpen(null);

  useEffect(() => {
    if (!notice) return;
    show(notice.message, notice.tone);
    // Shown once: drop ?notice= so a reload does not repeat it.
    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on arrival
  }, []);

  return (
    <div className="w-full max-w-sm">
      {account.isNew ? (
        <AuthHeading description={<Underway created />}>Witaj w Examax</AuthHeading>
      ) : (
        <AuthHeading description={<Underway created={false} />}>Witaj ponownie</AuthHeading>
      )}

      <div className="mt-8 divide-y divide-ash rounded-cards border border-ash bg-white">
        <Row
          label="E-mail"
          value={account.email}
          note={account.pendingEmail ? <>Czeka na potwierdzenie: {account.pendingEmail}</> : undefined}
          action={<RowAction onClick={() => setOpen("email")}>Zmień</RowAction>}
        />
        <Row
          label="Hasło"
          value={account.hasPassword ? "••••••••••" : "Nie ustawiono"}
          action={<RowAction onClick={() => setOpen("password")}>{account.hasPassword ? "Zmień" : "Ustaw"}</RowAction>}
        />
        <Row
          label="Logowanie"
          value={
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {account.methods.map((method) => (
                <span key={method} className="inline-flex items-center gap-1.5">
                  {METHODS[method].mark}
                  {METHODS[method].name}
                </span>
              ))}
            </span>
          }
        />
      </div>

      <PasskeysCard passkeys={account.passkeys} notify={show} />

      {/* The dev panel's previews (development only) keep the real session. */}
      <form action={isUiPreview() ? () => show(authErrorMessage(UI_PREVIEW_ERROR), "error") : signOut} className="mt-6">
        <FormSubmit variant="secondary">Wyloguj się</FormSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-fog">
        <button type="button" onClick={() => setOpen("delete")} className="cursor-pointer font-medium text-alert-red transition-colors hover:text-[#b91c1c]">
          Usuń konto
        </button>
      </p>

      <ChangeEmailDialog open={open === "email"} onClose={close} email={account.email} hasPassword={account.hasPassword} notify={show} />
      <ChangePasswordDialog open={open === "password"} onClose={close} email={account.email} hasPassword={account.hasPassword} notify={show} />
      <DeleteAccountDialog
        open={open === "delete"}
        onClose={close}
        email={account.email}
        onDeleted={() => {
          // The server action has already cleared the session cookies.
          flashToast("Konto zostało usunięte.", "success");
          router.replace("/");
          router.refresh();
        }}
      />
      <Toast toast={toast} />
    </div>
  );
}
