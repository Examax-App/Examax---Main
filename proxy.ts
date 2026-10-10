import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { providerErrorReason } from "@/lib/auth/redirect";

/**
 * Runs before the account pages only: it refreshes the Supabase session and
 * sends visitors to the right side of the sign-in wall (lib/supabase/proxy.ts).
 * The marketing site never reads a session, so it stays static and untouched.
 *
 * The homepage is matched for the cases where Supabase falls back to the
 * Site URL: a return address not on its Redirect URLs list arrives with the
 * OAuth `?code=`, which is passed on to /auth/callback; a sign-in that took
 * longer than Supabase allows (its state lasts about five minutes) arrives
 * with `?error=`, which goes to /login with a message. Any other visit to
 * "/" goes straight through.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/") {
    if (searchParams.has("code")) {
      const callback = request.nextUrl.clone();
      callback.pathname = "/auth/callback";
      return NextResponse.redirect(callback);
    }
    if (searchParams.has("error") && searchParams.has("error_description")) {
      const reason = providerErrorReason(searchParams.get("error"), searchParams.get("error_code"), searchParams.get("error_description") ?? "");
      return NextResponse.redirect(new URL(`/login?error=${reason}`, request.nextUrl.origin));
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/", "/welcome/:path*", "/reset-password/:path*", "/login/:path*", "/signup/:path*", "/verify/:path*", "/auth/:path*"],
};
