import type { EmailOtpType } from "@supabase/supabase-js";

/*
 * The e-mail links Supabase sends land on /auth/confirm with a one-time
 * `token_hash` and its `type` (see supabase/templates/). `intent` only picks
 * the words on that page — a sign-in link and a confirmation share type
 * "email".
 */

const EMAIL_TYPES = new Set<EmailOtpType>(["email", "signup", "magiclink", "recovery", "email_change", "invite"]);

export const isEmailOtpType = (value: unknown): value is EmailOtpType => typeof value === "string" && EMAIL_TYPES.has(value as EmailOtpType);

export type LinkIntent = "signup" | "login" | "recovery" | "email-change";

export function linkIntent(type: EmailOtpType, intent: string | undefined): LinkIntent {
  if (type === "recovery") return "recovery";
  if (type === "email_change") return "email-change";
  if (type === "magiclink" || intent === "login") return "login";
  return "signup";
}

/** What /auth/confirm says for each kind of link (icon names: components/auth/NoticeIconByName.tsx). */
export const CONFIRM_COPY: Record<LinkIntent, { icon: "mail" | "login" | "key" | "at"; title: string; description: string; button: string }> = {
  signup: { icon: "mail", title: "Aktywuj konto", description: "Potwierdź adres e-mail, aby dokończyć zakładanie konta.", button: "Potwierdź adres e-mail" },
  login: { icon: "login", title: "Zaloguj się do Examax", description: "Twój link do logowania jest gotowy.", button: "Zaloguj się" },
  recovery: { icon: "key", title: "Ustaw hasło", description: "Za chwilę wybierzesz hasło do swojego konta.", button: "Kontynuuj" },
  "email-change": { icon: "at", title: "Potwierdź nowy adres", description: "Potwierdź zmianę adresu e-mail przypisanego do konta.", button: "Potwierdź zmianę" },
};
