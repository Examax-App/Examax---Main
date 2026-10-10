import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/*
 * "Kontynuuj przez Google" on our own domain. Through Supabase's redirect,
 * Google's screen reads "to continue to <project>.supabase.co", and Google's
 * brand verification (name and logo instead of the domain) needs every
 * return domain to be one we own — supabase.co never can be. So our server
 * runs the Google step (app/auth/google), returning to
 * <origin>/auth/google/callback, and hands Google's signed ID token to
 * Supabase (`signInWithIdToken`), which checks Google's signature, the
 * audience (the same client ID as the Supabase Google provider) and the
 * nonce. The account is the same either way.
 *
 * The round trip is pinned to the browser that started it: a one-time
 * `state`, a PKCE verifier and the raw nonce sit in an httpOnly cookie, and
 * Google only ever sees the state, the PKCE challenge and the nonce's hash.
 */

export const GOOGLE_COOKIE = "examax-google-oauth";
export const GOOGLE_COOKIE_MAX_AGE = 10 * 60;

const base64url = (bytes: Buffer) => bytes.toString("base64url");
const sha256 = (value: string) => createHash("sha256").update(value).digest();

export function googleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export const googleRedirectUri = (origin: string) => `${origin}/auth/google/callback`;

export type GoogleRoundTrip = { state: string; verifier: string; nonce: string; next: string };

/** Everything one round trip needs: what goes in the cookie, and the URL to send the browser to. */
export function startGoogleRoundTrip(origin: string, clientId: string, next: string) {
  const trip: GoogleRoundTrip = {
    state: base64url(randomBytes(24)),
    verifier: base64url(randomBytes(48)),
    nonce: base64url(randomBytes(24)),
    next,
  };
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state: trip.state,
    // Supabase compares the token's nonce with the SHA-256 of the raw one.
    nonce: sha256(trip.nonce).toString("hex"),
    code_challenge: base64url(sha256(trip.verifier)),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return { trip, url };
}

export function readRoundTrip(raw: string | undefined): GoogleRoundTrip | null {
  if (!raw) return null;
  try {
    const trip = JSON.parse(raw) as Partial<GoogleRoundTrip>;
    if (typeof trip.state === "string" && typeof trip.verifier === "string" && typeof trip.nonce === "string" && typeof trip.next === "string") {
      return trip as GoogleRoundTrip;
    }
  } catch {}
  return null;
}

export function sameState(expected: string, received: string | null) {
  if (!received) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Trades Google's code for its ID token (server to server, with the client secret and the PKCE verifier). */
export async function exchangeGoogleCode({ code, verifier, origin }: { code: string; verifier: string; origin: string }) {
  const credentials = googleCredentials();
  if (!credentials) return null;
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        code,
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        redirect_uri: googleRedirectUri(origin),
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const { id_token: idToken } = (await response.json()) as { id_token?: string };
    return idToken ?? null;
  } catch {
    return null;
  }
}
