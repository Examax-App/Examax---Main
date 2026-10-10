"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/cn";
import { setUiPreview } from "@/lib/dev/preview";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { SignUpFlow } from "@/components/auth/SignUpFlow";
import { InboxNotice } from "@/components/auth/InboxNotice";
import { ResetPasswordView } from "@/components/auth/ResetPasswordForm";
import { ConfirmCard, ConfirmInvalid } from "@/components/auth/ConfirmCard";
import { VerifyView } from "@/components/auth/VerifyView";
import { AccountDeleted } from "@/components/auth/AccountDeleted";
import { AccountPanel, type AccountSummary } from "@/components/account/AccountPanel";
import { ChangeEmailDialog, ChangePasswordDialog, DeleteAccountDialog } from "@/components/account/AccountModals";
import { AuthButton } from "@/components/auth/pieces";
import { Toast, useToast } from "@/components/ui/Toast";
import { AUTH_ERROR_MESSAGES } from "@/lib/auth/errors";
import { LOGIN_ERRORS, LOGIN_NOTICES } from "@/lib/auth/loginNotices";
import type { LinkIntent } from "@/lib/auth/emailLinks";
import type { ProviderStatus } from "@/lib/auth/providers";

/*
 * The Examax dev panel — localhost only (mounted from app/layout.tsx when
 * NODE_ENV is "development"; a production build does not contain it). The
 * mark in the corner opens a library of every auth screen, dialog, e-mail
 * and message, rendered from the real components so they cannot drift from
 * what students see. While it is open the app is in UI preview mode
 * (lib/dev/preview.ts): nothing is sent to Supabase or Cloudflare, nobody is
 * signed out, nothing is deleted — so testing a screen never needs a new
 * account or a real e-mail.
 */

const PROVIDERS: ProviderStatus = { google: true, azure: true, facebook: false, googleViaSite: false };
const NEW_ACCOUNT: AccountSummary = { email: "ala.nowak@gmail.com", isNew: true, pendingEmail: null, hasPassword: true, methods: ["email"], passkeys: [] };
const RETURNING: AccountSummary = { email: "ala.nowak@gmail.com", isNew: false, pendingEmail: "ala.nowak@outlook.com", hasPassword: true, methods: ["email", "google", "azure", "passkey"], passkeys: [{ id: "pk-1", name: "Touch ID · Mac", createdAt: "2026-10-08T10:00:00Z", lastUsedAt: "2026-10-10T18:20:00Z" }, { id: "pk-2", name: "Face ID · iPhone", createdAt: "2026-10-09T08:30:00Z", lastUsedAt: null }] };
const noop = () => undefined;

type Entry = { id: string; label: string; when: string; render: () => React.ReactNode; kind?: "screen" | "dialog" | "email" | "list" };

function Confirm({ intent }: { intent: LinkIntent }) {
  const { toast, show } = useToast();
  return (
    <>
      <ConfirmCard intent={intent} fields={{}} action={() => show("Podgląd UI: link nie został użyty.", "success")} />
      <Toast toast={toast} />
    </>
  );
}

function Inbox({ lead, back }: { lead: string; back?: string }) {
  const { toast, show } = useToast();
  return (
    <div className="w-full max-w-sm">
      <InboxNotice email="ala.nowak@gmail.com" lead={lead} backLabel={back} onBack={back ? noop : undefined} onResend={async () => true} notify={show} action="preview" />
      <Toast toast={toast} />
    </div>
  );
}

/** A dialog, open from the start; closing it leaves a button to open it again. */
function DialogPreview({ render }: { render: (props: { open: boolean; onClose: () => void; notify: ReturnType<typeof useToast>["show"] }) => React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const { toast, show } = useToast();
  return (
    <>
      {!open && (
        <div className="w-48">
          <AuthButton variant="secondary" onClick={() => setOpen(true)}>
            Otwórz ponownie
          </AuthButton>
        </div>
      )}
      {render({ open, onClose: () => setOpen(false), notify: show })}
      <Toast toast={toast} />
    </>
  );
}

function EmailPreview({ name }: { name: string }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`/api/dev/email/${name}`, { cache: "no-store" })
      .then((response) => response.text())
      .then((text) => live && setHtml(text));
    return () => {
      live = false;
    };
  }, [name]);
  return html ? (
    <iframe title={`E-mail: ${name}`} srcDoc={html} className="h-[820px] w-full max-w-[680px] rounded-cards border border-ash bg-white" />
  ) : (
    <p className="text-sm text-fog">Wczytywanie…</p>
  );
}

