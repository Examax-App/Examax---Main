/*
 * Supabase Auth's error codes, in the words a student should read. Nothing
 * here repeats the server's own text: messages stay calm, say what to do
 * next, and never confirm whether an account exists (sign-up and password
 * reset already answer the same way either way). Codes:
 * https://supabase.com/docs/guides/auth/debugging/error-codes
 */

type AuthErrorLike = { code?: string | null; status?: number | null; message?: string | null } | null | undefined;

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Nieprawidłowy e-mail lub hasło.",
  email_not_confirmed: "Najpierw potwierdź adres e-mail — link jest w wiadomości od nas.",
  captcha_failed: "Weryfikacja nie powiodła się. Spróbuj jeszcze raz.",
  over_email_send_rate_limit: "Wysłaliśmy już kilka wiadomości. Odczekaj chwilę i spróbuj ponownie.",
  over_request_rate_limit: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.",
  weak_password: "To hasło jest za słabe. Wybierz dłuższe, trudniejsze do odgadnięcia.",
  same_password: "Nowe hasło musi różnić się od obecnego.",
  current_password_required: "Wpisz obecne hasło.",
  current_password_mismatch: "Obecne hasło jest nieprawidłowe.",
  email_address_invalid: "Nie możemy użyć tego adresu e-mail.",
  email_exists: "Ten adres e-mail jest już używany.",
  user_already_exists: "Ten adres e-mail jest już używany.",
  signup_disabled: "Rejestracja jest chwilowo wyłączona.",
  email_provider_disabled: "Logowanie e-mailem jest chwilowo wyłączone.",
  provider_disabled: "Ta metoda logowania jest chwilowo niedostępna.",
  otp_expired: "Link wygasł lub został już użyty.",
  session_not_found: "Twoja sesja wygasła. Zaloguj się ponownie.",
  session_expired: "Twoja sesja wygasła. Zaloguj się ponownie.",
  refresh_token_not_found: "Twoja sesja wygasła. Zaloguj się ponownie.",
  reauthentication_needed: "Ze względów bezpieczeństwa zaloguj się ponownie i spróbuj jeszcze raz.",
  validation_failed: "Sprawdź wpisane dane i spróbuj ponownie.",
  // The dev panel's stand-in client (development only).
  ui_preview: "Podgląd UI: nic nie zostało wysłane.",
};

/** Every message above, for the dev panel's list of toasts. */
export const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = MESSAGES;

export const GENERIC_ERROR = "Coś poszło nie tak. Spróbuj ponownie za chwilę.";

export function authErrorMessage(error: AuthErrorLike): string {
  if (!error) return GENERIC_ERROR;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.status === 429) return MESSAGES.over_request_rate_limit;
  return GENERIC_ERROR;
}

/** A failure the visitor can do nothing about but wait — the form keeps their input and tries again later. */
export const isRateLimited = (error: AuthErrorLike) =>
  error?.status === 429 || error?.code === "over_email_send_rate_limit" || error?.code === "over_request_rate_limit";
