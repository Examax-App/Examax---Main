import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { sessionCookieOptions, supabaseEnv } from "@/lib/supabase/env";

/**
 * Supabase on the server — Server Components, Server Actions and Route
 * Handlers — acting as the signed-in visitor through their session cookies.
 * Create one per request; never share it.
 *
 * A Server Component cannot write cookies, so `setAll` swallows that error:
 * the proxy (proxy.ts) has already refreshed the session for the request.
 */
export async function createClient() {
  const { url, publishableKey } = supabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookieOptions: sessionCookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component; the proxy keeps the session fresh.
        }
      },
    },
  });
}
