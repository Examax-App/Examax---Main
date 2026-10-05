"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, CircleAlert, ImagePlus, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/auth/pieces";
import {
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  SALES_EMAIL,
  SCREENSHOT_TYPES,
  SUPPORT_CATEGORIES,
  isEmail,
  isScreenshotType,
  isSupportCategory,
  type ContactKind,
  type SupportCategory,
} from "@/lib/contact";

/*
 * dub.co/contact/sales' form, as its live DOM sets it: a 24px-padded grid,
 * 14px medium labels with a red asterisk 8px above each required field,
 * fields with a neutral-300 edge and a 6px radius, and a 40px "Send message"
 * button that stays grey and unpressable until every required field is
 * filled, then turns black.
 *
 * Sending posts the form to /api/contact, which picks the Examax inbox from
 * the form and category and mails it through Resend with the visitor as
 * Reply-To. While it sends, the
 * button shows the auth screens' spinner; once sent, the form gives way to a
 * confirmation card; if sending fails, a line under the button says so and gives
 * the inbox's address to write to directly.
 *
 * The support form adds an optional category and an optional screenshot, so
 * one form takes problems, account and payment matters and suggestions alike.
 */

type Field = "email" | "message" | "name" | "category" | "screenshot";
type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "block w-full rounded-md border bg-white px-3 py-2 text-sm text-charcoal placeholder:text-[#a3a3a3] focus:outline-none focus:ring-1";

const fieldClass = (error?: string) =>
  cn(FIELD, error ? "border-alert-red/60 focus:border-alert-red focus:ring-alert-red" : "border-[#d4d4d4] focus:border-[#737373] focus:ring-[#737373]");

const LABEL = "mb-2 block text-sm font-medium text-charcoal";

function Required() {
  return (
    <span className="text-[#dc2626]" aria-hidden>
      {" "}
      *
    </span>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-xs leading-4 text-alert-red">
      {error}
    </p>
  );
}

const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

