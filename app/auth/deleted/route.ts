import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * A browser still holding a session for an account that no longer exists
 * (deleted from another device, or by us). The access token stays valid
 * until it expires, so the proxy lets it through; /welcome then asks
 * Supabase for the user, learns it is gone and sends it here. The leftover
 * cookies are cleared — they can only be written in a route like this one —
 * and the visitor lands on a page that says what happened.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  return NextResponse.redirect(new URL("/account-deleted", request.nextUrl.origin));
}
