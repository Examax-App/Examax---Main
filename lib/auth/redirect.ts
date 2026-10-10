/*
 * Where auth sends people. One place, so the proxy, the callbacks and the
 * forms can never disagree about which pages need a session.
 */

/** Where a finished sign-in lands while the dashboard is being built. */
export const AFTER_SIGN_IN = "/welcome";

/** Pages that need a session; without one the proxy sends the visitor to /login. */
export const PROTECTED_ROUTES = ["/welcome", "/reset-password"];

/** Pages a signed-in visitor has no use for; the proxy sends them on to AFTER_SIGN_IN. */
export const GUEST_ROUTES = ["/login", "/signup"];

export const isUnder = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

/**
 * What a provider's or Supabase's error on the way back means for /login
 * (`?error=`): the sign-in took too long, too many attempts, the visitor
 * cancelled, or something else went wrong.
 */
export function providerErrorReason(error: string | null, errorCode: string | null, description = "") {
  if (errorCode === "bad_oauth_state" || errorCode === "flow_state_expired" || /expired/i.test(description)) return "expired";
  if (errorCode === "over_request_rate_limit" || errorCode === "over_email_send_rate_limit" || errorCode === "too_many_requests") return "rate-limited";
  if (error === "access_denied") return "cancelled";
  return "oauth";
}

/**
 * A `next` parameter made safe to redirect to: only a path on this site.
 * Anything else — another origin, a protocol-relative "//host", a backslash
 * trick — falls back, so a crafted link can never bounce a fresh session
 * off to someone else's page.
 */
export function safeNext(value: string | null | undefined, fallback = AFTER_SIGN_IN) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const url = new URL(value, "https://examax.app");
    return url.origin === "https://examax.app" ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}