export function ContactForm({ kind, defaultCategory }: { kind: ContactKind; defaultCategory?: SupportCategory }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<SupportCategory | null>(defaultCategory ?? null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  /** When the form appeared, so the server can tell a person typing from a bot posting at once. */
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  const ready = isEmail(email) && message.trim().length > 0;
  const sending = status === "sending";
  const to = kind === "sales" ? SALES_EMAIL : CONTACT_EMAIL;

  const setFieldError = (field: Field, message?: string) =>
    setFieldErrors((errors) => {
      const next = { ...errors };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  const clearFieldError = (field: Field) => setFieldError(field);

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready || sending) return;

    const body = new FormData();
    body.set("kind", kind);
    body.set("email", email.trim());
    body.set("message", message.trim());
    body.set("name", name.trim());
    if (category) body.set("category", category);
    if (screenshot) body.set("screenshot", screenshot);
    body.set("website", new FormData(event.currentTarget).get("website") ?? "");
    body.set("elapsed", String(Date.now() - shownAt.current));

    setStatus("sending");
    setError("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/contact", { method: "POST", body });
      const result: { ok?: boolean; error?: string; fields?: Partial<Record<Field, string>> } = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setFieldErrors(result.fields ?? {});
        setError(result.error ?? "Nie udało się wysłać wiadomości.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Brak połączenia.");
      setStatus("error");
    }
  };

  const reset = () => {
    setMessage("");
    setScreenshot(null);
    setError("");
    setFieldErrors({});
    setStatus("idle");
  };

  if (status === "sent") return <SentPanel email={email.trim()} onAgain={reset} />;

  return (
    <form onSubmit={send} noValidate className="grid grid-cols-1 gap-6 p-6">
      {kind === "support" ? (
        <fieldset>
          <legend className={LABEL}>Kategoria</legend>
          <div className="flex flex-wrap gap-2">
            {SUPPORT_CATEGORIES.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-charcoal has-[:focus-visible]:ring-offset-2",
                  category === option.key ? "border-charcoal bg-white font-medium text-charcoal ring-1 ring-charcoal" : "border-ash bg-white text-steel hover:bg-canvas-muted",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-category`}
                  value={option.key}
                  checked={category === option.key}
                  onChange={() => setCategory(option.key)}
                  /* The category is optional: picking the chosen one again clears it. */
                  onClick={() => category === option.key && setCategory(null)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className={LABEL}>
            {kind === "sales" ? "E-mail służbowy" : "Adres e-mail"}
            <Required />
          </label>
          <input
            id={`${id}-email`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFieldError("email");
            }}
            placeholder={kind === "sales" ? "dyrekcja@szkola.edu.pl" : "ala.nowak@gmail.com"}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? `${id}-email-error` : undefined}
            className={fieldClass(fieldErrors.email)}
          />
          <FieldError id={`${id}-email-error`} error={fieldErrors.email} />
        </div>

        <div>
          <label htmlFor={`${id}-name`} className={LABEL}>
            Imię
          </label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearFieldError("name");
            }}
            placeholder="Ala Nowak"
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? `${id}-name-error` : undefined}
            className={fieldClass(fieldErrors.name)}
          />
          <FieldError id={`${id}-name-error`} error={fieldErrors.name} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={LABEL}>
          {kind === "sales" ? "W czym możemy pomóc?" : "Wiadomość"}
          <Required />
        </label>
        <textarea
          id={`${id}-message`}
          required
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            clearFieldError("message");
          }}
          placeholder={
            kind === "sales"
              ? "Opowiedz nam o swojej szkole lub klasie i o tym, czego potrzebujecie"
              : category === "techniczny" || category === "ai"
                ? "Co się stało? Jeśli to błąd w zadaniu, podaj arkusz i numer zadania"
                : "Napisz, w czym możemy pomóc"
          }
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? `${id}-message-error` : undefined}
          className={cn(fieldClass(fieldErrors.message), "min-h-[118px] resize-y")}
        />
        <FieldError id={`${id}-message-error`} error={fieldErrors.message} />
      </div>

      {kind === "support" ? (
        <ScreenshotField
          id={`${id}-screenshot`}
          file={screenshot}
          error={fieldErrors.screenshot}
          onChange={(file, fileError) => {
            setScreenshot(file);
            setFieldError("screenshot", fileError);
          }}
        />
      ) : null}

      {/* Spam trap: hidden from people and assistive tech; bots that fill every field fill this one too. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Strona internetowa
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!ready || sending}
          className={cn(
            "focus-ring flex h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm transition-all",
            ready && !sending ? "cursor-pointer border-black bg-black font-medium text-white hover:ring-4 hover:ring-ash" : "cursor-not-allowed border-ash bg-paper-mist text-fog",
          )}
        >
          {sending ? <Spinner /> : null}
          {sending ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
        <div aria-live="polite">
          {status === "error" ? (
            <p className="flex items-start gap-1.5 text-[13px] text-alert-red">
              <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
              <span>
                {error} Spróbuj ponownie albo napisz na{" "}
                <a href={`mailto:${to}`} className="font-medium underline underline-offset-2">
                  {to}
                </a>
                .
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

/**
 * What the form gives way to once sent: one card in the form's place — a
 * hairline edge and a 12px radius, no shadow and nothing boxed inside it, as
 * DesignRules/DESIGN.md has cards — that rises in, the green check popping
 * in a beat later, the address the reply will go to, and a way to write
 * again. Focus moves to its heading so screen readers announce it.
 */
function SentPanel({ email, onAgain }: { email: string; onAgain: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <div className="p-6 sm:p-10">
      <div
        role="status"
        className="flex flex-col items-center rounded-xl border border-ash bg-white px-6 py-12 text-center motion-safe:animate-rise sm:px-12 sm:py-16"
      >
        <span className="grid size-14 place-items-center rounded-full bg-vivid-green/10 motion-safe:animate-pulse-in motion-safe:[animation-delay:150ms]">
          <Check className="size-7 text-vivid-green" strokeWidth={2.25} aria-hidden />
        </span>
        <h2 ref={heading} tabIndex={-1} className="mt-6 font-satoshi text-2xl font-medium text-charcoal focus:outline-none">
          Wiadomość wysłana
        </h2>
        <p className="mt-2 max-w-sm text-balance text-base text-fog">
          Dziękujemy za wiadomość. Odpowiemy na adres <span className="font-medium text-charcoal [overflow-wrap:anywhere]">{email}</span>.
        </p>
        <button
          type="button"
          onClick={onAgain}
          className="focus-ring mt-8 flex h-10 w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-ash bg-white px-4 text-sm text-charcoal transition-colors hover:bg-canvas-muted"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    </div>
  );
}

/** One optional screenshot: a dashed drop area, then the chosen file's name with a way to remove it. */
function ScreenshotField({
  id,
  file,
  error,
  onChange,
}: {
  id: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null, error?: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    if (!isScreenshotType(picked.type)) return onChange(null, "Dodaj plik PNG, JPG lub WebP.");
    if (picked.size > CONTACT_LIMITS.screenshotBytes) return onChange(null, "Plik może mieć najwyżej 4 MB.");
    onChange(picked);
  };

  const clear = () => {
    if (input.current) input.current.value = "";
    onChange(null);
  };

  return (
    <div>
      <span className={LABEL} id={`${id}-label`}>
        Zrzut ekranu
      </span>
      {file ? (
        <div className="flex h-10 items-center gap-2 rounded-md border border-ash bg-canvas-muted pl-3 pr-1 text-sm">
          <Paperclip className="size-4 shrink-0 text-silver" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 flex-1 truncate text-charcoal" title={file.name}>
            {file.name}
          </span>
          <span className="shrink-0 text-xs text-fog">{megabytes(file.size)}</span>
          <button
            type="button"
            onClick={clear}
            aria-label="Usuń zrzut ekranu"
            className="focus-ring grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-silver transition-colors hover:bg-paper-mist hover:text-charcoal"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            pick(event.dataTransfer.files[0]);
          }}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-3 py-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-charcoal has-[:focus-visible]:ring-offset-2",
            error ? "border-alert-red/60" : "border-[#d4d4d4]",
            dragging ? "bg-canvas-muted" : "bg-white hover:bg-canvas-muted",
          )}
        >
          <ImagePlus className="size-5 shrink-0 text-silver" strokeWidth={1.5} aria-hidden />
          <span className="flex flex-col">
            <span className="text-sm text-charcoal">Dodaj lub upuść zrzut ekranu</span>
            <span className="text-xs text-fog">PNG, JPG lub WebP, do 4 MB</span>
          </span>
          <input
            ref={input}
            id={id}
            type="file"
            accept={SCREENSHOT_TYPES.join(",")}
            onChange={(event) => pick(event.target.files?.[0])}
            aria-labelledby={`${id}-label`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="sr-only"
          />
        </label>
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

/** The support form with its category taken from `?temat=`, read in the browser so the page itself stays static. */
function SupportFormFromQuery() {
  const temat = useSearchParams().get("temat");
  const category = isSupportCategory(temat) ? temat : undefined;
  return <ContactForm key={category ?? "none"} kind="support" defaultCategory={category} />;
}

export function SupportForm() {
  return (
    <Suspense fallback={<ContactForm kind="support" />}>
      <SupportFormFromQuery />
    </Suspense>
  );
}
