"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import { ArrowBigUp, Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "@/lib/cn";
import { canRegisterEmail, isAllowedEmailDomain } from "@/lib/emailDomains";
import type { IconComponent } from "@/lib/icon";

/*
 * The small parts of dub.co's auth screens (dubinc/dub: packages/ui button
 * and input, ui/auth/*), in our tokens: neutral-900/800 → charcoal/graphite,
 * neutral-500/400/300/200 → fog/silver/smoke/ash, red-600 → alert-red.
 */

function buttonClass(variant: "primary" | "secondary", inert: boolean) {
  return cn(
    "group flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm transition-all",
    inert
      ? "cursor-not-allowed border-ash bg-paper-mist text-silver"
      : variant === "primary"
        ? "border-charcoal bg-charcoal text-white hover:bg-graphite hover:ring-4 hover:ring-ash"
        : "border-ash bg-white text-charcoal outline-none hover:bg-canvas-muted focus-visible:border-fog aria-expanded:border-smoke aria-expanded:bg-canvas-muted",
  );
}

/** Dub's auth button: 40px, rounded-lg; black primary with a ring on hover, white secondary. */
export function AuthButton({
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  const inert = disabled || loading;
  return (
    <button {...props} disabled={inert} className={cn(buttonClass(variant, inert), className)}>
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 animate-spin text-silver" aria-hidden>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Beside the label, right-aligned — e.g. "Nie pamiętasz hasła?". */
  aside?: React.ReactNode;
  /** Replaces the note and turns the field red. */
  error?: string;
  /** A quiet line under the field: a hint, a requirement, a suggestion. */
  note?: React.ReactNode;
  /** A control inside the field's right edge. */
  trailing?: React.ReactNode;
};

/**
 * Dub's auth field: a 14px label 8px above a 40px input with a black focus,
 * and room under it for one line — the error, or else a quiet note.
 */
export function AuthField({ label, aside, error, note, trailing, className, ...props }: AuthFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? note;
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium leading-none text-charcoal">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          {...props}
          id={id}
          size={1}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "block h-10 w-full min-w-0 appearance-none rounded-md border px-3 text-base text-charcoal placeholder-silver shadow-sm transition-colors read-only:bg-paper-mist read-only:text-fog focus:outline-none sm:text-sm",
            error ? "border-alert-red/60 focus:border-alert-red" : "border-smoke focus:border-charcoal",
            trailing ? "pr-11" : undefined,
          )}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {message && (
        <div id={messageId} aria-live="polite" className={cn("mt-2 flex flex-col gap-1 text-xs leading-4", error ? "text-alert-red" : "text-fog")}>
          {message}
        </div>
      )}
    </div>
  );
}

/** A password field with Dub's show/hide eye and a Caps Lock warning. */
export function PasswordField({ note, ...props }: Omit<AuthFieldProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const readCapsLock = (event: React.KeyboardEvent) => setCapsLock(event.getModifierState("CapsLock"));

  return (
    <AuthField
      {...props}
      type={visible ? "text" : "password"}
      onKeyDown={readCapsLock}
      onKeyUp={readCapsLock}
      onBlur={() => setCapsLock(false)}
      note={
        note || capsLock ? (
          <>
            {note}
            {capsLock && (
              <span className="flex items-center gap-1 text-steel">
                <ArrowBigUp className="size-3.5" strokeWidth={2} aria-hidden />
                Caps Lock jest włączony
              </span>
            )}
          </>
        ) : undefined
      }
      trailing={
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Ukryj hasło" : "Pokaż hasło"}
          aria-pressed={visible}
          className="focus-ring grid size-8 cursor-pointer place-items-center rounded-md text-silver transition-colors hover:text-charcoal"
        >
          {visible ? <EyeOff className="size-4" strokeWidth={1.75} aria-hidden /> : <Eye className="size-4" strokeWidth={1.75} aria-hidden />}
        </button>
      }
    />
  );
}

/**
 * The address a password step belongs to, with a way back to change it. A
 * hidden username field sits beside it so password managers pair the two.
 */
