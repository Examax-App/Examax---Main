import { NextResponse, type NextRequest } from "next/server";
import { GOOGLE_COOKIE, GOOGLE_COOKIE_MAX_AGE, googleCredentials, startGoogleRoundTrip } from "@/lib/auth/google";
import { safeNext } from "@/lib/auth/redirect";

/** "Kontynuuj przez Google": leaves for Google's sign-in, returning to this site (lib/auth/google.ts). */
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  // Off unless GOOGLE_SIGN_IN_VIA_SITE is on (lib/auth/providers.ts): until then Google signs in through Supabase.
  if (process.env.GOOGLE_SIGN_IN_VIA_SITE !== "true") return NextResponse.redirect(new URL("/login", origin));
  const credentials = googleCredentials();
  if (!credentials) {
    console.error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set (see .env.example).");
    return NextResponse.redirect(new URL("/login?error=oauth", origin));
  }

  const { trip, url } = startGoogleRoundTrip(origin, credentials.clientId, safeNext(searchParams.get("next")));
  const response = NextResponse.redirect(url);
  response.cookies.set(GOOGLE_COOKIE, JSON.stringify(trip), {
    httpOnly: true,
    secure: origin.startsWith("https://"),
    // Lax: the cookie comes back on Google's top-level redirect, never on a cross-site request.
    sameSite: "lax",
    path: "/auth/google",
    maxAge: GOOGLE_COOKIE_MAX_AGE,
  });
  return response;
}
