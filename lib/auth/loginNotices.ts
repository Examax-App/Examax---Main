/*
 * What /login says when it is reached with `?error=` or `?notice=` — after a
 * provider sends someone back, a session expires, or an address is
 * confirmed. One list, read by the login page and the dev panel.
 */

export const LOGIN_ERRORS: Record<string, string> = {
  oauth: "Nie udało się zalogować. Spróbuj ponownie.",
  cancelled: "Logowanie zostało przerwane.",
  session: "Twoja sesja wygasła. Zaloguj się ponownie.",
  expired: "Logowanie trwało zbyt długo. Spróbuj ponownie.",
  "rate-limited": "Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.",
};

export const LOGIN_NOTICES: Record<string, string> = {
  confirmed: "Adres e-mail został potwierdzony. Zaloguj się, aby kontynuować.",
};