export function EmailSummary({ email, onChange }: { email: string; onChange: () => void }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium leading-none text-charcoal">E-mail</span>
      <div className="flex h-10 items-center gap-2 rounded-md border border-ash bg-canvas-muted pl-3 pr-1 text-sm">
        <Mail className="size-4 shrink-0 text-silver" strokeWidth={1.75} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-charcoal" title={email}>
          {email}
        </span>
        <button
          type="button"
          onClick={onChange}
          className="focus-ring shrink-0 cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-fog transition-colors hover:bg-paper-mist hover:text-charcoal"
        >
          Zmień
        </button>
      </div>
      <input type="email" name="email" autoComplete="username" value={email} readOnly hidden />
    </div>
  );
}

/** Dub's "or" between the methods. */
export function Separator() {
  return (
    <div className="my-3 flex shrink items-center justify-center gap-2">
      <div className="grow basis-0 border-b border-ash" />
      <span className="text-xs font-medium uppercase leading-none text-silver">lub</span>
      <div className="grow basis-0 border-b border-ash" />
    </div>
  );
}

/**
 * Dub's partner banner, a dotted card linking elsewhere — ours points teachers
 * and institutions to their own sign-in. One copy of the words, shared by
 * login and sign-up, so the two screens can never disagree. Institutions get
 * their accounts from Examax, so there is no "create" version of this.
 */
export function InstitutionBanner() {
  return (
    <Link
      href="/enterprise"
      className="relative block overflow-hidden rounded-lg border border-ash bg-canvas-muted px-2 py-4 transition-colors hover:bg-paper-mist"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(var(--color-ash)_1px,transparent_1px)] [background-position:1px_5px] [background-size:12px_12px]" />
      <div className="relative text-center text-sm text-steel">
        <p>Jesteś nauczycielem lub prowadzisz placówkę?</p>
        <span className="block font-semibold text-graphite">Zaloguj się do konta instytucji</span>
      </div>
    </Link>
  );
}

/**
 * The screen's title, exactly Dub's auth heading (dubinc/dub: login and
 * register pages — `text-xl font-semibold`, centred): Inter 600 at 20px, in the
 * flow above the form, with an optional line under it. Each step declares its
 * own, so a step can retitle the screen.
 */
export function AuthHeading({ children, description }: { children: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <h1 className="text-xl font-semibold text-charcoal">{children}</h1>
      {description && <p className="text-pretty text-sm leading-6 text-fog">{description}</p>}
    </div>
  );
}

/** The icon over a confirmation step's heading: a white hairline tile. */
export function NoticeIcon({ icon: Icon, className }: { icon: IconComponent; className?: string }) {
  return (
    <div aria-hidden className="mx-auto mb-5 grid size-12 place-items-center rounded-xl border border-ash bg-white shadow-sm">
      <Icon className={cn("size-5 text-charcoal", className)} strokeWidth={1.75} />
    </div>
  );
}

/**
 * Dub's AnimatedSizeContainer (height only): the block eases to the height
 * of whatever it holds, so steps and revealed fields never jump.
 */