function ToastList() {
  const groups: Array<{ title: string; tone: "success" | "error"; messages: string[] }> = [
    { title: "Błędy logowania i formularzy", tone: "error", messages: [...new Set(Object.values(AUTH_ERROR_MESSAGES))] },
    { title: "Powrót na /login", tone: "error", messages: Object.values(LOGIN_ERRORS) },
    {
      title: "Potwierdzenia",
      tone: "success",
      messages: [
        ...Object.values(LOGIN_NOTICES),
        "Adres e-mail został pomyślnie zweryfikowany.",
        "Adres e-mail został zmieniony.",
        "Hasło zostało zmienione.",
        "Konto zostało usunięte.",
        "Wysłaliśmy nową wiadomość na ala.nowak@gmail.com.",
      ],
    },
    { title: "Niedostępne metody", tone: "error", messages: ["Logowanie przez Facebook nie jest jeszcze dostępne.", "Logowanie kluczem dostępu nie jest jeszcze dostępne.", "Logowanie przez konto szkoły nie jest jeszcze dostępne."] },
  ];
  return (
    <div className="w-full max-w-xl space-y-8">
      {groups.map((group) => (
        <section key={group.title}>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-fog">{group.title}</h3>
          <ul className="space-y-2">
            {group.messages.map((message) => (
              <li key={message} className="flex items-center gap-2.5 rounded-lg border border-ash bg-white py-3 pl-3 pr-4 text-sm text-charcoal shadow-subtle">
                <span aria-hidden className={cn("size-4 shrink-0 rounded-full", group.tone === "success" ? "bg-vivid-green" : "bg-alert-red")} />
                {message}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const GROUPS: Array<{ title: string; entries: Entry[] }> = [
  {
    title: "Ekrany",
    entries: [
      { id: "login", label: "Logowanie", when: "/login", render: () => <LoginPanel next="/welcome" providers={PROVIDERS} /> },
      { id: "signup", label: "Rejestracja", when: "/signup", render: () => <SignUpFlow next="/welcome" providers={PROVIDERS} /> },
      { id: "inbox-signup", label: "Sprawdź skrzynkę — aktywacja", when: "Po „Załóż konto”", render: () => <Inbox lead="Wysłaliśmy link aktywacyjny na" back="Użyj innego adresu" /> },
      { id: "inbox-link", label: "Sprawdź skrzynkę — link do logowania", when: "Po „Wyślij link do logowania”", render: () => <Inbox lead="Wysłaliśmy link do logowania na" back="Wróć do logowania" /> },
      { id: "inbox-reset", label: "Sprawdź skrzynkę — nowe hasło", when: "Po „Nie pamiętasz hasła?”", render: () => <Inbox lead="Wysłaliśmy link do ustawienia nowego hasła na" back="Wróć do logowania" /> },
      { id: "reset", label: "Ustaw nowe hasło", when: "/reset-password, po linku z e-maila", render: () => <ResetPasswordView email="ala.nowak@gmail.com" /> },
      { id: "welcome-new", label: "Panel konta — nowe konto", when: "/welcome, pierwsze wejście", render: () => <AccountPanel account={NEW_ACCOUNT} notice={{ message: "Adres e-mail został pomyślnie zweryfikowany.", tone: "success" }} /> },
      { id: "welcome-back", label: "Panel konta — powrót", when: "/welcome, kolejne wejścia (zmiana adresu w toku, dwa klucze dostępu)", render: () => <AccountPanel account={RETURNING} /> },
    ],
  },
  {
    title: "Linki z e-maili",
    entries: [
      { id: "confirm-signup", label: "Aktywuj konto", when: "/auth/confirm — link aktywacyjny", render: () => <Confirm intent="signup" /> },
      { id: "confirm-login", label: "Zaloguj się linkiem", when: "/auth/confirm — link do logowania", render: () => <Confirm intent="login" /> },
      { id: "confirm-recovery", label: "Ustaw nowe hasło (link)", when: "/auth/confirm — link do resetu hasła", render: () => <Confirm intent="recovery" /> },
      { id: "confirm-change", label: "Potwierdź nowy adres", when: "/auth/confirm — zmiana adresu", render: () => <Confirm intent="email-change" /> },
      { id: "confirm-invalid", label: "Nieprawidłowy link", when: "/auth/confirm bez tokenu", render: () => <ConfirmInvalid /> },
      { id: "verify-expired", label: "Link wygasł", when: "/verify?error=expired", render: () => <VerifyView error="expired" /> },
      { id: "verify-resend", label: "Wyślij nowy link", when: "/verify", render: () => <VerifyView /> },
      { id: "verify-pending", label: "Jeden adres potwierdzony", when: "/verify — połowa zmiany adresu", render: () => <VerifyView notice="email-change-pending" /> },
      { id: "account-deleted", label: "Konto usunięte", when: "/account-deleted — sesja konta, którego już nie ma", render: () => <AccountDeleted /> },
    ],
  },
  {
    title: "Okna",
    entries: [
      { id: "dialog-password", label: "Zmień hasło", kind: "dialog", when: "/welcome → Hasło → Zmień", render: () => <DialogPreview render={(p) => <ChangePasswordDialog {...p} email="ala.nowak@gmail.com" hasPassword />} /> },
      { id: "dialog-set-password", label: "Ustaw hasło (konto Google)", kind: "dialog", when: "/welcome → Hasło → Ustaw", render: () => <DialogPreview render={(p) => <ChangePasswordDialog {...p} email="ala.nowak@gmail.com" hasPassword={false} />} /> },
      { id: "dialog-email", label: "Zmień adres e-mail", kind: "dialog", when: "/welcome → E-mail → Zmień", render: () => <DialogPreview render={(p) => <ChangeEmailDialog {...p} email="ala.nowak@gmail.com" hasPassword />} /> },
      { id: "dialog-delete", label: "Usuń konto", kind: "dialog", when: "/welcome → Usuń konto", render: () => <DialogPreview render={({ open, onClose }) => <DeleteAccountDialog open={open} onClose={onClose} email="ala.nowak@gmail.com" onDeleted={noop} />} /> },
    ],
  },
  {
    title: "E-maile",
    entries: [
      { id: "email-confirmation", label: "Potwierdź adres e-mail", kind: "email", when: "Supabase → Confirm sign up", render: () => <EmailPreview name="confirmation" /> },
      { id: "email-magic", label: "Link do logowania", kind: "email", when: "Supabase → Magic link", render: () => <EmailPreview name="magic_link" /> },
      { id: "email-recovery", label: "Ustaw nowe hasło", kind: "email", when: "Supabase → Reset password", render: () => <EmailPreview name="recovery" /> },
      { id: "email-change", label: "Potwierdź zmianę adresu", kind: "email", when: "Supabase → Change email address", render: () => <EmailPreview name="email_change" /> },
    ],
  },
  {
    title: "Komunikaty",
    entries: [{ id: "toasts", label: "Wszystkie komunikaty", kind: "list", when: "Każdy toast, jaki może pokazać logowanie", render: () => <ToastList /> }],
  },
];

const ENTRIES = GROUPS.flatMap((group) => group.entries);

export function DevTools() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(ENTRIES[0].id);
  const entry = ENTRIES.find((candidate) => candidate.id === selected) ?? ENTRIES[0];

  // Preview mode lasts exactly as long as the panel is open. It is switched on
  // in the click itself, before the previews render: a child's effects run
  // before this component's, so an effect here would be too late.
  const show = (next: boolean) => {
    setUiPreview(next);
    setOpen(next);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("[role=dialog]")) show(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      setUiPreview(false);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => show(!open)}
        aria-label={open ? "Zamknij panel deweloperski Examax" : "Otwórz panel deweloperski Examax"}
        aria-expanded={open}
        title="Examax · podgląd UI (tylko localhost)"
        className="fixed bottom-5 right-5 z-[65] grid size-10 cursor-pointer place-items-center rounded-full bg-midnight-ink text-white shadow-lg ring-1 ring-white/10 transition-transform hover:scale-105"
      >
        {open ? <X className="size-4" strokeWidth={2} /> : <BrandMark className="h-3.5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-[45] flex bg-white" role="region" aria-label="Panel deweloperski Examax">
          <aside className="flex w-72 shrink-0 flex-col border-r border-ash bg-canvas-muted">
            <div className="flex items-center gap-2 border-b border-ash px-5 py-4">
              <span className="grid size-7 place-items-center rounded-md bg-midnight-ink text-white">
                <BrandMark className="h-3" />
              </span>
              <div>
                <p className="text-sm font-semibold text-charcoal">Podgląd UI</p>
                <p className="text-xs text-fog">Tylko localhost · nic nie jest wysyłane</p>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {GROUPS.map((group) => (
                <div key={group.title} className="mb-5">
                  <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-silver">{group.title}</p>
                  {group.entries.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(item.id)}
                      className={cn(
                        "block w-full cursor-pointer truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        item.id === entry.id ? "bg-white font-medium text-charcoal shadow-subtle ring-1 ring-ash" : "text-steel hover:bg-white/70 hover:text-charcoal",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between gap-4 border-b border-ash px-8 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-charcoal">{entry.label}</h2>
                <p className="truncate text-xs text-fog">{entry.when}</p>
              </div>
              <button
                type="button"
                onClick={() => show(false)}
                className="cursor-pointer rounded-md border border-ash bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal transition-colors hover:bg-canvas-muted"
              >
                Zamknij · Esc
              </button>
            </header>
            <div className="flex flex-1 justify-center overflow-y-auto px-8 py-14">
              <div key={entry.id} className="flex w-full justify-center">
                {entry.render()}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
