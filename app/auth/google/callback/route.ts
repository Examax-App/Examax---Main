import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GOOGLE_COOKIE, exchangeGoogleCode, readRoundTrip, sameState } from "@/lib/auth/google";
import { safeNext } from "@/lib/auth/redirect";

/**
 * Where Google sends people back. The state must match the cookie this
 * browser got on the way out; then Google's code becomes its ID token, and
 * Supabase turns that into a session (it verifies the token and the nonce).
 * Any failure lands on /login with a short reason.
 */
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const trip = readRoundTrip(request.cookies.get(GOOGLE_COOKIE)?.value);

  const finish = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin));
    response.cookies.set(GOOGLE_COOKIE, "", { path: "/auth/google", maxAge: 0 });
    return response;
  };

  if (searchParams.get("error")) return finish(`/login?error=${searchParams.get("error") === "access_denied" ? "cancelled" : "oauth"}`);
  const code = searchParams.get("code");
  if (!trip || !code || !sameState(trip.state, searchParams.get("state"))) return finish("/login?error=oauth");

  const idToken = await exchangeGoogleCode({ code, verifier: trip.verifier, origin });
  if (!idToken) return finish("/login?error=oauth");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken, nonce: trip.nonce });
  if (error) {
    console.error("Google sign-in: Supabase refused the ID token:", error.code ?? error.message);
    return finish("/login?error=oauth");
  }
  return finish(safeNext(trip.next));
}
