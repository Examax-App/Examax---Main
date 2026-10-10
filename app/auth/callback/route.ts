import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AFTER_SIGN_IN, providerErrorReason, safeNext } from "@/lib/auth/redirect";

/**
 * Where Google and Microsoft send people back (and Supabase's fallback for
 * an e-mail link when the templates are left at their defaults). The `code`
 * is traded for a session using the PKCE verifier the browser stored before
 * it left, so a code replayed from anywhere else is worthless. Any failure
 * lands on /login with a short reason; nothing from the provider's error
 * text is echoed back.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const providerError = searchParams.get("error");
  // Set by /auth/confirm when an e-mail link (a default template) came back with a code.
  const fromEmail = searchParams.get("source") === "email";
  const to = (path: string) => NextResponse.redirect(new URL(path, origin));

  if (providerError) {
    const errorCode = searchParams.get("error_code");
    // An e-mail link that was already used or has expired comes back this way too.
    if (errorCode === "otp_expired") return to("/verify?error=expired");
    return to(`/login?error=${providerErrorReason(providerError, errorCode)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Only an activation link earns the green "verified" toast; a reset or
      // set-password link goes on to /reset-password, a sign-in link just in.
      const activation = fromEmail && next === AFTER_SIGN_IN && searchParams.get("intent") !== "login";
      return to(activation ? `${AFTER_SIGN_IN}?notice=verified` : next);
    }
    // Supabase confirmed the address before sending the code; the code only
    // fails when the link was opened in another browser. Say so, and ask for
    // a sign-in instead of reporting an error.
    if (fromEmail) return to("/login?notice=confirmed");
  }

  return to("/login?error=oauth");
}