export function AnimatedHeight({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = inner.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}

/**
 * Whether the first field may take focus on arrival. Not on touch screens:
 * there it would throw the keyboard over the page before anyone asked.
 * Forms render client-only (ClientOnly), so `window` is always there.
 */
export function canAutoFocus() {
  return window.matchMedia("(pointer: fine)").matches;
}

/* ─── E-mail checks ─────────────────────────────────────────────────────── */

/** The inboxes most Polish students use — the targets of the typo hint. */
const COMMON_DOMAINS = [
  "gmail.com",
  "wp.pl",
  "o2.pl",
  "onet.pl",
  "op.pl",
  "interia.pl",
  "poczta.fm",
  "tlen.pl",
  "gazeta.pl",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "proton.me",
];

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

/**
 * Why an address can't be used, or a likely fix for a mistyped inbox
 * ("gmial.com"). With `strict` (sign-up), only an address lib/emailDomains
 * would register gets through; anything else comes back `rejected`, after the
 * typo hint if one fits, since a mistyped Gmail is likelier than a stray inbox.
 */
function checkEmail(value: string, strict: boolean): { error?: string; suggestion?: string; rejected?: boolean } {
  const email = value.trim();
  if (!email) return { error: "Wpisz adres e-mail." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Wpisz poprawny adres e-mail." };

  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase();
  const rejected = strict && !canRegisterEmail(email);
  if (COMMON_DOMAINS.includes(domain) || (strict && isAllowedEmailDomain(domain))) return { rejected };
  // Short domains sit one letter apart from each other, so they get less slack.
  const slack = domain.length < 8 ? 1 : 2;
  let best: { domain: string; distance: number } | null = null;
  for (const candidate of COMMON_DOMAINS) {
    const distance = editDistance(domain, candidate);
    if (distance <= slack && (!best || distance < best.distance)) best = { domain: candidate, distance };
  }
  return best ? { suggestion: `${email.slice(0, at)}@${best.domain}`, rejected } : { rejected };
}

/**
 * State for an e-mail field. `accept()` returns the address once it is valid
 * — and, if it looked mistyped, once the hint has been shown (a second
 * submit keeps the address as typed). With `strict`, an address that can't
 * open an account calls `onRejected` instead of putting a line under the
 * field. `field` spreads onto an AuthField.
 */
export function useEmailField(initial = "", { strict = false, onRejected }: { strict?: boolean; onRejected?: () => void } = {}) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string>();
  const [suggestion, setSuggestion] = useState<string>();
  const [hintedFor, setHintedFor] = useState<string>();

  const accept = (): string | null => {
    const result = checkEmail(value, strict);
    if (result.error) {
      setError(result.error);
      return null;
    }
    if (result.suggestion && hintedFor !== value) {
      setSuggestion(result.suggestion);
      setHintedFor(value);
      return null;
    }
    setSuggestion(undefined);
    if (result.rejected) {
      onRejected?.();
      return null;
    }
    return value.trim();
  };

  const field = {
    type: "email",
    value,
    error,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      setError(undefined);
      setSuggestion(undefined);
    },
    note: suggestion ? (
      <span>
        Czy chodziło o{" "}
        <button
          type="button"
          onClick={() => {
            setValue(suggestion);
            setSuggestion(undefined);
          }}
          className="cursor-pointer font-medium text-charcoal underline underline-offset-2"
        >
          {suggestion}
        </button>
        ?
      </span>
    ) : undefined,
  } satisfies Partial<AuthFieldProps>;

  return { value, accept, field };
}

/* ─── Resending ─────────────────────────────────────────────────────────── */

const RESEND_AFTER = 30;

/** "Wyślij ponownie", held back for 30 seconds after each send, as a real mailer would. */
export function ResendLine({ prompt, onResend }: { prompt: string; onResend: () => void }) {
  const [left, setLeft] = useState(RESEND_AFTER);

  useEffect(() => {
    if (left <= 0) return;
    const timer = window.setTimeout(() => setLeft((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left]);

  return (
    <p className="text-center text-sm text-fog">
      {prompt}{" "}
      {left > 0 ? (
        <span className="font-medium tabular-nums text-silver">Wyślij ponownie za 0:{String(left).padStart(2, "0")}</span>
      ) : (
        <button
          type="button"
          onClick={() => {
            onResend();
            setLeft(RESEND_AFTER);
          }}
          className="cursor-pointer font-semibold text-slate transition-colors hover:text-charcoal"
        >
          Wyślij ponownie
        </button>
      )}
    </p>
  );
}

/* ─── Brand glyphs ──────────────────────────────────────────────────────── */

export function GoogleGlyph({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.18 3.56-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29a7.22 7.22 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

/** Meta's current Facebook mark (blue disc, white f), traced from the logo he supplied. */
export function FacebookGlyph({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 960 960" className={className} aria-hidden>
      <circle cx="480" cy="480" r="480" fill="#0866FF" />
      <path
        fill="#fff"
        d="M364 946V627H265V480h99v-70C364 250 458 177 600 177c50 0 80 5 103 11v134c-13 0-38-1-63-1-70 0-102 37-102 109v50h157l-27 147H538v329A480 480 0 0 1 364 946Z"
      />
    </svg>
  );
}

/** Microsoft's sign-in symbol (four squares), as in their identity-platform branding kit. */
export function MicrosoftGlyph({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

/* ─── Preview feedback ──────────────────────────────────────────────────── */

/** What a UI-only method does when used: a moment of loading, as the real one would show. */
export const PREVIEW_DELAY = 1400;
