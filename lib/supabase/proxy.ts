import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, sessionCookieOptions, supabaseEnv } from "@/lib/supabase/env";
import { AFTER_SIGN_IN, GUEST_ROUTES, PROTECTED_ROUTES, isUnder } from "@/lib/auth/redirect";

/**
 * Keeps the session fresh and routes by it (Supabase's SSR pattern). The
 * access token is short-lived; `getClaims()` verifies it and, when it has
 * expired, trades the refresh token for a new pair, which is written back
 * onto both the request (for this render) and the response (for the
 * browser). Nothing may run between creating the client and `getClaims()`,
 * or a refresh could be lost and the visitor signed out at random.
 *
 * This is the optimistic check only: every protected page verifies the user
 * again on the server before showing anything.
 */
export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const { url, publishableKey } = supabaseEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookieOptions: sessionCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        // Supabase asks for the refreshed response not to be cached anywhere.
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string) => {
    const target = request.nextUrl.clone();
    const [targetPath, targetQuery] = path.split("?");
    target.pathname = targetPath;
    target.search = targetQuery ? `?${targetQuery}` : "";
    const redirect = NextResponse.redirect(target);
    // Keep any refreshed session cookies on the redirect too.
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  };

  if (!signedIn && isUnder(pathname, PROTECTED_ROUTES)) {
    return redirectTo(`/login?next=${encodeURIComponent(pathname + search)}`);
  }
  if (signedIn && isUnder(pathname, GUEST_ROUTES)) {
    return redirectTo(AFTER_SIGN_IN);
  }

  return response;
}
